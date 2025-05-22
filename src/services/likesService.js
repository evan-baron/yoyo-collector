import likesModel from '@/models/likesModel';

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

export default {
	getAllLikesByUserId,
};
