import { NextResponse } from 'next/server';
import uploadsService from '@/services/uploadsService';
const { getPhotoByUserIdAndCategory } = uploadsService;

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function getUserIdFromToken() {
	const cookieStore = await cookies();
	const token = cookieStore.get('session_token')?.value;

	if (!token) throw new Error('Unauthorized');
	const { userId } = jwt.verify(token, process.env.JWT_SECRET);
	return userId;
}

export async function GET(req) {
	try {
		const userId = await getUserIdFromToken();
		const category = req.nextUrl.searchParams.get('category');

		const response = await getPhotoByUserIdAndCategory(userId, category);

		if (!response) {
			return NextResponse.json({ secure_url: null }, { status: 200 });
		}

		return NextResponse.json(response, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{
				'There was an error at /api/user/profilePictures/byHandleOrId GET':
					error.message,
			},
			{ status: 500 }
		);
	}
}
