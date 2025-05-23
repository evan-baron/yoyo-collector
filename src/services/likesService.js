import likesModel from '@/models/likesModel';
import collectionsModel from '@/models/collectionsModel';
import uploadsModel from '@/models/uploadsModel';
import yoyosModel from '@/models/yoyosModel';

// Get all likes by userId
const getAllFavoritesByUserId = async (userId) => {
	try {
		const rows = await likesModel.getAllFavoritesByUserId(userId);

		const userLikes = rows.reduce(
			(accumulator, row) => {
				const { favorited_type, favorited_id } = row;

				if (!accumulator[favorited_type]) {
					accumulator[favorited_type] = {};
				}

				accumulator[favorited_type][favorited_id] = true;

				return accumulator;
			},
			{ collections: {}, uploads: {}, yoyos: {} }
		);

		return { userLikes };
	} catch (error) {
		console.error('Error fetching likes:', error.message);
	}
};

// Get all likes by userId
const getAllLikesByUserId = async (userId) => {
	try {
		const rows = await likesModel.getAllLikesByUserId(userId);

		const userLikes = rows.reduce(
			(accumulator, row) => {
				const { liked_type, liked_id } = row;

				if (!accumulator[liked_type]) {
					accumulator[liked_type] = {};
				}

				accumulator[liked_type][liked_id] = true;

				return accumulator;
			},
			{ collections: {}, uploads: {}, yoyos: {} }
		);

		return { userLikes };
	} catch (error) {
		console.error('Error fetching likes:', error.message);
	}
};

// Like an item
const likeAnItem = async (userId, liked_type, liked_id) => {
	try {
		await likesModel.likeAnItem(userId, liked_type, liked_id);

		if (liked_type === 'collections') {
			await collectionsModel.incrementCollectionLikes(liked_id);
		} else if (liked_type === 'uploads') {
			await uploadsModel.incrementPhotoLikes(liked_id);
		} else if (liked_type === 'yoyos') {
			await yoyosModel.incrementYoyoLikes(liked_id);
		}
	} catch (error) {
		console.error('Error liking an item at likesService:', error.message);
	}
};

// Unlike an item
const unlikeAnItem = async (userId, liked_type, liked_id) => {
	try {
		await likesModel.unlikeAnItem(userId, liked_type, liked_id);

		if (liked_type === 'collections') {
			await collectionsModel.decrementCollectionLikes(liked_id);
		} else if (liked_type === 'uploads') {
			await uploadsModel.decrementPhotoLikes(liked_id);
		} else if (liked_type === 'yoyos') {
			await yoyosModel.decrementYoyoLikes(liked_id);
		}
	} catch (error) {
		console.error('Error unliking an item at likesService:', error.message);
	}
};

export default {
	getAllFavoritesByUserId,
	getAllLikesByUserId,
	likeAnItem,
	unlikeAnItem,
};
