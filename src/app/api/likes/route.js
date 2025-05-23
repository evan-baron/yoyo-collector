import { NextResponse } from 'next/server';
import likesService from '@/services/likesService';
import { getUserIdFromToken } from '@/lib/auth/getUserIdFromToken';
import { cookies } from 'next/headers';
import { validateAndExtendSession } from '@/lib/auth/validateAndExtend';
const { unlikeAnItem, likeAnItem } = likesService;

// Like an item
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

		const validLikeableItems = ['collections', 'uploads', 'yoyos'];

		const { liked_id, liked_type } = await req.json();

		if (!validLikeableItems.includes(liked_type)) {
			return NextResponse.json(
				{ 'Unrecognized item type:': liked_type },
				{ status: 403 }
			);
		}

		await likeAnItem(userId, liked_type, liked_id);

		await validateAndExtendSession('api/likes/route.js POST');

		return NextResponse.json(
			{ message: 'Item liked successfully' },
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json(
			{ 'There was an error at /api/user/collections POST': error.message },
			{ status: 500 }
		);
	}
}

// Unlike an item
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

		const { liked_id, liked_type } = await req.json();

		await unlikeAnItem(userId, liked_type, liked_id);

		await validateAndExtendSession('api/likes/route.js POST');

		return NextResponse.json(
			{ message: 'Item unliked successfully' },
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json(
			{ 'There was an error at /api/user/collections POST': error.message },
			{ status: 500 }
		);
	}
}
