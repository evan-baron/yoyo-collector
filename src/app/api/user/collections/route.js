import { NextResponse } from 'next/server';
import collectionsService from '@/services/collectionsService';

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

// Creat new collection
export async function POST(req, res) {
	try {
		const userId = await getUserIdFromToken();

		if (!userId) {
			throw new Error('User ID is missing');
		}

		const { collection } = await req.json();

		const valid = (param) => /^[A-Za-z0-9\-_.~()"' ]+$/.test(param);

		const trimmed = collection?.trim();

		if (!valid(trimmed) || !trimmed) {
			return NextResponse.json(
				{ message: 'No collection name entered' },
				{ status: 400 }
			);
		}

		const response = await createCollection(userId, collection);

		return NextResponse.json(response, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ 'There was an error at /api/user/collections POST': error.message },
			{ status: 500 }
		);
	}
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

		if (response.user_id) {
			delete response.user_id;
		}

		return NextResponse.json(response, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ 'There was an error at /api/user/collections GET': error.message },
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
			{ 'There was an error at /api/user/collections PATCH': error.message },
			{ status: 500 }
		);
	}
}
