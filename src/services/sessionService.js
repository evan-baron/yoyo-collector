import sessionModel from '@/models/sessionModel';

// Create new session
const createSession = async (userId, token, rememberMe) => {
	const date = new Date();
	const diff = date.getTimezoneOffset();

	console.log('offset: ', diff);

	const hoursDiff = diff / 60;

	const diffInMs = hoursDiff * 60 * 60 * 1000;

	console.log(diffInMs);

	let expiration;

	if (rememberMe === 1) {
		expiration = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 - diffInMs)
			.toISOString()
			.slice(0, 19)
			.replace('T', ' ');
	} else {
		expiration = new Date(Date.now() + 30 * 60 * 1000 - diffInMs)
			.toISOString()
			.slice(0, 19)
			.replace('T', ' ');
	}

	return await sessionModel.createSession(
		userId,
		token,
		expiration,
		rememberMe
	);
};

// Delete session
const deleteSessionToken = async (userId, token) => {
	return await sessionModel.deleteSessionToken(userId, token);
};

// Extend session
const extendSession = async (userId, token, expiration) => {
	return await sessionModel.extendSession(userId, token, expiration);
};

// Get session by token
const getSessionByToken = async (token) => {
	return await sessionModel.getSessionByToken(token);
};

// Get session by userId
const getSessionByUserId = async (userId) => {
	return await sessionModel.getSessionByUserId(userId);
};

// Get session by userId
const getSessionByUserIdAndToken = async (userId, token) => {
	return await sessionModel.getSessionByUserIdAndToken(userId, token);
};

// Update rememberMe
const updateRememberMe = async (user_id, token) => {
	return await sessionModel.updateRememberMe(user_id, token);
};

// Update session
const updateSession = async (userId, token, expiration) => {
	return await sessionModel.updateSession(userId, token, expiration);
};

// Get valid session
const validateSession = async (userId, token) => {
	return await sessionModel.getValidSession(userId, token);
};

export default {
	createSession,
	deleteSessionToken,
	extendSession,
	getSessionByToken,
	getSessionByUserId,
	getSessionByUserIdAndToken,
	updateRememberMe,
	updateSession,
	validateSession,
};
