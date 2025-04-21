'use client';

// Libraries
import React, { useState } from 'react';
import { CldImage as CldImageDefault } from 'next-cloudinary';

// Utils
import axiosInstance from '@/utils/axios';

// Components
import LoadingSpinner from '../loading/LoadingSpinner';

// Context
import { useAppContext } from '@/app/context/AppContext';

function PictureUploader(props) {
	const { user } = useAppContext();
	const { id } = user;

	// State to hold the uploaded image URL
	const [imageUrl, setImageUrl] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Handle file upload
	const handleImageUpload = async (event) => {
		const file = event.target.files[0];

		if (!file) return;

		// Set loading state
		setLoading(true);
		setError(null);

		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await axiosInstance.post(
				'/api/user/uploadFiles/profilePictures',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						'x-user-id': id,
					},
				}
			);

			setImageUrl(response.data.url);
		} catch (err) {
			setError(err.message?.data?.error || 'Failed to upload image');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			{/* File input for image upload */}
			<input
				type='file'
				accept='image/*'
				onChange={handleImageUpload}
				disabled={loading}
			/>

			{/* Loading spinner */}
			{loading && <LoadingSpinner />}

			{/* Display image if uploaded successfully */}
			{imageUrl && (
				<div>
					<p>Image uploaded successfully:</p>
					<CldImageDefault
						src={imageUrl}
						width={200} // Adjust width as needed
						height={200} // Adjust height as needed
						alt='Uploaded image'
					/>
				</div>
			)}

			{/* Display error if there's an issue */}
			{error && <p style={{ color: 'red' }}>Error: {error}</p>}
		</div>
	);
}

export default PictureUploader;
