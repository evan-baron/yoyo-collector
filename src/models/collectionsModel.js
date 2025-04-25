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
	async updateCollection(name, collectionId) {
		const [result] = await pool.execute(
			`UPDATE user_collections 
				SET collection_name = ?, 
				updated_at = NOW()
				WHERE id = ?`,
			[name, collectionId]
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
