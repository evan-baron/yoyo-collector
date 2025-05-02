import pool from '@/config/db';

const Session = {
	// Create session
	async createSession(userId, token, expiration, rememberMe) {
		const [result] = await pool.execute(
			`INSERT INTO session_tokens (user_id, session_token, expires_at, remember_me) VALUES (?, ?, ?, ?)`,
			[userId, token, expiration, rememberMe]
		);
		return result;
	},

	// Delete session
	async deleteSessionToken(userId, token) {
		const [result] = await pool.execute(
			`DELETE FROM session_tokens WHERE user_id = ? AND session_token = ?`,
			[userId, token]
		);
		return result;
	},

	// Extend session
	async extendSession(userId, token, expiration) {
		const [result] = await pool.execute(
			`UPDATE session_tokens SET expires_at = ? WHERE session_token = ? AND user_id = ?`,
			[expiration, token, userId]
		);
		return result;
	},

	// Get session by token
	async getSessionByToken(token) {
		const [rows] = await pool.execute(
			`SELECT * FROM session_tokens WHERE session_token = ?`,
			[token]
		);
		return rows[0];
	},

	// Get session by userId
	async getSessionByUserId(userId) {
		const [rows] = await pool.execute(
			`SELECT * FROM session_tokens WHERE user_id = ?`,
			[userId]
		);
		return rows[0];
	},

	// Get session by token
	async getSessionByUserIdAndToken(userId, token) {
		const [rows] = await pool.execute(
			`SELECT * FROM session_tokens WHERE user_id = ? AND session_token = ?`,
			[userId, token]
		);
		return rows[0];
	},

	// Get valid (non-expired) session
	async getValidSession(userId, token) {
		const [rows] = await pool.execute(
			`SELECT * FROM session_tokens 
		 		WHERE session_token = ? 
				AND user_id = ? 
		 		AND (expires_at > NOW())`,
			[token, userId]
		);
		return rows[0];
	},

	// Update remember_me
	async updateRememberMe(userId, token) {
		const [result] = await pool.execute(
			'UPDATE session_tokens SET remember_me = NOT remember_me WHERE user_id = ? AND session_token = ?',
			[userId, token]
		);
		return result.affectedRows > 0;
	},

	// Update session
	async updateSession(userId, token, expiration) {
		const [result] = await pool.execute(
			'UPDATE session_tokens SET expires_at = ? WHERE user_id = ? AND session_token = ?',
			[expiration, userId, token]
		);
		return result.affectedRows > 0;
	},
};

export default Session;
