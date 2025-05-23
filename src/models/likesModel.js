import pool from '@/config/db';

const Likes = {
	// Get all favorites by userId
	async getAllLikesByUserId(userId) {
		const [rows] = await pool.execute(
			`SELECT favorited_type, favorited_id FROM likes_and_favorites
			WHERE user_id = ?`,
			[userId]
		);
		return rows;
	},

	// Get all likes by userId
	async getAllLikesByUserId(userId) {
		const [rows] = await pool.execute(
			`SELECT liked_type, liked_id FROM likes_and_favorites
			WHERE user_id = ?`,
			[userId]
		);
		return rows;
	},

	// Like an item
	async likeAnItem(userId, liked_item, liked_id) {
		const [result] = await pool.execute(
			'INSERT INTO likes_and_favorites (user_id, liked_type, liked_id) VALUES (?, ?, ?)',
			[userId, liked_item, liked_id]
		);
		return result;
	},

	// Unlike an item
	async unlikeAnItem(userId, liked_item, liked_id) {
		const [result] = await pool.execute(
			'DELETE FROM likes_and_favorites WHERE user_id = ? AND liked_type = ? AND liked_id = ?',
			[userId, liked_item, liked_id]
		);
		return result;
	},
};

export default Likes;
