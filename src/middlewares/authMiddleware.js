import jwt from 'jsonwebtoken';

const authenticateUser = (req, res, next) => {
	const token = req.cookies.session_token;

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized: No token provided' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; // Attach user info to request
		next();
	} catch (error) {
		res.status(401).json({ message: 'Unauthorized: Invalid token' });
	}
};

export default { authenticateUser };
