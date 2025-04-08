import { login } from '@/services/authService';
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

export async function POST(req) {
	try {
		const { email, password, checked } = await req.json();

		const { user, token } = await login(email, password, checked);

		const cookie = serialize('session_token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'Strict',
			maxAge: 60 * 60 * 1000, // 1 hour expiration
			path: '/',
		});

		const response = NextResponse.json({
			message: 'User logged in successfully!',
			user,
			token,
		});

		response.headers.set('Set-Cookie', cookie);

		return response;
	} catch (err) {
		console.log('Login error at api/auth/login/route.js:', err);
		return NextResponse.json({ message: err.message }, { status: 500 });
	}
}
