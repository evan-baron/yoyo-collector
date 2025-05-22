import { NextResponse } from 'next/server';
import collectionsService from '@/services/collectionsService';
import { getUserIdFromToken } from '@/lib/auth/getUserIdFromToken';
import { cookies } from 'next/headers';

const { getAllCollectionsById } = collectionsService;

// GET all collections
export async function GET(req, res) {
	try {
		const url = new URL(req.url);
		const profileId = url.searchParams.get('profileId');

		let response;

		if (profileId) {
			response = await getAllCollectionsById(profileId);
		} else {
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
