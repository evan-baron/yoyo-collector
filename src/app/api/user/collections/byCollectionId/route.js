import { NextResponse } from 'next/server';
import collectionsService from '@/services/collectionsService';
import uploadsService from '@/services/uploadsService';

const {
	createCollection,
	deleteCollection,
	getCollectionByName,
	getCollectionById,
	updateCollection,
} = collectionsService;

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function getUserIdFromToken() {
	const cookieStore = await cookies();
	const token = cookieStore.get('session_token')?.value;

	if (!token) throw new Error('Unauthorized');
	const { userId } = jwt.verify(token, process.env.JWT_SECRET);
	return userId;
}

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

		console.log('response', response);

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
