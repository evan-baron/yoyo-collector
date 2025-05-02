import axiosInstance from '../utils/axios';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// This now accepts `headers` and `cookies` as parameters.
export async function getUserIdFromToken({ headers, cookies }) {
	const cookieStore = await cookies();
	const tokenFromCookie = cookieStore.get('session_token')?.value;
	const token = tokenFromCookie;

	if (!token) {
		throw new Error('Unauthorized: Token missing');
	}

	try {
		const response = await axiosInstance.get(
			`${baseUrl}/api/session?token=${token}`
		);

		const { user_id: userId, valid } = response.data;

		return { userId, valid };
	} catch (err) {
		console.error('Token validation failed:', err);
		throw new Error('Unexpected error fetching userdata from token');
	}
}
