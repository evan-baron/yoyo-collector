import userService from '@/services/userService';
import { NextResponse } from 'next/server';
import { generateSecureToken } from '@/lib/utils/generateToken';
import sessionService from '@/services/sessionService';

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

		// // Create token for new user/login
		// const sessionToken = generateSecureToken();

		// // Create session for new user (0 for rememberMe because they didn't check the box yet)
		// await sessionService.createSession(id, sessionToken, 0);

		// // Grab the user data and send back to frontend
		// const userData = await userService.getUserById(id);

		return NextResponse.json({
			validated: true,
		});
	} catch (err) {
		console.error(
			'Error in authenticateVerifyToken route at api/token/authenticateVerifyToken/route.js:',
			err.message
		);
		return NextResponse.json({ message: 'Server error' }, { status: 500 });
	}
}
