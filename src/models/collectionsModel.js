import pool from '@/config/db';

const Uploads = {
	// Create new collection
	async createCollection(userId, name) {
		const [result] = await pool.execute(
			'INSERT INTO user_collections (user_id, collection_name) VALUES (?, ?)',
			[userId, name]
		);
		return result;
	},

	// Get all collections by userId
	async getAllCollectionsById(userId) {
		const [rows] = await pool.execute(
			`SELECT user_collections.*, users.privacy FROM user_collections 
			LEFT JOIN users
				ON users.id = user_collections.user_id
			WHERE user_collections.user_id = ?`,
			[userId]
		);
		return rows[0];
	},

	// Get collection by collectionId
	async getCollectionById(collectionId) {
		const [rows] = await pool.execute(
			`SELECT user_collections.*, users.handle, users.first_name, users.privacy FROM user_collections 
			LEFT JOIN users 
				ON users.id = user_collections.user_id  
			WHERE user_collections.id = ?`,
			[collectionId]
		);
		return rows[0];
	},

	// Get collection by name
	async getCollectionByName(userId, name) {
		const [rows] = await pool.execute(
			`SELECT * FROM user_collections WHERE id = ? AND collection_name = ?`,
			[userId, name]
		);
		return rows[0];
	},

	// Get collection ID
	async getCollectionId(userId, name) {
		const [rows] = await pool.execute(
			`SELECT id FROM user_collections WHERE user_id = ? AND collection_name = ?`,
			[userId, name]
		);
		return rows[0];
	},

	// Update collection
	async updateCollection(name, collectionId, description) {
		const [result] = await pool.execute(
			`UPDATE user_collections 
				SET collection_name = ?, 
				collection_description = ?,
				updated_at = NOW()
				WHERE id = ?`,
			[name, description, collectionId]
		);
		return result;
	},

	// Delete photo by Id
	async deleteCollection(userId, collectionId) {
		const [result] = await pool.execute(
			`DELETE FROM user_collections
			WHERE user_id = ? AND id = ?`,
			[userId, collectionId]
		);
		return result;
	},
};

export default Uploads;
