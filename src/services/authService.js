import jwt from 'jsonwebtoken';
import userService from '@/services/userService';
import sessionService from './sessionService';
import 'dotenv/config';
import { generateSecureToken } from '@/lib/utils/generateToken';

const login = async (email, password, checked) => {
	const { user, success, message } = await userService.authenticateUser(
		email,
		password
	);

	if (success) {
		const { token: originalToken } = await sessionService.getSessionByUserId(
			user.id
		);

		if (!originalToken) {
			const token = generateSecureToken();

			await sessionService.createSession(user.id, token, checked);

			return { user, token };
		}

		let expiration;
		if (checked) {
			expiration = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
				.toISOString()
				.slice(0, 19)
				.replace('T', ' ');
		} else {
			expiration = new Date(Date.now() + 30 * 60 * 1000)
				.toISOString()
				.slice(0, 19)
				.replace('T', ' ');
		}

		await sessionService.updateSession(user.id, originalToken, expiration);

		return { user, token: originalToken };
	} else {
		console.log('Authentication failed at authService.login:', message);
		throw new Error(message);
	}
};

const register = async (first, last, email, password) => {
	// Find the user by email
	const user = await userService.getUserByEmail(email);
	if (user) {
		throw new Error('An account with this email already exists.');
	} else {
		try {
			const newUser = await userService.createUser(
				first,
				last,
				email,
				password
			);
			return { user: newUser };
		} catch (err) {
			console.log('Error registering user at authService.register:', err);
			throw new Error('Error registering user: ' + err.message);
		}
	}
};

export default { register, login };
