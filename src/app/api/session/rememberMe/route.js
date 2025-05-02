import sessionService from '@/services/sessionService';
import { cookies } from 'next/headers';
const { updateRememberMe, getSessionByUserId } = sessionService;
import { NextResponse } from 'next/server';
import { getUserIdFromToken } from '@/lib/auth/getUserIdFromToken';

export async function PATCH(req, res) {
	try {
		const { userId } = await getUserIdFromToken({
			cookies,
		});

		if (!userId) return;

		const { session_token: token } = await getSessionByUserId(userId);

		await updateRememberMe(userId, token);

		return NextResponse.json(
			{
				message: 'User remember_me settings updated successfully',
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log(
			'There was an error updating the user at api/session/rememberMe PATCH: ',
			error.message
		);
		return NextResponse.json({ message: error.message }, { status: 500 });
	}
}
