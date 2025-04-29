import pool from '@/config/db';

const Uploads = {
	// Upload profile photo to db
	async uploadPhoto(
		userId,
		publicId,
		secureUrl,
		format,
		resourceType,
		bytes,
		height,
		width,
		category,
		collectionId
	) {
		const [result] = await pool.execute(
			'INSERT INTO user_uploads (user_id, public_id, secure_url, format, resource_type, bytes, height, width, upload_category, collection_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				userId,
				publicId,
				secureUrl,
				format,
				resourceType,
				bytes,
				height,
				width,
				category,
				collectionId,
			]
		);
		return result;
	},

	// Get photo by photoId
	async getPhotoByPhotoId(photoId) {
		const [rows] = await pool.execute(
			`SELECT * FROM user_uploads WHERE id = ?`,
			[photoId]
		);
		return rows[0];
	},

	// Get all collection photos by collectionId
	async getAllCollectionPhotos(collectionId) {
		const [rows] = await pool.execute(
			`SELECT * FROM user_uploads WHERE collection_id = ?`,
			[collectionId]
		);
		return rows;
	},

	// Get photo by userId and category
	async getPhotosByIdAndCategory(userId, category) {
		const [rows] = await pool.execute(
			`SELECT * FROM user_uploads WHERE user_id = ? AND upload_category = ?`,
			[userId, category]
		);
		return rows;
	},

	// Update profile photo in db
	async updateProfilePicture(
		userId,
		publicId,
		secureUrl,
		format,
		resourceType,
		bytes,
		height,
		width
	) {
		const [result] = await pool.execute(
			`UPDATE user_uploads 
				SET public_id = ?, 
				secure_url = ?, 
				format = ?, 
				resource_type = ?, 
				bytes = ?, 
				height = ?, 
				width = ?, 
				updated_at = NOW()
				WHERE user_id = ? AND upload_category = 'profile'`,
			[publicId, secureUrl, format, resourceType, bytes, height, width, userId]
		);
		return result;
	},

	// Delete photo by Id
	async deletePhotoById(userId, photoId) {
		const [result] = await pool.execute(
			`DELETE FROM user_uploads
			WHERE user_id = ? AND id = ?`,
			[userId, photoId]
		);
		return result;
	},

	// Delete profile picture
	async deleteProfilePicture(userId) {
		const [result] = await pool.execute(
			`DELETE FROM user_uploads 
			WHERE user_id = ? AND upload_category = 'profile'`,
			[userId]
		);
		return result;
	},
};

export default Uploads;
