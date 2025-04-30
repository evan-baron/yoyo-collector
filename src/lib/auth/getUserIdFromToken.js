import jwt from 'jsonwebtoken';

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
		const { userId } = jwt.verify(token, process.env.JWT_SECRET);
		return userId;
	} catch (err) {
		console.error('JWT verification failed:', err);
		throw new Error('Invalid or expired token');
	}
}
