import userService from '@/services/userService';
const { getTokenData, getUserById } = userService;
import { NextResponse } from 'next/server';
import dayjs from 'dayjs';

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
		const { email } = await getUserById(tokenData.user_id);

		const tokenCreatedAt = tokenData.created_at;
		const expiresAt = dayjs(tokenCreatedAt).add(30, 'minute').toDate();
		const difference = Math.floor(dayjs(expiresAt).diff(dayjs(), 'second'));

		const isValid =
			difference > 0 && difference < 1800 && tokenData.token_used !== 1;
		const timeRemaining = isValid ? difference : 0;

		return NextResponse.json({
			email,
			tokenValid: isValid,
			timeRemaining,
		});
	} catch (err) {
		console.error(
			'Error in authenticateRecoveryToken route at api/token/authenticateRecoveryToken/route.js:',
			err.message
		);
		return NextResponse.json({ message: 'Server error' }, { status: 500 });
	}
}
