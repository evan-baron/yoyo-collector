'use client';

// Libraries
import React, { useState } from 'react';
import Image from 'next/image';

// Utils
import axios from 'axios';
import axiosInstance from '@/utils/axios';

// Components
import LoadingSpinner from '../loading/LoadingSpinner';

function PictureUploader() {
	// State to hold the uploaded image URL
	const [imageToUpload, setImageToUpload] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [profilePicture, setProfilePicture] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [uploadedImageData, setUploadedImageData] = useState(null);

	const handleUploadImage = (e) => {
		setImageToUpload(e.target.files[0]);
		setPreviewUrl(URL.createObjectURL(e.target.files[0]));
	};

	// Handle file upload
	const handleUploadPhoto = async (e) => {
		const file = imageToUpload;

		if (!file) return;

		const formData = new FormData();

		formData.append('file', file);
		formData.append(
			'upload_preset',
			process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_PROFILE
		);

		try {
			setLoading(true);
			setError(null);
			const response = await axios.post(
				'https://api.cloudinary.com/v1_1/ddbotvjio/image/upload',
				formData
			);

			console.log(response.data);

			const {
				public_id,
				secure_url,
				format,
				resource_type,
				bytes,
				height,
				width,
			} = response.data;

			const uploadData = {
				public_id,
				secure_url,
				format,
				resource_type,
				bytes,
				height,
				width,
				category: 'profile',
			};

			try {
				const response = await axiosInstance.post(
					'/api/user/profilePictures',
					uploadData
				);
				console.log(response.data);
			} catch (error) {
				console.log('There was an error saving the photo:', error);
			}
		} catch (err) {
			console.error(
				'Upload error:',
				err.response?.data?.error?.message || 'Failed to upload image'
			);
		} finally {
			setLoading(false);
		}
	};

	const handleSaveProfilePicture = async () => {
		const response = await axios.post(
			'/api/user/profilePictures',
			{ imageUrl: previewUrl },
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		if (response.status === 201) {
			alert('Profile picture saved!');
		} else {
			alert('Failed to save profile picture.');
		}
	};

	const handleChangePhoto = () => {
		setPreviewUrl(null);
	};

	return (
		<div>
			<input
				type='file'
				accept='image/*'
				onChange={handleUploadImage}
				disabled={loading}
			/>

			<button type='button' onClick={handleUploadPhoto}>
				Save
			</button>

			{loading && <LoadingSpinner />}

			{previewUrl && (
				<div>
					<Image
						src={previewUrl}
						width={200} // Adjust width as needed
						height={200} // Adjust height as needed
						alt='Uploaded image'
					/>
				</div>
			)}
		</div>
	);
}

export default PictureUploader;
