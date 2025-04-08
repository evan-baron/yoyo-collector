import { register } from '@/services/authService';
import { NextResponse } from 'next/server';

export async function POST(req) {
	try {
		const { first, last, email, password } = await req.json();

		const { user } = await register(first, last, email, password);

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
