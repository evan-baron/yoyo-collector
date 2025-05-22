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
};

export default Likes;
