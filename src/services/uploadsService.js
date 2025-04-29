import uploadsModel from '@/models/uploadsModel';

// ALL FUNCTIONS LISTED BELOW ALPHABETICALLY

// Delete a photo
const deletePhoto = async (userId, photoId, category) => {
	try {
		if (category === 'profile') {
			return await uploadsModel.deleteProfilePicture(userId);
		} else {
			return await uploadsModel.deletePhotoById(userId, photoId);
		}
	} catch (error) {
		console.error('Error deleting photo:', error.message);
		throw error;
	}
};

// Get photo by ID
const getPhotosByUserIdAndCategory = async (userId, category) => {
	return await uploadsModel.getPhotosByIdAndCategory(userId, category);
};

// Get photo by ID
const getPhotoById = async (photoId) => {
	return await uploadsModel.getPhotoById(photoId);
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
			collectionId
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
			const coverPhoto = photos.find(
				(photo) => (photo.collection_id = collectionId)
			);
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
	getPhotoById,
	getPhotosByUserIdAndCategory,
	updateProfilePicture,
	uploadPhoto,
};
