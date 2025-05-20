import pool from '@/config/db';

const Yoyos = {
	// Get yoyo by yoyoId
	async getYoyoById(yoyoId) {
		const [rows] = await pool.execute(
			`SELECT 
				yoyos.*, 
				user_uploads.secure_url 
			FROM 
				yoyos 
			LEFT JOIN 
				user_uploads ON user_uploads.yoyo_id = yoyos.id 
			WHERE 
				id = ?`,
			[yoyoId]
		);
		return rows[0];
	},

	// Get yoyos by collectionId
	async getYoyosByCollectionId(collectionId) {
		await pool.execute('SET SESSION group_concat_max_len = 100000');

		const [rows] = await pool.execute(
			`SELECT 
				yoyos.*, 
				GROUP_CONCAT(user_uploads.secure_url ORDER BY user_uploads.id) AS images 
			FROM 
				yoyos 
			LEFT JOIN 
				user_uploads ON user_uploads.yoyo_id = yoyos.id 
			WHERE 
				yoyos.collection_id = ? 
			GROUP BY 
				yoyos.id`,
			[collectionId]
		);
		return rows;
	},

	// Get all yoyos by userId
	async getYoyosByUserId(userId) {
		const [rows] = await pool.execute(
			`SELECT 
				yoyos.*, 
				GROUP_CONCAT(user_uploads.secure_url ORDER BY user_uploads.id) AS images 
			FROM 
				yoyos 
			LEFT JOIN 
				user_uploads ON user_uploads.yoyo_id = yoyos.id 
			WHERE 
				yoyos.user_id = ? 
			GROUP BY 
				yoyos.id`,
			[userId]
		);
		return rows;
	},

	// Insert yoyo to db
	async createYoyo(
		userId,
		collectionId,
		bearing,
		brand,
		category,
		color,
		condition,
		model,
		originalOwner,
		price,
		purchased,
		responseType,
		value,
		year
	) {
		const [result] = await pool.execute(
			`INSERT INTO 
				yoyos (user_id, collection_id, brand, model, colorway, bearing, release_year, original_owner, purchase_year, purchase_price, category, response_type, yoyo_condition, yoyo_value)
			VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				userId,
				collectionId,
				brand,
				model,
				color,
				bearing,
				year,
				originalOwner,
				purchased,
				price,
				category,
				responseType,
				condition,
				value,
			]
		);
		return result.insertId;
	},

	// Update yoyo in the db - conditionally
	async updateYoyo(yoyoId, updates) {
		let query = `UPDATE yoyos SET `;
		const params = [];

		// Dynamically build the query based on the provided updates
		for (const [key, value] of Object.entries(updates)) {
			query += `${key} = ?, `;
			params.push(value);
		}

		// Remove the last comma and add the WHERE clause
		query = query.slice(0, -2);
		query += ` WHERE id = ?`;

		// Add the yoyoId as the last parameter
		params.push(yoyoId);

		const [result] = await pool.execute(query, params);
		return result;
	},

	// Delete yoyo from the db
	async deleteYoyo(yoyoId, userId) {
		const [result] = await pool.execute(
			`DELETE FROM yoyos WHERE id = ? AND user_id = ?`,
			[yoyoId, userId]
		);
		return result;
	},
};

export default Yoyos;
