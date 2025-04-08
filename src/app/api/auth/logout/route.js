import { authenticateUser } from '@/middlewares/authMiddleware';
import { cookies } from 'next/headers';
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

export async function POST(req) {
	try {
		const cookieStore = cookies();
		const sessionToken = cookieStore.get('session_token')?.value;

		const authResult = authenticateUser({
			cookies: { session_token: sessionToken },
		});

		if (authResult) {
			return NextResponse.json(
				{ message: authResult.message },
				{ status: authResult.status }
			);
		}

		const expiredCookie = serialize('session_token', '', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'Strict',
			maxAge: -1,
			path: '/',
		});

		const response = NextResponse.json({
			message: 'Logged out successfully',
		});

		response.headers.set('Set-Cookie', expiredCookie);

		return response;
	} catch (err) {
		console.error('Logout error at api/auth/logout/route.js:', err);
		return NextResponse.json({ message: 'Error logging out' }, { status: 500 });
	}
}
