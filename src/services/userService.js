import bcrypt from 'bcrypt';
import crypto from 'crypto';
import userModel from '@/models/userModel';
import tokenModel from '@/models/tokenModel';

// ALL FUNCTIONS LISTED BELOW ALPHABETICALLY

// Authenticate a user
const authenticateUser = async (email, password) => {
	const hashedPassword = await userModel.getPasswordByEmail(email);
	if (!hashedPassword) {
		return { success: false, message: 'Incorrect email or password.' };
	}

	// Compare input password with stored hash
	const isMatch = await bcrypt.compare(password, hashedPassword);
	if (!isMatch) {
		return { success: false, message: 'Incorrect email or password.' };
	}

	const user = await userModel.findUserByEmail(email);

	return { success: true, user };
};

// Check if a user exists by email
const checkIfUserExists = async (email) => {
	return await userModel.checkIfUserExists(email);
};

// Create a new user
const createUser = async (first, last, email, password) => {
	try {
		const hashedPassword = await bcrypt.hash(password, 10);

		const result = await userModel.createUser(
			first,
			last,
			email,
			hashedPassword
		);

		const storeResult = await userModel.storePassword(
			result.insertId,
			hashedPassword
		);

		if (!storeResult) {
			throw new Error('Failed to store the password');
		}

		const newUser = await userModel.findUserById(result.insertId);

		return {
			id: newUser.id,
			first_name: newUser.first_name,
			last_name: newUser.last_name,
			email: newUser.email,
			created_at: newUser.created_at,
		};
	} catch (error) {
		console.error('Error creating user:', error.message);
		throw error;
	}
};

// Delete a user by ID
const deleteUser = async (id) => {
	return await userModel.deleteUserById(id);
};

// Generate recovery token
const generateToken = async (id, tokenName, length = 32) => {
	const recoveryToken = crypto
		.randomBytes(length)
		.toString('hex')
		.slice(0, length);

	try {
		await tokenModel.createRecoveryToken(id, tokenName, recoveryToken);
		return recoveryToken;
	} catch (err) {
		console.log('There was an error: ', err.message);
	}
};

// Get recovery token Data
const getTokenData = async (token) => {
	try {
		const recoveryTokenData = await tokenModel.getTokenData(token);
		return recoveryTokenData;
	} catch (err) {
		console.log('There was an error at getTokenData: ', err.message);
	}
};

// Get a user by email
const getUserByEmail = async (email) => {
	return await userModel.findUserByEmail(email);
};

// Get user by ID
const getUserById = async (id) => {
	return await userModel.findUserById(id);
};

// Log user action
const logUserAction = async (user, action, ip_address) => {
	return await userModel.logAction(user, action, ip_address);
};

// Update password
const updatePassword = async (password, token) => {
	console.log('you are in userservice.updatepassword now');
	try {
		// Step 1: Get the user id by searching the token
		const response = await tokenModel.getTokenData(token);
		const { user_id } = response;

		// Step 2: Find existing password hash for the user
		const existingPasswords = await userModel.getPasswordById(user_id);

		// Step 3: Check if the new password is the same as the old one
		let isMatch = false;

		for (let passwordObj of existingPasswords) {
			const matches = await bcrypt.compare(password, passwordObj.password);
			if (matches) {
				isMatch = true;
				break;
			}
		}

		if (isMatch) {
			console.log("You can't use a previously used password.");
			return {
				success: false,
				message:
					'For security purposes, you cannot use a previously used password.',
			};
		} else {
			console.log(
				`The new password doesn't match a previously used password. Proceed`
			);

			// Step 4: Hash the new password
			const newPassword = await bcrypt.hash(password, 10);

			// Step 5: Update the password and token
			await userModel.updateUserPassword(newPassword, token); // Pass user_id instead of token if needed
			await userModel.storePassword(user_id, newPassword);
			await tokenModel.updateTokenUsed(token); // Mark token as used

			return { success: true, message: 'Password updated successfully.' };
		}
	} catch (err) {
		console.error('Error during password update: ', err.message);
		return { success: false, message: 'Error updating password.' };
	}
};

// Update userSettings
const updateUserSettings = async (
	brand,
	city,
	country,
	description,
	first,
	handle,
	last,
	privacy,
	state,
	yoyo,
	id
) => {
	try {
		await userModel.updateUserSettings(
			brand,
			city,
			country,
			description,
			first,
			handle,
			last,
			privacy,
			state,
			yoyo,
			id
		);
		const updatedUser = await getUserById(id);
		return updatedUser;
	} catch (err) {
		console.log(
			'There was an error at updateUserSettings in userService.js: ',
			err.message
		);
	}
};

// Update verified
const updateVerified = async (user_id, token) => {
	try {
		await userModel.updateVerified(user_id);
		await tokenModel.updateTokenUsed(token);
	} catch (err) {
		console.log('There was an error at updateVerified. ', err.message);
	}
};

export default {
	authenticateUser,
	checkIfUserExists,
	createUser,
	deleteUser,
	generateToken,
	getTokenData,
	getUserByEmail,
	getUserById,
	logUserAction,
	updatePassword,
	updateUserSettings,
	updateVerified,
};
