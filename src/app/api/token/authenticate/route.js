import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import userService from '@/services/userService';
const { getUserById } = userService;
import sessionService from '@/services/sessionService';
const { getSessionByToken } = sessionService;

export async function GET(req) {
	try {
		const cookieStore = await cookies();

		const token = cookieStore.get('session_token')?.value;

		if (!token) {
			return NextResponse.json(
				{ message: 'No token provided' },
				{ status: 200 }
			);
		}

		const session = await getSessionByToken(token);

		if (!session) {
			return NextResponse.json(
				{ message: 'Invalid or expired token' },
				{ status: 200 }
			);
		}

		const { user_id: userId, expires_at } = session;

		const tokenValid = expires_at > Date.now();

		const user = await getUserById(userId);

		if (user?.password) {
			delete user.password;
		}

		if (user?.id) {
			delete user.id;
		}

		return NextResponse.json({ user, tokenValid });
	} catch (err) {
		console.error(
			'Error during token verification at /api/token/authenticate/route.js:',
			err
		);
		return NextResponse.json(
			{ message: 'Unexpected error at api/token/authenticate' },
			{ status: 500 }
		);
	}
}
