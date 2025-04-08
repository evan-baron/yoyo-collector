import { updateVerified } from '@/services/userService';
import { NextResponse } from 'next/server';

export async function POST(req) {
	try {
		const { user_id, token } = await req.json();

		await updateVerified(user_id, token);

		return NextResponse.json({
			message: 'Verification status updated successfully',
		});
	} catch (err) {
		console.log(
			'Error in updateVerified at api/token/updateVerified/route.js:',
			err
		);
		return NextResponse.json({ message: 'Server error' }, { status: 500 });
	}
}
