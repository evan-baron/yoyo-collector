import userService from '@/services/userService';
import { headers } from 'next/headers';

export const logUserAction = async (req, body) => {
	try {
		const ip_address = headers().get('x-forwarded-for') || 'unknown';
		const method = req.method || 'UNKNOWN';
		const url = req.url || 'UNKNOWN';
		const user = body?.id || null;
		const action = `${method} ${url}`;

		await userService.logUserAction(user, action, ip_address);
	} catch (error) {
		console.error('Error logging user action:', error);
	}
};
