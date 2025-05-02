import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import userService from '@/services/userService';
const { getUserById } = userService;

export async function GET(req) {
	try {
		const authHeader = req.headers.get('authorization');
		const cookieStore = await cookies();
		const token =
			authHeader?.split(' ')[1] || cookieStore.get('session_token')?.value;

		if (!token) {
			return NextResponse.json(
				{ message: 'No token provided' },
				{ status: 200 }
			);
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await getUserById(decoded.userId);

		if (user?.password) {
			delete user.password;
		}

		if (user?.id) {
			delete user.id;
		}

		return NextResponse.json(user);
	} catch (err) {
		if (err instanceof JsonWebTokenError) {
			return NextResponse.json(
				{ message: 'Invalid or expired token' },
				{ status: 200 }
			);
		} else {
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
}
