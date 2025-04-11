import userService from '@/services/userService';
const { getTokenData } = userService;
import { NextResponse } from 'next/server';

export async function GET(req) {
	try {
		const { searchParams } = new URL(req.url);
		const token = searchParams.get('token');

		if (!token) {
			return NextResponse.json(
				{ message: 'Recovery token is required.' },
				{ status: 400 }
			);
		}

		const tokenData = await getTokenData(token);

		return NextResponse.json({
			userId: tokenData.user_id,
			tokenType: tokenData.token_name,
			emailVerified: tokenData.token_used,
		});
	} catch (err) {
		console.error(
			'Error in authenticateVerifyToken route at api/token/authenticateVerifyToken/route.js:',
			err.message
		);
		return NextResponse.json({ message: 'Server error' }, { status: 500 });
	}
}
