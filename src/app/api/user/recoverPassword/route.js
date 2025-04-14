import userService from '@/services/userService';
const { getUserByEmail, generateToken } = userService;
import mailService from '@/services/mailService';
const { sendPasswordResetEmail } = mailService;
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/utils/rateLimiter';

export async function POST(req) {
	try {
		const { email, tokenName } = await req.json();
		const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		await checkRateLimit(ip);

		const user = await getUserByEmail(email);

		if (!user) {
			return NextResponse.json({ message: 'User not found' }, { status: 400 });
		}

		const { id } = user;

		const recoveryToken = await generateToken(id, tokenName);

		try {
			await sendPasswordResetEmail(user, recoveryToken);
		} catch (err) {
			console.log(
				'There was an error sending password reset email at api/user/recoverPassword/route.js:',
				err
			);
			return NextResponse.json(
				{ message: 'Error sending password reset email' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: 'User found, recovery email sent!' },
			{ status: 201 }
		);
	} catch (err) {
		console.log(
			'An error occured in recover-password at api/user/recoverPassword/route.js:',
			err
		);
		return NextResponse.json({ message: err.message }, { status: 400 });
	}
}
