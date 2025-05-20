import { NextResponse } from 'next/server';
import collectionsService from '@/services/collectionsService';
import { getUserIdFromToken } from '@/lib/auth/getUserIdFromToken';
import { cookies } from 'next/headers';
import { validateAndExtendSession } from '@/lib/auth/validateAndExtend';

const { createCollection, getCollectionByName, getAllCollectionsById } =
	collectionsService;

// Create new collection
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

		const { collection } = await req.json();

		const nameValid = (param) => /^[A-Za-z0-9\-_.~()"' ]+$/.test(param);

		const trimmed = collection?.trim();

		if (!nameValid(trimmed) || !trimmed) {
			return NextResponse.json(
				{ message: 'No collection name entered' },
				{ status: 400 }
			);
		}

		await createCollection(userId, collection);

		const response = await getCollectionByName(userId, collection);

		await validateAndExtendSession('api/user/collections/route.js POST');

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
		const url = new URL(req.url);
		const profileId = url.searchParams.get('profileId');

		let response;

		if (profileId) {
			console.log('there was a profileId');
			response = await getAllCollectionsById(profileId);
		} else {
			console.log('there was no profileId');
			const { userId, valid } = await getUserIdFromToken({
				cookies,
			});

			if (!userId) {
				throw new Error('User ID is missing');
			}

			if (!valid) {
				throw new Error('Token no longer valid');
			}

			response = await getAllCollectionsById(userId);
		}

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
