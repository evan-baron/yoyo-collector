import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import collectionsService from '@/services/collectionsService';
import uploadsService from '@/services/uploadsService';
import { getUserIdFromToken } from '@/lib/auth/getUserIdFromToken';
import { cookies } from 'next/headers';
import { validateAndExtendSession } from '@/lib/auth/validateAndExtend';

const { getCollectionById } = collectionsService;

const {
	uploadPhoto,
	getAllCollectionPhotos,
	updateCoverPhoto,
	deletePhoto,
	switchCoverPhoto,
} = uploadsService;

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Uploading Collection Pictures
export async function POST(req, res) {
	try {
		const { userId, valid } = await getUserIdFromToken({
			cookies,
		});

		if (!userId) {
			throw new Error('User ID is missing');
		}

		if (!valid) {
			throw new Error('Token no longer valid');
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
					message:
						'UserId and table.userId dont match at api/user/collectionPictures',
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

			await validateAndExtendSession(
				'api/user/collectionPictures/route.js POST'
			);

			return NextResponse.json(uploadResponse, { status: 201 });
		} else if (category === 'cover' && uploadAction === 'update') {
			const allPhotos = await getAllCollectionPhotos(collectionId);

			const existingCover = allPhotos.find(
				(photo) => photo.upload_category === 'cover'
			);

			if (!existingCover) {
				return NextResponse.json(
					{
						message: 'No existing cover photo found for this collection',
					},
					{ status: 404 }
				);
			}

			// Destroy the old cover photo
			await cloudinary.uploader.destroy(existingCover.public_id);

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

			await validateAndExtendSession(
				'api/user/collectionPictures/route.js POST'
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

			await validateAndExtendSession(
				'api/user/collectionPictures/route.js POST'
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
		const { userId, valid } = await getUserIdFromToken({
			cookies,
		});

		if (!userId) {
			throw new Error('User ID is missing');
		}

		if (!valid) {
			throw new Error('Token no longer valid');
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

		await validateAndExtendSession(
			'api/user/collectionPictures/route.js DELETE'
		);

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

// Changing Cover Photo
export async function PATCH(req, res) {
	try {
		const { collectionId, newCover } = await req.json();

		const allPhotos = await getAllCollectionPhotos(collectionId);

		const existingCover = allPhotos.find(
			(photo) => photo.upload_category === 'cover'
		);

		if (!existingCover) {
			// do nothing, handling this gracefully
		}

		const { id: oldCover } = existingCover;

		// change existing cover photo to collection photo, new photo id from collection to cover

		const response = await switchCoverPhoto(oldCover, newCover, collectionId);

		await validateAndExtendSession('api/user/collectionPictures/route.js POST');

		return NextResponse.json(response, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{
				'There was an error changing the cover photo at /api/user/collectionPictures PATCH':
					error.message,
			},
			{ status: 500 }
		);
	}
}
