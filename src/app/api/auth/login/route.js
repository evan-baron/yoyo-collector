import authService from '@/services/authService';
const { login } = authService;
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/utils/rateLimiter';
import validator from 'validator';

const setTokenCookie = (res, token) => {
	const cookie = serialize('session_token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'Strict',
		path: '/',
	});

	res.setHeader('Set-Cookie', cookie);
};

export async function POST(req) {
	try {
		const { email, password, checked } = await req.json();
		const ip =
			req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
			req.ip ||
			'anonymous';
		await checkRateLimit(ip);

		if (!validator.isEmail(email)) {
			const response = NextResponse.json(
				{
					message:
						'Your email must be in valid email format. E.g.: email@domain.com',
				},
				{ status: 400 }
			);

			return response;
		}

		const userInfo = await login(email, password, checked);

		const { user, token } = userInfo;

		if (user?.password) {
			delete user.password;
		}

		const response = NextResponse.json({
			message: 'User logged in successfully!',
			user,
			token,
		});

		setTokenCookie(response, token);

		return response;
	} catch (err) {
		console.log('Login error at api/auth/login/route.js:', err);
		return NextResponse.json({ message: err.message }, { status: 401 });
	}
}
