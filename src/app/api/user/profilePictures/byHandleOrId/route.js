import { NextResponse } from 'next/server';
import uploadsService from '@/services/uploadsService';
const { getPhotoByUserIdAndCategory } = uploadsService;
import { getUserIdFromToken } from '@/lib/auth/getUserIdFromToken';
import { headers, cookies } from 'next/headers';

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
