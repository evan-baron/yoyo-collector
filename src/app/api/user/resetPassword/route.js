import { updatePassword } from '@/services/userService';
import { NextResponse } from 'next/server';

export async function POST(req) {
	try {
		const { password, token } = await req.json();

		if (!token) {
			return NextResponse.json(
				{ message: 'Reset token is required.' },
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
