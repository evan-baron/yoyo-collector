import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import uploadsService from '@/services/uploadsService';
import { getUserIdFromToken } from '@/lib/auth/getUserIdFromToken';
import { cookies } from 'next/headers';
import { validateAndExtendSession } from '@/lib/auth/validateAndExtend';

const { getAllYoyoPhotos, deletePhoto, setMainYoyoPhoto, switchMainYoyoPhoto } =
	uploadsService;

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Delete Yoyo Picture
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

		const jsonData = await req.json();

		const { photoId, publicId } = jsonData;

		if (publicId) {
			await cloudinary.uploader.destroy(publicId);
		}

		await deletePhoto(userId, photoId);

		await validateAndExtendSession(
			'api/user/collectionPictures/route.js DELETE'
		);

		return NextResponse.json({ message: `Yoyo picture deleted` });
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

// Changing Main Yoyo Photo
export async function PATCH(req, res) {
	try {
		const { yoyoId, photoId } = await req.json();

		const allPhotos = await getAllYoyoPhotos(yoyoId);

		const existingMainPhoto = allPhotos.find(
			(photo) => photo.main_yoyo_photo === 1
		);

		if (!existingMainPhoto) {
			const response = await setMainYoyoPhoto(photoId, yoyoId);

			return NextResponse.json(response, { status: 201 });
		}

		const { id: oldMainPhoto } = existingMainPhoto;

		// change existing cover photo to collection photo, new photo id from collection to cover

		const response = await switchMainYoyoPhoto(oldMainPhoto, photoId, yoyoId);

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
