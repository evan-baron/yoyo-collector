import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { Readable } from 'stream';

// Helper to parse `multipart/form-data`
export const config = {
	api: {
		bodyParser: false,
	},
};

export async function POST(req, res) {
	try {
		const userId = req.headers['x-user-id'];

		if (!userId) {
			throw new Error('User ID is missing');
		}

		const buffers = [];

		const readable = Readable.from(req.body);
		for await (const chunk of readable) {
			buffers.push(chunk);
		}

		const buffer = Buffer.concat(buffers);

		const result = await new Promise((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream(
				{
					folder: 'assets/profile_uploads',
					upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET_PROFILE,
				},
				(error, result) => {
					if (error) return reject(error);
					resolve(result);
				}
			);
			stream.end(buffer);
		});

		// This is where I would call in a service i import at the top from, let's just say user services, that then sends the url to the db with a user id, upload type, created at, etc.?

		return NextResponse.json({ url: result.secure_url });
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
