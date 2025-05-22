import collectionsModel from '@/models/collectionsModel';
import uploadsModel from '@/models/uploadsModel';
import yoyosModel from '@/models/yoyosModel';

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
const deleteCollection = async (userId, collectionId) => {
	try {
		return await collectionsModel.deleteCollection(userId, collectionId);
	} catch (error) {
		console.error('Error deleting collection:', error.message);
		throw error;
	}
};

// Get ALL collections less 'private' user collections
const getAllCollections = async (sortType) => {
	const allCollections = await collectionsModel.getAllCollectionsBySortType(
		sortType
	);

	return { allCollections };
};

// Get all collections by userId
const getAllCollectionsById = async (userId) => {
	const collectionsData = await collectionsModel.getAllCollectionsById(userId);
	return collectionsData;
};

// Get collection by collectionId
const getCollectionById = async (collectionId) => {
	const collectionData = await collectionsModel.getCollectionById(collectionId);
	const collectionPhotos = await uploadsModel.getAllCollectionPhotos(
		collectionId
	);
	const yoyosData = await yoyosModel.getYoyosByCollectionId(collectionId);
	return { collectionData, collectionPhotos, yoyosData };
};

// Get collection by userId and collectionName
const getCollectionByName = async (userId, collectionName) => {
	return await collectionsModel.getCollectionByName(userId, collectionName);
};

// Get five newest collections less 'private' user collections
const getFiveNewestCollections = async () => {
	const fiveNewestCollections =
		await collectionsModel.getFiveNewestCollections();
	return { fiveNewestCollections };
};

// Get top five collections less 'private' user collections
const getTopFiveCollections = async () => {
	const topFiveCollections = await collectionsModel.getTopFiveCollections();
	return { topFiveCollections };
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
	getAllCollections,
	getAllCollectionsById,
	getCollectionById,
	getCollectionByName,
	getFiveNewestCollections,
	getTopFiveCollections,
	updateCollection,
};
