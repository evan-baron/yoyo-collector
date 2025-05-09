import yoyoModel from '@/models/yoyosModel';

// Get photo by ID
const getYoyoById = async (yoyoId) => {
	return await yoyoModel.getYoyoById(yoyoId);
};

// Get yoyos by collectionId
const getYoyosByCollectionId = async (collectionId) => {
	return await yoyoModel.getYoyosByCollectionId(collectionId);
};

// Get yoyos by userId
const getYoyosByUserId = async (userId) => {
	return await yoyoModel.getYoyosByUserId(userId);
};

// Create yoyo
const createYoyo = async (
	userId,
	collectionId,
	bearing,
	brand,
	category,
	color,
	condition,
	model,
	originalOwner,
	price,
	purchased,
	responseType,
	value,
	year
) => {
	return await yoyoModel.createYoyo(
		userId,
		collectionId,
		bearing,
		brand,
		category,
		color,
		condition,
		model,
		originalOwner,
		price,
		purchased,
		responseType,
		value,
		year
	);
};

// Update yoyo
const updateYoyo = async (yoyoId, updates) => {
	return await yoyoModel.updateYoyo(yoyoId, updates);
};

// Delete yoyo
const deleteYoyo = async (yoyoId, userId) => {
	return await yoyoModel.deleteYoyo(yoyoId, userId);
};

export default {
	getYoyoById,
	getYoyosByCollectionId,
	getYoyosByUserId,
	createYoyo,
	updateYoyo,
	deleteYoyo,
};
