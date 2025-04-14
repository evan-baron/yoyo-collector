import userService from '@/services/userService';
const { updatePassword } = userService;
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/utils/rateLimiter';

export async function POST(req) {
	try {
		const { password, token } = await req.json();
		const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		await checkRateLimit(ip);

		const passwordValid =
			password.length >= 8 &&
			/[A-Z]/.test(password) &&
			/\d/.test(password) &&
			/[!@#$%^&*()_+{}\[\]:;"'<>,.?/|\\~]/.test(password);

		if (!passwordValid) {
			const response = NextResponse.json(
				{
					message:
						'Your password must be at least 8 characters long, contain one uppercase character, and one special character',
				},
				{ status: 400 }
			);

			return response;
		}

		if (!token) {
			return NextResponse.json(
				{ message: 'Reset token is required.' },
				{ status: 400 }
			);
		}

		if (typeof token !== 'string' || token.length > 512) {
			return NextResponse.json(
				{ message: 'Invalid or malformed reset token.' },
				{ status: 400 }
			);
		}

		const response = await updatePassword(password, token);

		return NextResponse.json(response, { status: 201 });
	} catch (err) {
		console.log(
			'There was an error resetting password at api/user/resetPassword/route.js:',
			err
		);
		return NextResponse.json({ message: err.message }, { status: 500 });
	}
}
