import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import dayjs from 'dayjs';
import sessionService from '@/services/sessionService'; // update to your actual path

export async function validateAndExtendSession(sourceLabel = 'unknown') {
	const cookieStore = await cookies();
	const token = cookieStore.get('session_token')?.value;

	if (!token) {
		redirect('/');
	}

	const session = await sessionService.getSessionByToken(token);

	if (!session) {
		console.error(`No session found @ ${sourceLabel}`);
		redirect('/');
	}

	const { user_id, expires_at, remember_me } = session;

	const tokenValid = dayjs(expires_at).isAfter(dayjs());

	if (!tokenValid) {
		console.error(`Token expired or invalid @ ${sourceLabel}`);
		redirect('/');
	}

	await sessionService.extendSession(user_id, token, remember_me);

	return session;
}
