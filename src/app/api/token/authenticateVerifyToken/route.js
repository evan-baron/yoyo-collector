import userService from '@/services/userService';
const { getTokenData } = userService;
import { NextResponse } from 'next/server';

export async function PUT(req) {
	try {
		const { token, id } = await req.json();

		if (!token) {
			return NextResponse.json(
				{ message: 'Token is required.' },
				{ status: 400 }
			);
		}

		// Update email_verified on user and token_used on token
		await userService.updateVerified(id, token);

		// Grab the user data and send back to frontend
		const userData = await userService.getUserById(id);

		return NextResponse.json({
			userData,
		});
	} catch (err) {
		console.error(
			'Error in authenticateVerifyToken route at api/token/authenticateVerifyToken/route.js:',
			err.message
		);
		return NextResponse.json({ message: 'Server error' }, { status: 500 });
	}
}
