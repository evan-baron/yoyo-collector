'use client';

// Libraries
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// Utils
import axios from 'axios';
import axiosInstance from '@/utils/axios';

// Styles
import styles from './pictureUploader.module.scss';

// MUI
import { FileUpload } from '@mui/icons-material';

// Context
import { useAppContext } from '@/app/context/AppContext';

function PictureUploader({ uploadType }) {
	// Context
	const { user, loading, setLoading } = useAppContext();

	// State to hold the uploaded image URL
	const [profilePicture, setProfilePicture] = useState(null);
	const [publicId, setPublicId] = useState(null);
	const [imageToUpload, setImageToUpload] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [uploadAction, setUploadAction] = useState(null);
	const [error, setError] = useState(null);
	const [remove, setRemove] = useState(false);

	// Gets current profile picture if exists
	useEffect(() => {
		console.log('useEffect triggered');
		const getProfilePicture = async () => {
			const response = await axiosInstance.get(
				`/api/user/profilePictures?type=${uploadType}`
			);
			const { secure_url, public_id } = response.data;
			setProfilePicture(secure_url);
			setPublicId(public_id);
		};
		getProfilePicture();
	}, [user]);

	const fileInputRef = useRef(null);

	// Handle upload
	const handleUpload = (e) => {
		if (!e.target.files.length) return;

		const size = e.target.files[0]?.size;

		if (size > 5242880) {
			setError('File must not exceed 5mb');
			return;
		} else {
			if (!profilePicture) {
				setUploadAction('new');
			} else {
				setUploadAction('update');
			}
			setError(null);
			setImageToUpload(e.target.files[0]);
			setPreviewUrl(URL.createObjectURL(e.target.files[0]));
		}
	};

	// Handle save
	const handleSave = async () => {
		const file = imageToUpload;

		if (!file) return;

		if (file.size > 5242880) {
			setError('File must not exceed 5mb');
			return;
		} else {
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
					uploadAction,
				};

				try {
					const response = await axiosInstance.post(
						'/api/user/profilePictures',
						uploadData
					);
					const { profilePicture } = response.data;
					setProfilePicture(profilePicture.secure_url);
					setPreviewUrl(null);
					setImageToUpload(null);
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
		}
	};

	// Handle delete
	const handleDelete = async () => {
		try {
			await axiosInstance.delete(
				`/api/user/profilePictures?category=${uploadType}`
			);
			setPreviewUrl(null);
			setProfilePicture(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
			setRemove(false);
		} catch (error) {
			console.error('There was an error deleting the photo:', error.message);
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
						ref={fileInputRef}
						accept='image/*'
						onChange={handleUpload}
						disabled={loading}
						className={styles.input}
					/>
					<div className={styles.options}>
						<div className={styles.update}>
							<FileUpload className={styles.upload} />
							{profilePicture || previewUrl ? 'Change' : 'Upload'} Photo
						</div>
					</div>
					{profilePicture ? (
						<Image
							src={profilePicture}
							alt='Current profile picture'
							fill
							sizes='100vw'
							className={styles.image}
						/>
					) : previewUrl ? (
						<Image
							src={previewUrl}
							alt='Preview profile picture'
							fill
							sizes='100vw'
							className={styles.image}
						></Image>
					) : (
						<>
							<div className={styles.head}></div>
							<div className={styles.body}></div>
						</>
					)}
				</label>
				{remove && (
					<div className={styles['remove-container']}>
						<div className={styles.remove}>
							<p className={styles.delete}>Delete Photo?</p>
							<div className={styles.buttons}>
								<button
									className={styles['delete-button']}
									onClick={handleDelete}
								>
									Yes
								</button>
								<button
									className={styles['delete-button']}
									onClick={() => setRemove(false)}
								>
									Cancel
								</button>
							</div>
							<div className={styles.background}></div>
						</div>
					</div>
				)}
			</div>
			<div className={styles.buttons}>
				<label className={styles.button} htmlFor='fileInput'>
					{profilePicture || previewUrl ? 'Change' : 'Upload'} Photo
				</label>
				{previewUrl && (
					<button className={styles.button} type='button' onClick={handleSave}>
						Save
					</button>
				)}
				{profilePicture && (
					<button
						className={styles.button}
						type='button'
						onClick={() => setRemove(true)}
					>
						Remove
					</button>
				)}
			</div>
			{error && <p className={styles.error}>{error}</p>}
		</div>
	);
}

export default PictureUploader;
