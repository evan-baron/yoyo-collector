'use client';

// Libraries
import React, { useState } from 'react';
import Image from 'next/image';

// Utils
import axiosInstance from '@/utils/axios';

// Components
import LoadingSpinner from '../loading/LoadingSpinner';

function PictureUploader() {
	// State to hold the uploaded image URL
	const [previewUrl, setPreviewUrl] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleUploadPreview = async (e) => {
		console.log(e);

		const file = e.target.files[0];
		const formData = new FormData();
		formData.append('file', file);

		for (let [key, value] of formData.entries()) {
			console.log(`${key}:`, value);
		}

		try {
			const response = await axiosInstance.post(
				'api/user/profilePictures',
				formData
			);

			console.log(response.data);
		} catch (error) {
			console.log('Error uploading files:', error.message);
		}

		return;
	};

	return (
		<div>
			{/* File input for image upload */}
			<input
				type='file'
				accept='image/*'
				onChange={handleUploadPreview}
				disabled={loading}
			/>

			{/* Loading spinner */}
			{loading && <LoadingSpinner />}

			{/* Display image if uploaded successfully */}
			{previewUrl && (
				<div>
					<p>Image uploaded successfully:</p>
					<Image
						src={previewUrl}
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
