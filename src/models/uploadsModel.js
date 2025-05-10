import pool from '@/config/db';

const Uploads = {
	// Delete all uploads by collectionId
	async deleteAllUploadsByCollectionId(userId, collectionId) {
		const [result] = await pool.execute(
			`DELETE FROM user_uploads WHERE user_id = ? AND collection_id = ?`,
			[userId, collectionId]
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

	// Get photo by photoId
	async getPhotoByPhotoId(photoId) {
		const [rows] = await pool.execute(
			`SELECT * FROM user_uploads WHERE id = ?`,
			[photoId]
		);
		return rows[0];
	},

	// Get all collection photos by collectionId
	async getAllCollectionPhotosByUserId(userId, collectionId) {
		const [rows] = await pool.execute(
			`SELECT * FROM user_uploads WHERE user_id = ? AND collection_id = ?`,
			[userId, collectionId]
		);
		return rows;
	},

	// Get all collection photos by collectionId
	async getAllCollectionPhotos(collectionId) {
		const [rows] = await pool.execute(
			`SELECT * FROM user_uploads WHERE collection_id = ? AND (upload_category = 'cover' OR upload_category = 'collection')`,
			[collectionId]
		);
		return rows;
	},

	// Get all yoyo photos by yoyoId
	async getAllYoyoPhotos(yoyoId) {
		const [rows] = await pool.execute(
			`SELECT * FROM user_uploads WHERE yoyo_id = ?`,
			[yoyoId]
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

	// Set cover photo
	async setCoverPhoto(newCover, collectionId) {
		const [rows] = await pool.execute(
			`UPDATE user_uploads
			SET upload_category = 'cover'
			WHERE id = ? AND collection_id = ?`,
			[newCover, collectionId]
		);
		return rows;
	},

	// Switch cover photo
	async switchCoverPhoto(oldCover, newCover, collectionId) {
		try {
			// Set the new cover photo
			await pool.execute(
				`UPDATE user_uploads
				SET upload_category = 'cover'
				WHERE id = ? AND collection_id = ?`,
				[newCover, collectionId]
			);

			// Reset the old cover photo to "collection"
			await pool.execute(
				`UPDATE user_uploads
				SET upload_category = 'collection'
				WHERE id = ? AND collection_id = ?`,
				[oldCover, collectionId]
			);

			return { success: true };
		} catch (error) {
			console.error('Error switching cover photo:', error);
			throw error;
		}
	},

	// Unset cover photo
	async unsetCoverPhoto(cover, collectionId) {
		const [rows] = await pool.execute(
			`UPDATE user_uploads
				SET upload_category = 'collection'
				WHERE id = ? AND collection_id = ?`,
			[cover, collectionId]
		);
		return rows;
	},

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
		collectionId,
		yoyoId
	) {
		const [result] = await pool.execute(
			'INSERT INTO user_uploads (user_id, public_id, secure_url, format, resource_type, bytes, height, width, upload_category, collection_id, yoyo_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
				yoyoId,
			]
		);
		return result;
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
};

export default Uploads;
