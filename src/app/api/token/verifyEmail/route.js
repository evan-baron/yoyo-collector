import userService from '@/services/userService';
const { getUserByEmail, generateToken } = userService;
import mailService from '@/services/mailService';
const { sendVerificationEmail } = mailService;
import { NextResponse } from 'next/server';

export async function POST(req) {
	try {
		const { email, tokenName } = await req.json();

		const user = await getUserByEmail(email);

		if (!user) {
			return NextResponse.json({ message: 'User not found' }, { status: 400 });
		}

		const { id } = user;

		const verificationToken = await generateToken(id, tokenName);

		try {
			await sendVerificationEmail(user, verificationToken);
		} catch (err) {
			console.log(
				'Error sending verification email at api/token/verifyEmail/route.js:',
				err
			);
			return NextResponse.json(
				{ message: 'Error sending verification email' },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			message: 'User found, verification email sent!',
		});
	} catch (err) {
		console.log('Error finding user in api/token/verifyEmail/route.js:', err);
		return NextResponse.json({ message: 'User not found' }, { status: 400 });
	}
}
