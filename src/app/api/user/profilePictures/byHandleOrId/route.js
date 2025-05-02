import { NextResponse } from 'next/server';
import uploadsService from '@/services/uploadsService';
const { getPhotosByUserIdAndCategory } = uploadsService;

// Getting a different user's photos
export async function GET(req) {
	try {
		const id = req.nextUrl.searchParams.get('id');
		const category = req.nextUrl.searchParams.get('category');

		const response = await getPhotosByUserIdAndCategory(id, category);

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
