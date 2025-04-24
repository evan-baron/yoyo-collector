import { NextResponse } from 'next/server';
import userService from '@/services/userService';
const { getUserByHandle, getUserById } = userService;

export async function GET(req) {
	try {
		const url = new URL(req.url);
		const handleOrId = url.searchParams.get('handleOrId');

		console.log('backend handleOrId:', handleOrId);

		let response = await getUserByHandle(handleOrId);

		// Fallback to ID if not found by handle
		if (!response) {
			response = await getUserById(handleOrId);
		}

		if (!response) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}
		const {
			first_name,
			last_name,
			handle,
			created_at,
			city,
			state,
			country,
			privacy,
			favorite_yoyo,
			favorite_brand,
			description,
			secure_url,
		} = response;

		const user = {
			first_name,
			last_name,
			handle,
			created_at,
			city,
			state,
			country,
			privacy,
			favorite_yoyo,
			favorite_brand,
			description,
			secure_url,
		};

		return NextResponse.json(user, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{
				'There was an error at /api/user/getUser GET': error.message,
			},
			{ status: 500 }
		);
	}
}
