import { NextResponse } from 'next/server';
import uploadsService from '@/services/uploadsService';
const {
	deletePhoto,
	getPhotoById,
	getPhotoByUserIdAndCategory,
	updateProfilePicture,
	uploadPhoto,
} = uploadsService;

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function getUserIdFromToken() {
	const cookieStore = await cookies();
	const token = cookieStore.get('session_token')?.value;

	if (!token) throw new Error('Unauthorized');
	const { userId } = jwt.verify(token, process.env.JWT_SECRET);
	return userId;
}

// Uploading Profile Pictures
export async function POST(req, res) {
	try {
		const userId = await getUserIdFromToken();

		if (!userId) {
			throw new Error('User ID is missing');
		}

		const {
			public_id,
			secure_url,
			format,
			resource_type,
			bytes,
			height,
			width,
			category,
		} = await req.json();

		console.log(
			public_id,
			secure_url,
			format,
			resource_type,
			bytes,
			height,
			width,
			category
		);

		const uploadResponse = await uploadPhoto(
			userId,
			public_id,
			secure_url,
			format,
			resource_type,
			bytes,
			height,
			width,
			category
		);

		return NextResponse.json(uploadResponse, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ 'There was an error at /api/user/profilePictures POST': error.message },
			{ status: 500 }
		);
	}
}

// Getting Current User Profile Picture
export async function GET(req) {
	console.log('GET is activated');
	try {
		const userId = await getUserIdFromToken();

		if (!userId) {
			throw new Error('User ID is missing');
		}

		const type = req.nextUrl.searchParams.get('type');

		const response = await getPhotoByUserIdAndCategory(userId, type);

		if (!response) {
			return NextResponse.json({ secure_url: null }, { status: 200 });
		}

		return NextResponse.json(response, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ 'There was an error at /api/user/profilePictures GET': error.message },
			{ status: 500 }
		);
	}
}

// export async function DELETE(req) {
// 	try {
// 		const userId = getUserIdFromToken();

// 		if (!userId) {
// 			throw new Error('User ID is required');
// 		}

// 		await deletePhoto(userId, null, 'profile');

// 		return NextResponse.json({ message: 'Profile picture deleted' });
// 	} catch (error) {
// 		return NextResponse.json({ error: error.message }, { status: 500 });
// 	}
// }
