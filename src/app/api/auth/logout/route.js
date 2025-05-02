import { cookies } from 'next/headers';
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';
import { getUserIdFromToken } from '@/lib/auth/getUserIdFromToken';
import sessionService from '@/services/sessionService';

export async function POST(req) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('session_token')?.value;

		const { user_id, remember_me } = await sessionService.getSessionByToken(
			token
		);

		if (remember_me === 1) {
			sessionService.updateRememberMe(user_id, token);
		}

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
