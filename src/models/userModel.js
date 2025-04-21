import pool from '@/config/db';

const User = {
	// Create a new user
	async createUser(first, last, email, passwordHash) {
		const [result] = await pool.execute(
			'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
			[first, last, email, passwordHash]
		);
		return result;
	},

	// Log user action
	async logAction(user, action, ip_address) {
		const [result] = await pool.execute(
			'INSERT INTO user_logs (user_id, action, ip_address) VALUES (?, ?, ?)',
			[user, action, ip_address]
		);
		return result;
	},

	// Get a user by email
	async findUserByEmail(email) {
		const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [
			email,
		]);
		return rows[0]; // Return the first matching user (or null if none)
	},

	// Get a user by ID
	async findUserById(id) {
		const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
		return rows[0];
	},

	// Get a user by Handle
	async findUserByHandle(handle) {
		const [rows] = await pool.execute('SELECT * FROM users WHERE handle = ?', [
			handle,
		]);
		return rows[0];
	},

	// Get password by email
	async getPasswordByEmail(email) {
		const [rows] = await pool.execute(
			'SELECT password FROM users WHERE email = ?',
			[email]
		);
		return rows[0]?.password || null;
	},

	// Get password by id
	async getPasswordById(id) {
		const response = await pool.execute(
			'SELECT password FROM used_passwords WHERE user_id = ?',
			[id]
		);
		return response[0];
	},

	// Check if a user exists by email
	async checkIfUserExists(email) {
		const [rows] = await pool.execute('SELECT id FROM users WHERE email = ?', [
			email,
		]);
		return rows.length > 0; // Return true if email exists, otherwise false
	},

	// Store password in used passwords
	async storePassword(id, password) {
		const [result] = await pool.execute(
			'INSERT INTO used_passwords (user_id, password) VALUES (?, ?)',
			[id, password]
		);

		await pool.execute(
			`DELETE old FROM used_passwords old
			 LEFT JOIN (
				SELECT password_id FROM used_passwords
				WHERE user_id = ?
				ORDER BY created_at DESC
				LIMIT 5
			) AS latest_passwords
			ON old.password_id = latest_passwords.password_id
			WHERE old.user_id = ? AND latest_passwords.password_id IS NULL`,
			[id, id]
		);

		return result;
	},

	// Update user password
	async updateUserPassword(hashedPassword, token) {
		const [result] = await pool.execute(
			'UPDATE users SET password = ? WHERE id = (SELECT user_id FROM email_tokens WHERE token = ?)',
			[hashedPassword, token]
		);
		return result.affectedRows > 0;
	},

	// Update user settings
	async updateUserSettings(
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
	) {
		const [result] = await pool.execute(
			'UPDATE users SET favorite_brand = ?, city = ?, country = ?, description = ?, first_name = ?, handle = ?, last_name = ?, privacy = ?, state = ?, favorite_yoyo = ?, updated_at = NOW() WHERE id = ?',
			[
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
				id,
			]
		);
		return result.affectedRows > 0;
	},

	// Update verified
	async updateVerified(user_id) {
		const [result] = await pool.execute(
			'UPDATE users SET email_verified = 1 WHERE id = ?',
			[user_id]
		);
		return result.affectedRows > 0;
	},
};

export default User;
