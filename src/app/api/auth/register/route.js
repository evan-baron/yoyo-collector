import authService from '@/services/authService';
const { register } = authService;
import { NextResponse } from 'next/server';
import validator from 'validator';
import { checkRateLimit } from '@/utils/rateLimiter';

export async function POST(req) {
	try {
		const { first, last, email, password } = await req.json();
		const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		await checkRateLimit(ip);

		const firstName = first.trim();
		const lastName = last.trim();
		const emailTrimmed = email.trim();

		const nameValid = /^[a-zA-Z\s'-]+$/;

		if (!nameValid.test(firstName) || !nameValid.test(lastName)) {
			const response = NextResponse.json(
				{
					message: 'Your name must only contain alphanumeric characters',
				},
				{ status: 400 }
			);

			return response;
		}

		if (!validator.isEmail(emailTrimmed)) {
			const response = NextResponse.json(
				{
					message:
						'Your email must be in valid email format. E.g.: email@domain.com',
				},
				{ status: 400 }
			);

			return response;
		}

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

		const { user } = await register(
			firstName,
			lastName,
			emailTrimmed,
			password
		);

		const response = NextResponse.json(
			{
				message: 'User registered successfully!',
				user,
			},
			{ status: 201 }
		);

		return response;
	} catch (err) {
		console.log('Error registering user at api/auth/register/route.js:', err);
		return NextResponse.json({ message: err.message }, { status: 500 });
	}
}
