import uploadsModel from '@/models/uploadsModel';

// ALL FUNCTIONS LISTED BELOW ALPHABETICALLY

// Delete a photo
const deletePhoto = async (userId, photoId) => {
	try {
		return await uploadsModel.deletePhotoById(userId, photoId);
	} catch (error) {
		console.error('Error deleting photo:', error.message);
		throw error;
	}
};

// Delete all uploads by collectionId
const deleteUploadsByCollectionId = async (userId, collectionId) => {
	try {
		return await uploadsModel.deleteAllUploadsByCollectionId(
			userId,
			collectionId
		);
	} catch (error) {
		console.error(
			'Error deleting uploads in uploadsModel deleteUploadsByCollectionId',
			error.message
		);
		throw error;
	}
};

// Get all collection photos by collectionId
const getAllCollectionPhotos = async (collectionId) => {
	return await uploadsModel.getAllCollectionPhotos(collectionId);
};

// Get all collection photos by userId and collectionId
const getAllCollectionPhotosByUserId = async (userId, collectionId) => {
	return await uploadsModel.getAllCollectionPhotosByUserId(
		userId,
		collectionId
	);
};

// Get photo by UserID and Category
const getPhotosByUserIdAndCategory = async (userId, category) => {
	return await uploadsModel.getPhotosByIdAndCategory(userId, category);
};

// Get photo by ID
const getPhotoById = async (photoId) => {
	return await uploadsModel.getPhotoById(photoId);
};

// Set cover photo
const setCoverPhoto = async (newCover, collectionId) => {
	return await uploadsModel.setCoverPhoto(newCover, collectionId);
};

// Switch cover photos
const switchCoverPhoto = async (oldCover, newCover, collectionId) => {
	return await uploadsModel.switchCoverPhoto(oldCover, newCover, collectionId);
};

// Unset cover photo
const unsetCoverPhoto = async (cover, collectionId) => {
	return await uploadsModel.unsetCoverPhoto(cover, collectionId);
};

// Upload a photo
const uploadPhoto = async (
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
) => {
	try {
		await uploadsModel.uploadPhoto(
			userId,
			publicId,
			secureUrl,
			format,
			resourceType,
			bytes,
			height,
			width,
			category,
			collectionId || null
		);

		if (category === 'profile') {
			const profilePicture = await uploadsModel.getPhotosByIdAndCategory(
				userId,
				category
			);
			return { profilePicture: profilePicture[0] };
		} else if (category === 'cover') {
			const photos = await uploadsModel.getPhotosByIdAndCategory(
				userId,
				category
			);
			const coverPhoto = photos.find((photo) => photo.public_id === publicId);
			return coverPhoto ? { coverPhoto } : null;
		}

		return {
			message: 'Upload successful',
		};
	} catch (error) {
		console.error('Error uploading photo:', error.message);
		throw error;
	}
};

// Update profilePicture
const updateProfilePicture = async (
	userId,
	publicId,
	secureUrl,
	format,
	resourceType,
	bytes,
	height,
	width
) => {
	try {
		await uploadsModel.updateProfilePicture(
			userId,
			publicId,
			secureUrl,
			format,
			resourceType,
			bytes,
			height,
			width
		);

		const profilePicture = await uploadsModel.getPhotosByIdAndCategory(
			userId,
			'profile'
		);
		return { profilePicture: profilePicture[0] };
	} catch (error) {
		console.error('Error updating photo:', error.message);
	}
};

export default {
	deletePhoto,
	deleteUploadsByCollectionId,
	getAllCollectionPhotos,
	getAllCollectionPhotosByUserId,
	getPhotoById,
	getPhotosByUserIdAndCategory,
	setCoverPhoto,
	switchCoverPhoto,
	unsetCoverPhoto,
	updateProfilePicture,
	uploadPhoto,
};
