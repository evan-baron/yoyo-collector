import userService from '@/services/userService';
import { cookies, headers } from 'next/headers';
const { updateRememberMe } = userService;
import { NextResponse } from 'next/server';
import { getUserIdFromToken } from '@/lib/auth/getUserIdFromToken';

export async function PATCH(req, res) {
	try {
		const userId = await getUserIdFromToken({
			headers,
			cookies,
		});

		if (!userId) return;

		await updateRememberMe(userId);

		return NextResponse.json(
			{
				message: 'User remember settings updated successfully',
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log(
			'There was an error updating the user at api/user/updateSettings PATCH: ',
			error.message
		);
		return NextResponse.json({ message: error.message }, { status: 500 });
	}
}
