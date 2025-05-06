import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import collectionsService from '@/services/collectionsService';
import uploadsService from '@/services/uploadsService';
import { getUserIdFromToken } from '@/lib/auth/getUserIdFromToken';
import { cookies } from 'next/headers';
import { validateAndExtendSession } from '@/lib/auth/validateAndExtend';

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const { deleteCollection, getCollectionById, updateCollection } =
	collectionsService;

const { getAllCollectionPhotosByUserId, deleteUploadsByCollectionId } =
	uploadsService;

// Get collection by collectionId
export async function GET(req, res) {
	try {
		const url = new URL(req.url);
		const collectionId = url.searchParams.get('collectionId');

		const response = await getCollectionById(collectionId);

		if (!response) {
			return NextResponse.json(
				{ error: 'Collection not found' },
				{ status: 404 }
			);
		}

		if (response.collectionData.user_id) {
			delete response.collectionData.user_id;
		}

		if (response.collectionPhotos.length > 0) {
			response.collectionPhotos = response.collectionPhotos.map(
				({
					user_id,
					bytes,
					format,
					height,
					resource_type,
					updated_at,
					width,
					...rest
				}) => rest
			);
		}

		return NextResponse.json(response, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{
				'There was an error at /api/user/collections/byCollectionId GET':
					error.message,
			},
			{ status: 500 }
		);
	}
}

// Update collection by collectionId
export async function PATCH(req, res) {
	try {
		const { title, description, id } = await req.json();

		const response = await updateCollection(title, id, description);

		await validateAndExtendSession(
			'api/user/collections/byCollectionId/route.js PATCH'
		);

		return NextResponse.json(response, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{
				'There was an error at /api/user/collections/byCollectionId PATCH':
					error.message,
			},
			{ status: 500 }
		);
	}
}

// Delete collection by collectionId
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

		const { id } = await req.json();

		const getAllCollectionPhotosResponse = await getAllCollectionPhotosByUserId(
			userId,
			id
		);

		const publicIds = getAllCollectionPhotosResponse.map(
			(photo) => photo.public_id
		);

		await Promise.all(publicIds.map((id) => cloudinary.uploader.destroy(id)));

		const deleteCollectionResponse = await deleteCollection(userId, id);
		const deleteUploadsResponse = await deleteUploadsByCollectionId(userId, id);

		const response = {
			collection: deleteCollectionResponse,
			uploads: deleteUploadsResponse,
		};

		await validateAndExtendSession(
			'api/user/collections/byCollectionId/route.js DELETE'
		);

		return NextResponse.json(response, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{
				'There was an error deleting the collection at /api/user/collections/byCollectionId DELETE':
					error.message,
			},
			{ status: 500 }
		);
	}
}
