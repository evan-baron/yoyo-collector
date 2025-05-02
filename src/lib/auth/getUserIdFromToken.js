import axiosInstance from '../utils/axios';

// This now accepts `headers` and `cookies` as parameters.
export async function getUserIdFromToken({ headers, cookies }) {
	const cookieStore = await cookies();
	const tokenFromCookie = cookieStore.get('session_token')?.value;

	const headerStore = await headers();
	const authHeader = headerStore.get('Authorization');
	const tokenFromHeader = authHeader?.startsWith('Bearer ')
		? authHeader.split(' ')[1]
		: null;

	const token = tokenFromCookie || tokenFromHeader;

	if (!token) {
		throw new Error('Unauthorized: Token missing');
	}

	try {
		const response = await axiosInstance.get('/api/session', { token });

		const { user_id: userId, valid } = response.data;

		return { userId, valid };
	} catch (err) {
		console.error('Token validation failed:', err);
		throw new Error('Unexpected error fetching userdata from token');
	}
}
