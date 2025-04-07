import jwt from 'jsonwebtoken';
import userService from '@/services/userService';
import 'dotenv/config';

const login = async (email, password, checked) => {
	const user = await userService.authenticateUser(email, password);

	if (user.success) {
		const token = jwt.sign(
			{ userId: user.user.id, email: user.user.email },
			process.env.JWT_SECRET,
			checked ? {} : { expiresIn: '1h' } // If checked is true, no expiration time (so users never have to worry about logging in again unless they log out)
		);
		return { user: user.user, token };
	} else {
		console.log('Authentication failed at authService.login:', user.message);
		throw new Error(user.message);
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
