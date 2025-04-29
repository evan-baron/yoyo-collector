import { NextResponse } from 'next/server';
import collectionsService from '@/services/collectionsService';

const { createCollection, getAllCollectionsById } = collectionsService;

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function getUserIdFromToken() {
	const cookieStore = await cookies();
	const token = cookieStore.get('session_token')?.value;

	if (!token) throw new Error('Unauthorized');

	try {
		const { userId } = jwt.verify(token, process.env.JWT_SECRET);
		return userId;
	} catch (err) {
		console.error('JWT verification failed:', err);
		throw new Error('Invalid or expired token');
	}
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

// GET all collections
export async function GET(req, res) {
	try {
		const userId = await getUserIdFromToken();

		if (!userId) {
			throw new Error('User ID is missing');
		}

		const response = await getAllCollectionsById(userId);

		const collections = response.map(
			({ user_id, ...collection }) => collection
		);

		return NextResponse.json(collections, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ 'There was an error at /api/user/collections POST': error.message },
			{ status: 500 }
		);
	}
}
