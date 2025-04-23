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
const getPhotoByUserIdAndCategory = async (userId, category) => {
	return await uploadsModel.getPhotoByIdAndCategory(userId, category);
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
	category
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
			category
		);

		if (category === 'profile') {
			const profilePicture = await uploadsModel.getPhotoByIdAndCategory(
				userId,
				category
			);
			return { profilePicture };
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

		const profilePicture = await uploadsModel.getPhotoByIdAndCategory(
			userId,
			'profile'
		);
		return { profilePicture };
	} catch (error) {
		console.error('Error updating photo:', error.message);
	}
};

export default {
	deletePhoto,
	getPhotoById,
	getPhotoByUserIdAndCategory,
	updateProfilePicture,
	uploadPhoto,
};
