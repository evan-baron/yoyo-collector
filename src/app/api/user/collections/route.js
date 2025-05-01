import { NextResponse } from 'next/server';
import collectionsService from '@/services/collectionsService';
import { getUserIdFromToken } from '@/lib/auth/getUserIdFromToken';
import { headers, cookies } from 'next/headers';

const { createCollection, getCollectionByName, getAllCollectionsById } =
	collectionsService;

// Creat new collection
export async function POST(req, res) {
	try {
		const userId = await getUserIdFromToken({
			headers,
			cookies,
		});

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

		await createCollection(userId, collection);

		const response = await getCollectionByName(userId, collection);

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
		const userId = await getUserIdFromToken({
			headers,
			cookies,
		});

		if (!userId) {
			throw new Error('User ID is missing');
		}

		const response = await getAllCollectionsById(userId);

		const collections = response.map(
			({ user_id, ...collection }) => collection
		);

		return NextResponse.json(collections, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ 'There was an error at /api/user/collections GET': error.message },
			{ status: 500 }
		);
	}
}
