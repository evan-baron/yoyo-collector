import pool from '@/config/db';

const Collections = {
	// Create new collection
	async createCollection(userId, name) {
		const [result] = await pool.execute(
			'INSERT INTO user_collections (user_id, collection_name) VALUES (?, ?)',
			[userId, name]
		);
		return result;
	},

	// Get all collections by sortType
	async getAllCollectionsBySortType(sortType) {
		const validSorts = {
			ascending: 'user_collections.created_at ASC',
			descending: 'user_collections.created_at DESC',
			likes: 'user_collections.likes DESC',
		};

		let orderClause = 'ORDER BY user_collections.created_at ASC';
		if (sortType && validSorts[sortType]) {
			orderClause = `ORDER BY ${validSorts[sortType]}`;
		}

		const [rows] = await pool.execute(
			`SELECT user_collections.*, user_uploads.secure_url, users.privacy
			FROM user_collections
			LEFT JOIN user_uploads
				ON user_collections.id = user_uploads.collection_id
				AND user_uploads.upload_category = 'cover'
			LEFT JOIN users
				ON user_collections.user_id = users.id
			WHERE user_collections.user_id NOT IN (
				SELECT id 
				FROM users
				WHERE privacy = 'private'
			) 
		 	${orderClause}`
		);
		return rows;
	},

	// Get all collections by userId
	async getAllCollectionsById(userId) {
		const [rows] = await pool.execute(
			`SELECT user_collections.*, user_uploads.secure_url 
			 FROM user_collections 
			 LEFT JOIN user_uploads
				ON user_collections.id = user_uploads.collection_id
				AND user_uploads.upload_category = 'cover'
			 WHERE user_collections.user_id = ?`,
			[userId]
		);
		return rows;
	},

	// Get top five collections
	async getTopFiveCollections() {
		const [rows] = await pool.execute(
			`SELECT user_collections.*, user_uploads.secure_url, users.privacy
			FROM user_collections
			LEFT JOIN user_uploads
				ON user_collections.id = user_uploads.collection_id
				AND user_uploads.upload_category = 'cover'
			LEFT JOIN users
				ON user_collections.user_id = users.id
			WHERE user_collections.user_id NOT IN (
				SELECT id 
				FROM users
				WHERE privacy = 'private'
			) 
			ORDER BY user_collections.likes DESC
			LIMIT 5`
		);
		return rows;
	},

	// Get favorite collections by array of collection Ids
	async getFavoriteCollectionsById(collectionIds) {
		const placeholders = collectionIds.map(() => '?').join(', ');
		let query = `SELECT user_collections.*, users.handle, users.first_name, users.privacy, user_uploads.secure_url 
		FROM user_collections 
		LEFT JOIN users 
			ON users.id = user_collections.user_id  
		LEFT JOIN user_uploads
			ON user_collections.id = user_uploads.collection_id
			AND user_uploads.upload_category = 'cover' 
		WHERE user_collections.id IN (${placeholders})`;

		if (collectionIds.length === 0) return [];

		const [rows] = await pool.execute(query, collectionIds);

		return rows;
	},

	// Get five newest collections
	async getFiveNewestCollections() {
		const [rows] = await pool.execute(
			`SELECT user_collections.*, user_uploads.secure_url, users.privacy
			FROM user_collections
			LEFT JOIN user_uploads
				ON user_collections.id = user_uploads.collection_id
				AND user_uploads.upload_category = 'cover'
			LEFT JOIN users
				ON user_collections.user_id = users.id
			WHERE user_collections.user_id NOT IN (
				SELECT id 
				FROM users
				WHERE privacy = 'private'
			) 
			ORDER BY user_collections.created_at DESC
			LIMIT 5`
		);
		return rows;
	},

	// Get collection by collectionId
	async getCollectionById(collectionId) {
		const [rows] = await pool.execute(
			`SELECT user_collections.*, users.handle, users.first_name, users.privacy, user_uploads.secure_url 
			FROM user_collections 
			LEFT JOIN users 
				ON users.id = user_collections.user_id  
			LEFT JOIN user_uploads
				ON user_collections.id = user_uploads.collection_id
				AND user_uploads.upload_category = 'cover'
			WHERE user_collections.id = ?`,
			[collectionId]
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

	// Increment likes
	async incrementCollectionLikes(liked_id) {
		const [result] = await pool.execute(
			`UPDATE user_collections
			SET likes = likes + 1
			WHERE id = ?`,
			[liked_id]
		);
		return result;
	},

	// Decrement likes
	async decrementCollectionLikes(liked_id) {
		const [result] = await pool.execute(
			`UPDATE user_collections
			SET likes = likes - 1
			WHERE id = ?`,
			[liked_id]
		);
		return result;
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

export default Collections;
