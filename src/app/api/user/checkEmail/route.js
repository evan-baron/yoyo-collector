import userService from '@/services/userService';
const { getUserByEmail } = userService;
import { NextResponse } from 'next/server';

export async function POST(req) {
	try {
		const { email } = await req.json();

		const user = await getUserByEmail(email);

		if (!user) {
			return NextResponse.json({ available: true }, { status: 200 });
		}

		return NextResponse.json({
			available: false,
			message: 'Email already in use',
		});
	} catch (err) {
		console.log('There was an error at api/user/checkEmail/route.js:', err);
		return NextResponse.json(
			{ message: 'Error checking email' },
			{ status: 500 }
		);
	}
}
