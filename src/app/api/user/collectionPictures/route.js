import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import collectionsService from '@/services/collectionsService';
import uploadsService from '@/services/uploadsService';

const { getCollectionById } = collectionsService;

const { uploadPhoto, getAllCollectionPhotos, updateCoverPhoto, deletePhoto } =
	uploadsService;

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function getUserIdFromToken() {
	const cookieStore = await cookies();
	const token = cookieStore.get('session_token')?.value;

	if (!token) throw new Error('Unauthorized');
	const { userId } = jwt.verify(token, process.env.JWT_SECRET);
	return userId;
}

// Uploading Collection Pictures
export async function POST(req, res) {
	try {
		const userId = await getUserIdFromToken();

		if (!userId) {
			throw new Error('User ID is missing');
		}

		const {
			public_id,
			secure_url,
			format,
			resource_type,
			bytes,
			height,
			width,
			category,
			uploadAction,
			collectionId,
		} = await req.json();

		const response = await getCollectionById(collectionId);

		if (userId !== response.collectionData.user_id)
			return NextResponse.json(
				{
					'UserId and table.userId dont match at api/user/collectionPictures':
						error.message,
				},
				{ status: 500 }
			);

		if (category === 'cover' && uploadAction === 'new') {
			const uploadResponse = await uploadPhoto(
				userId,
				public_id,
				secure_url,
				format,
				resource_type,
				bytes,
				height,
				width,
				category,
				collectionId
			);

			return NextResponse.json(uploadResponse, { status: 201 });
		} else if (category === 'cover' && uploadAction === 'update') {
			const allPhotos = await getAllCollectionPhotos(collectionId);

			const public_id = allPhotos.find(
				(photo) => photo.upload_category === 'cover'
			).public_id;

			if (!public_id) {
				return NextResponse.json(
					{
						'Unable to find public_id for cover photo at api/user/collectionPictures':
							error.message,
					},
					{ status: 500 }
				);
			}

			await cloudinary.uploader.destroy(public_id);

			// NEED TO ADD UPDATE COVER PHOTO LOGIC
			const uploadResponse = await updateCoverPhoto(
				userId,
				public_id,
				secure_url,
				format,
				resource_type,
				bytes,
				height,
				width,
				collectionId
			);

			return NextResponse.json(uploadResponse, { status: 201 });
		} else {
			const uploadResponse = await uploadPhoto(
				userId,
				public_id,
				secure_url,
				format,
				resource_type,
				bytes,
				height,
				width,
				category,
				collectionId
			);

			return NextResponse.json(uploadResponse, { status: 201 });
		}
	} catch (error) {
		return NextResponse.json(
			{
				'There was an error at /api/user/collectionPictures POST':
					error.message,
			},
			{ status: 500 }
		);
	}
}

// Deleting Collection Pictures
export async function DELETE(req, res) {
	try {
		const userId = await getUserIdFromToken();

		if (!userId) {
			throw new Error('User ID is missing');
		}

		const { collection, uploadType } = await req.json();

		const photos = await getAllCollectionPhotos(collection);

		const { public_id, id: photoId } = photos.find(
			(photo) => photo.upload_category === 'cover'
		);

		if (public_id) {
			await cloudinary.uploader.destroy(public_id);
		}

		await deletePhoto(userId, photoId);

		return NextResponse.json({ message: `${uploadType} picture deleted` });
	} catch (error) {
		return NextResponse.json(
			{
				'There was an error deleting a picture at /api/user/collectionPictures DELETE':
					error.message,
			},
			{ status: 500 }
		);
	}
}
