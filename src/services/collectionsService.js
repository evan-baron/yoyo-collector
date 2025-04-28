import collectionsModel from '@/models/collectionsModel';

// ALL FUNCTIONS LISTED BELOW ALPHABETICALLY

// Create a collection
const createCollection = async (userId, name) => {
	try {
		return await collectionsModel.createCollection(userId, name);
	} catch (error) {
		console.error('Error creating collection:', error.message);
		throw error;
	}
};

// Delete a collection
const deleteCollection = async (userId, name) => {
	try {
		const response = await collectionsModel.getCollectionId(userId, name);
		const { id } = response.data;
		const collectionId = id;
		return await collectionsModel.deleteCollection(userId, collectionId);
	} catch (error) {
		console.error('Error deleting collection:', error.message);
		throw error;
	}
};

// Get collection by userId
const getCollectionById = async (collectionId) => {
	return await collectionsModel.getCollectionById(collectionId);
};

// Get collection by userId
const getCollectionByName = async (userId, name) => {
	return await collectionsModel.getCollectionByName(userId, name);
};

// Update a collection
const updateCollection = async (name, collectionId, description) => {
	try {
		await collectionsModel.updateCollection(name, collectionId, description);

		const collection = await collectionsModel.getCollectionById(collectionId);
		return { collection };
	} catch (error) {
		console.error('Error updating collection:', error.message);
	}
};

export default {
	createCollection,
	deleteCollection,
	getCollectionById,
	getCollectionByName,
	updateCollection,
};
