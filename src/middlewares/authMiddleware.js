import jwt from 'jsonwebtoken';

export const authenticateUser = (req) => {
	const token = req.cookies.session_token;

	if (!token) {
		return { status: 401, message: 'Unauthorized: No token provided' };
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		return null; // No error, authentication passed
	} catch (error) {
		return { status: 401, message: 'Unauthorized: Invalid token' };
	}
};
