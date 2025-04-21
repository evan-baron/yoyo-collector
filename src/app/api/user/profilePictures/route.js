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

// Helper to parse `multipart/form-data`
export const config = {
	api: {
		bodyParser: false,
	},
};

function getUserIdFromToken() {
	const cookieStore = cookies();
	const token = cookieStore.get('session_token')?.value;

	if (!token) throw new Error('Unauthorized');
	const { userId } = jwt.verify(token, process.env.JWT_SECRET);
	return userId;
}

export async function POST(req, res) {
	try {
		const userId = getUserIdFromToken();

		if (!userId) {
			throw new Error('User ID is missing');
		}

		return NextResponse.json(uploadResponse, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function DELETE(req) {
	try {
		const userId = getUserIdFromToken();

		if (!userId) {
			throw new Error('User ID is required');
		}

		await deletePhoto(userId, null, 'profile');

		return NextResponse.json({ message: 'Profile picture deleted' });
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function GET(req) {
	try {
		const userId = getUserIdFromToken();

		if (!userId) {
			throw new Error('User ID is required');
		}

		const profilePhoto = await getPhotoByUserIdAndCategory(userId, 'profile');

		if (!profilePhoto) {
			return NextResponse.json(
				{ error: 'Profile picture not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(profilePhoto);
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function PATCH(req) {
	try {
		const userId = getUserIdFromToken(); // Decoded from JWT in cookie
		if (!userId) {
			throw new Error('User ID is missing');
		}

		// Get the image buffer from the request

		// Update the profile picture info in the DB

		return NextResponse.json(
			{ message: 'Profile picture updated successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('PATCH error:', error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
