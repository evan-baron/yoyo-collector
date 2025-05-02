import sessionService from '@/services/sessionService';
import { cookies, headers } from 'next/headers';
const {
	deleteSessionToken,
	getSessionByToken,
	getSessionByUserIdAndToken,
	extendSession,
} = sessionService;
import { NextResponse } from 'next/server';
import { getUserIdFromToken } from '@/lib/auth/getUserIdFromToken';
import dayjs from 'dayjs';

export async function GET(req, res) {
	try {
		const { searchParams } = new URL(req.url);
		const token = searchParams.get('token');

		const response = await getSessionByToken(token);

		const { expires_at } = response;

		const tokenValid = dayjs(expires_at).isAfter(dayjs());

		response.valid = tokenValid;

		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		console.error(
			'There was an error getting the session at api/session/ GET:',
			error.message
		);
		return NextResponse.json({ message: error.message }, { status: 500 });
	}
}

export async function DELETE(req, res) {
	try {
		const { userId } = await getUserIdFromToken({
			headers,
			cookies,
		});

		if (!userId) return;

		await deleteSessionToken(userId, token);

		const response = NextResponse.json(
			{ message: 'Session_token deleted successfully' },
			{ status: 200 }
		);

		return response;
	} catch (error) {
		console.error(
			'There was an error deleting the session at api/session/ DELETE',
			error.message
		);
		return NextResponse.json({ message: error.message }, { status: 500 });
	}
}

export async function PATCH(req, res) {
	try {
		const { userId } = await getUserIdFromToken({
			headers,
			cookies,
		});

		if (!userId) return;

		const session = await getSessionByUserIdAndToken(userId, token);

		const { remember_me } = session.data;

		const expiration = (() => {
			if (remember_me) {
				const newExpiration = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
					.toISOString()
					.slice(0, 19)
					.replace('T', ' ');
				return newExpiration;
			} else {
				const newExpiration = new Date(Date.now() + 30 * 60 * 1000)
					.toISOString()
					.slice(0, 19)
					.replace('T', ' ');
				return newExpiration;
			}
		})();

		await extendSession(userId, token, expiration);

		const response = NextResponse.json(
			{ message: 'Session extended successfully' },
			{ status: 200 }
		);

		return response;
	} catch (error) {
		console.error(
			'There was an error extending the session at api/session/ PATCH',
			error.message
		);
		return NextResponse.json({ message: error.message }, { status: 500 });
	}
}
