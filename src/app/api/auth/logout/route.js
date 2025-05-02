import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

export async function POST(req) {
	try {
		const expiredCookie = serialize('session_token', '', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'Strict',
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
