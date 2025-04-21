import { NextResponse } from 'next/server';
import uploadsService from '@/services/uploadsService';
const { getPhotoByUserIdAndCategory } = uploadsService;

// Helper to parse `multipart/form-data`
export const config = {
	api: {
		bodyParser: false,
	},
};

export async function GET(req, { params }) {
	try {
		const userId = params?.userId || req.headers['x-user-id'];

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
