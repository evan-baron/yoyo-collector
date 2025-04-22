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
		return NextResponse.json({ error: error.message }, { status: 500 });
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

// export async function GET(req) {
// 	try {
// 		const userId = getUserIdFromToken();

// 		if (!userId) {
// 			throw new Error('User ID is required');
// 		}

// 		const profilePhoto = await getPhotoByUserIdAndCategory(userId, 'profile');

// 		if (!profilePhoto) {
// 			return NextResponse.json(
// 				{ error: 'Profile picture not found' },
// 				{ status: 404 }
// 			);
// 		}

// 		return NextResponse.json(profilePhoto);
// 	} catch (error) {
// 		return NextResponse.json({ error: error.message }, { status: 500 });
// 	}
// }

// export async function PATCH(req) {
// 	try {
// 		const userId = getUserIdFromToken(); // Decoded from JWT in cookie
// 		if (!userId) {
// 			throw new Error('User ID is missing');
// 		}

// 		// Get the image buffer from the request
// 		const buffers = [];
// 		const readable = Readable.from(req.body);
// 		for await (const chunk of readable) {
// 			buffers.push(chunk);
// 		}
// 		const buffer = Buffer.concat(buffers);

// 		// Upload the image to Cloudinary
// 		const result = await new Promise((resolve, reject) => {
// 			const stream = cloudinary.uploader.upload_stream(
// 				{
// 					folder: 'assets/profile_uploads',
// 					upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET_PROFILE,
// 				},
// 				(error, result) => {
// 					if (error) return reject(error);
// 					resolve(result);
// 				}
// 			);
// 			stream.end(buffer);
// 		});

// 		// Update the profile picture info in the DB
// 		await updateProfilePicture(
// 			userId,
// 			result.public_id,
// 			result.secure_url,
// 			result.format,
// 			result.resource_type,
// 			result.bytes,
// 			result.height,
// 			result.width
// 		);

// 		return NextResponse.json(
// 			{ message: 'Profile picture updated successfully' },
// 			{ status: 200 }
// 		);
// 	} catch (error) {
// 		console.error('PATCH error:', error);
// 		return NextResponse.json({ error: error.message }, { status: 500 });
// 	}
// }
