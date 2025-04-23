'use client';

// Libraries
import React, { useState, useEffect, useRef } from 'react';

// Utils
import axios from 'axios';
import axiosInstance from '@/utils/axios';

// Styles
import styles from './profilePictureUploader.module.scss';

// MUI
import { FileUpload, Undo } from '@mui/icons-material';

// Context
import { useAppContext } from '@/app/context/AppContext';

function ProfilePictureUploader({ uploadType }) {
	// Context
	const { loading, setLoading, user, setUser } = useAppContext();

	// State to hold the uploaded image URL
	const [imageToUpload, setImageToUpload] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [uploadAction, setUploadAction] = useState(null);
	const [error, setError] = useState(null);
	const [remove, setRemove] = useState(false);
	const [profilePicture, setProfilePicture] = useState(null);
	const [updatingPicture, setUpdatingPicture] = useState(false);

	useEffect(() => {
		console.log('useEffect triggered in profilepictureuploader', user);
		const { secure_url } = user;
		setProfilePicture(secure_url);
		setPreviewUrl(null);
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
			setUpdatingPicture(true);
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

					setUser((prev) => ({
						...prev,
						secure_url: profilePicture.secure_url,
					}));
				} catch (error) {
					console.log('There was an error saving the photo:', error);
				} finally {
					setImageToUpload(null);
					setUpdatingPicture(false);
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
			setUser((prev) => ({
				...prev,
				secure_url: null,
			}));
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
					{previewUrl ? (
						<img
							src={previewUrl}
							alt='Preview profile picture'
							className={styles.image}
						/>
					) : profilePicture && !updatingPicture ? (
						<img
							src={profilePicture}
							alt='Current profile picture'
							className={styles.image}
						/>
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
							<p className={styles.delete}>Remove Photo?</p>
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
				{profilePicture && updatingPicture && (
					<Undo
						className={styles.undo}
						onClick={() => {
							setImageToUpload(null);
							setUpdatingPicture(null);
							setPreviewUrl(null);
							if (fileInputRef.current) {
								fileInputRef.current.value = '';
							}
						}}
					/>
				)}
				<label className={styles.button} htmlFor='fileInput'>
					{profilePicture || previewUrl ? 'Change' : 'Upload'} Photo
				</label>
				{previewUrl && (
					<button className={styles.button} type='button' onClick={handleSave}>
						Save
					</button>
				)}
				{profilePicture && !updatingPicture && (
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

export default ProfilePictureUploader;
