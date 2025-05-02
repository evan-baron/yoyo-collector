import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import uploadsService from '@/services/uploadsService';
const {
	deletePhoto,
	getPhotoById,
	getPhotosByUserIdAndCategory,
	updateProfilePicture,
	uploadPhoto,
} = uploadsService;
import { getUserIdFromToken } from '@/lib/auth/getUserIdFromToken';
import { headers, cookies } from 'next/headers';

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Uploading Profile Pictures
export async function POST(req, res) {
	try {
		const { userId, valid } = await getUserIdFromToken({
			headers,
			cookies,
		});

		if (!userId) {
			throw new Error('User ID is missing');
		}

		if (!valid) {
			throw new Error('Token no longer valid');
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
			uploadAction,
		} = await req.json();

		if (category === 'profile' && uploadAction === 'new') {
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
		} else if (category === 'profile' && uploadAction === 'update') {
			const response = await getPhotosByUserIdAndCategory(userId, 'profile');

			if (response.public_id) {
				await cloudinary.uploader.destroy(response.public_id);
			}

			const uploadResponse = await updateProfilePicture(
				userId,
				public_id,
				secure_url,
				format,
				resource_type,
				bytes,
				height,
				width
			);

			return NextResponse.json(uploadResponse, { status: 201 });
		} else {
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
		}
	} catch (error) {
		return NextResponse.json(
			{ 'There was an error at /api/user/profilePictures POST': error.message },
			{ status: 500 }
		);
	}
}

// Getting Current User Profile Picture
export async function GET(req) {
	try {
		const { userId, valid } = await getUserIdFromToken({
			headers,
			cookies,
		});

		if (!userId) {
			throw new Error('User ID is missing');
		}

		if (!valid) {
			throw new Error('Token no longer valid');
		}

		const type = req.nextUrl.searchParams.get('type');

		const response = await getPhotosByUserIdAndCategory(userId, type);

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

export async function DELETE(req) {
	try {
		const { userId, valid } = await getUserIdFromToken({
			headers,
			cookies,
		});

		if (!userId) {
			throw new Error('User ID is missing');
		}

		if (!valid) {
			throw new Error('Token no longer valid');
		}

		const category = req.nextUrl.searchParams.get('category');

		const response = await getPhotosByUserIdAndCategory(userId, category);

		const { public_id } = response[0];

		if (public_id) {
			await cloudinary.uploader.destroy(public_id);
		}

		await deletePhoto(userId, null, category);

		return NextResponse.json({ message: `${category} picture deleted` });
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
