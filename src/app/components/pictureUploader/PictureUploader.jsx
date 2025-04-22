'use client';

// Libraries
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Styles
import styles from './pictureUploader.module.scss';

// Utils
import axios from 'axios';
import axiosInstance from '@/utils/axios';

// Components
import LoadingSpinner from '../loading/LoadingSpinner';

// Context
import { useAppContext } from '@/app/context/AppContext';
import { BorderRight } from '@mui/icons-material';

function PictureUploader({ uploadType }) {
	// Context
	const { user, loading, setLoading } = useAppContext();

	// State to hold the uploaded image URL
	const [profilePicture, setProfilePicture] = useState(null);
	const [imageToUpload, setImageToUpload] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);

	const handleUploadImage = (e) => {
		setImageToUpload(e.target.files[0]);
		setPreviewUrl(URL.createObjectURL(e.target.files[0]));
	};

	useEffect(() => {
		console.log('useEffect triggered');
		const getProfilePicture = async () => {
			const response = await axiosInstance.get(
				`/api/user/profilePictures?type=${uploadType}`
			);
			const { secure_url } = response.data;
			setProfilePicture(secure_url);
		};
		getProfilePicture();
	}, [user]);

	useEffect(() => {}, [profilePicture]);

	// Handle file upload
	const handleUploadPhoto = async () => {
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
			const response = await axios.post(
				'https://api.cloudinary.com/v1_1/ddbotvjio/image/upload',
				formData
			);

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
				category: uploadType,
			};

			try {
				const response = await axiosInstance.post(
					'/api/user/profilePictures',
					uploadData
				);
				const { profilePicture } = response.data;
				setProfilePicture(profilePicture.secure_url);
				setPreviewUrl(null);
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

	return (
		<div className={styles.container}>
			<div className={styles['profile-picture']}>
				<label htmlFor='fileInput' className={styles.placeholder}>
					<input
						name='fileInput'
						id='fileInput'
						type='file'
						accept='image/*'
						onChange={handleUploadImage}
						disabled={loading}
						className={styles.input}
					/>
					<div
						className={styles.options}
						style={{
							transform: (profilePicture || previewUrl) && 'rotate(45deg)',
						}}
					>
						<div className={styles.vertical}></div>
						<div className={styles.horizontal}></div>
					</div>
					{profilePicture ? (
						<Image
							src={profilePicture}
							alt='Current profile picture'
							fill
							className={styles.image}
						/>
					) : previewUrl ? (
						<Image
							src={previewUrl}
							alt='Preview profile picture'
							fill
							className={styles.image}
						></Image>
					) : (
						<>
							<div className={styles.head}></div>
							<div className={styles.body}></div>
						</>
					)}
				</label>
			</div>
			<div className={styles.buttons}>
				<label className={styles.button} htmlFor='fileInput'>
					Upload Photo
				</label>
				<button
					className={styles.button}
					type='button'
					onClick={handleUploadPhoto}
				>
					Save
				</button>
			</div>
		</div>
	);
}

export default PictureUploader;
