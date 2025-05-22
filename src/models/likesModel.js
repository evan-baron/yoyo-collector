import pool from '@/config/db';

const Likes = {
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
