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

	// Get ALL non-private users
	async getAllUsers() {
		const [rows] = await pool.execute(
			`SELECT id FROM users WHERE privacy != 'private'`
		);
		return rows;
	},

	// Get a user by email
	async findUserByEmail(email) {
		const [rows] = await pool.execute(
			`WITH user_id_cte AS (
				SELECT id FROM users WHERE email = ?
			) 
			SELECT users.*, user_uploads.secure_url FROM users 
			LEFT JOIN user_uploads 
				ON users.id = user_uploads.user_id 
				AND user_uploads.upload_category = 'profile' 
			WHERE users.id = (SELECT id FROM user_id_cte)`,
			[email]
		);
		return rows[0]; // Return the first matching user (or null if none)
	},

	async findUserById(id) {
		const [rows] = await pool.execute(
			`WITH profile_pictures (user_id, secure_url) AS (
			SELECT user_uploads.user_id, user_uploads.secure_url
			FROM user_uploads
			WHERE user_uploads.upload_category = 'profile'
		), cover_photos (collection_id, secure_url) AS (
			SELECT user_uploads.collection_id, user_uploads.secure_url
			FROM user_uploads
			WHERE user_uploads.upload_category = 'cover'
		)
		SELECT 
			users.*, 
			profile_pictures.secure_url, 
			laf.liked_type, laf.liked_id, laf.favorited_type, laf.favorited_id,
			uc.id AS collection_id, uc.collection_name, uc.created_at AS uc_created_at, uc.likes,
			cover_photos.secure_url AS cover_url
		FROM users
		LEFT JOIN profile_pictures
			ON users.id = profile_pictures.user_id 
		LEFT JOIN likes_and_favorites AS laf
			ON users.id = laf.user_id
		LEFT JOIN user_collections AS uc
			ON laf.favorited_type = 'collections' AND laf.favorited_id = uc.id
		LEFT JOIN cover_photos
			ON laf.favorited_id = cover_photos.collection_id
		WHERE users.id = ?`,
			[id]
		);

		if (rows.length === 0) return null;

		const user = {
			...rows[0],
			likes_and_favorites: {
				likes: {
					collections: {},
					uploads: {},
					yoyos: {},
				},
				favorites: {
					collections: {},
					yoyos: {},
				},
			},
		};

		for (const row of rows) {
			if (row.liked_type) {
				user.likes_and_favorites.likes[row.liked_type][row.liked_id] = true;
			}

			if (row.favorited_type === 'collections') {
				user.likes_and_favorites.favorites[row.favorited_type][
					row.favorited_id
				] = {
					id: row.collection_id,
					collection_name: row.collection_name,
					likes: row.likes,
					created_at: row.uc_created_at,
					secure_url: row.cover_url,
				};
			} else if (row.favorited_type === 'yoyos') {
				user.likes_and_favorites.favorites[row.favorited_type][
					row.favorited_id
				] = true;
			}
		}

		[
			'liked_type',
			'liked_id',
			'favorited_type',
			'favorited_id',
			'collection_id',
			'collection_name',
			'likes',
			'uc_created_at',
			'cover_url',
			'password',
		].forEach((key) => delete user[key]);

		return user;
	},

	// Get a user by Handle
	async findUserByHandle(handle) {
		const [rows] = await pool.execute(
			`SELECT users.*, user_uploads.secure_url FROM users 
			LEFT JOIN user_uploads 
				ON users.id = user_uploads.user_id 
				AND user_uploads.upload_category = 'profile'  WHERE handle = ?`,
			[handle]
		);
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

	// Update warning
	async updateWarning(user_id, warningType) {
		const allowedColumns = [
			'delete_collection_warning',
			'delete_account_warning',
			'delete_yoyo_warning',
		];

		if (!allowedColumns.includes(warningType)) {
			throw new Error('Invalid warning type column');
		}

		const sql = `UPDATE users SET \`${warningType}\` = IF(\`${warningType}\` = 1, 0, 1) WHERE id = ?`;

		const [result] = await pool.execute(sql, [user_id]);

		return result;
	},
};

export default User;
