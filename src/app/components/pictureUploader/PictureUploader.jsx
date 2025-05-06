'use client';

// Libraries
import React, { useState, useEffect, useRef } from 'react';

// Utils
import axios from 'axios';
import axiosInstance from '@/lib/utils/axios';

// Styles
import styles from './pictureUploader.module.scss';

// MUI
import { FileUpload, Undo } from '@mui/icons-material';

// Context
import { useAppContext } from '@/app/context/AppContext';

// Components
import BlankProfilePhoto from '../blankProfilePhoto/BlankProfilePhoto';
import BlankCoverPhoto from '../blankCoverPhoto/BlankCoverPhoto';
import NewCollectionTile from '../newCollectionTile/NewCollectionTile';

function PictureUploader({
	uploadType,
	defaultUrl,
	collection,
	setCoverPhoto,
	editing,
}) {
	// Context
	const { loading, setLoading, user, setUser, setNewCollectionCounter } =
		useAppContext();

	// State to hold the uploaded image URL
	const [imageToUpload, setImageToUpload] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [uploadAction, setUploadAction] = useState(null);
	const [error, setError] = useState(null);
	const [remove, setRemove] = useState(false);
	const [picture, setPicture] = useState(defaultUrl);
	const [updatingPicture, setUpdatingPicture] = useState(false);

	useEffect(() => {
		setPicture(defaultUrl);
		setPreviewUrl(null);
	}, [user, defaultUrl]);

	const fileInputRef = useRef(null);

	// Helpers
	const getPreset = (uploadType) => {
		const preset = {
			profile: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_PROFILE,
			cover: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_COLLECTION,
			collection: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_COLLECTION,
			yoyo: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_YOYO,
		};
		return preset[uploadType];
	};

	// Upload to cloudinary
	const cloudinaryData = async (formData) => {
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

		const cloudinaryData = {
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

		return cloudinaryData;
	};

	// Handle upload
	const handleUpload = async (e) => {
		if (!e.target.files.length) return;

		const size = e.target.files[0]?.size;

		if (size > 4194304) {
			setError('File must not exceed 4mb');
			return;
		} else {
			// IF THERE IS ALREADY A PICTURE URL, SET TO UPDATE, ELSE SET TO NEW
			if (!picture) {
				setUploadAction('new');
			} else {
				setUploadAction('update');
			}

			if (uploadType === 'collection') {
				const file = e.target.files[0];

				const formData = new FormData();

				const preset = getPreset(uploadType);

				formData.append('file', file);
				formData.append('upload_preset', preset);

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
						uploadData.collectionId = collection;

						await axiosInstance.post(
							'/api/user/collectionPictures',
							uploadData
						);
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
				return;
			}

			setError(null);
			setUpdatingPicture(true);
			setImageToUpload(e.target.files[0]);
			setPreviewUrl(URL.createObjectURL(e.target.files[0]));
		}
	};

	// Handle save
	const handleSave = async () => {
		if (!imageToUpload) return;

		if (imageToUpload.size > 4194304) {
			setError('File must not exceed 4mb');
			return;
		}

		const formData = new FormData();

		const preset = getPreset(uploadType);

		formData.append('file', imageToUpload);
		formData.append('upload_preset', preset);

		setLoading(true);
		try {
			// Uploading to cloudinary first
			const uploadData = await cloudinaryData(formData);

			if (uploadType === 'profile') {
				const response = await axiosInstance.post(
					'/api/user/profilePictures',
					uploadData
				);
				const { profilePicture } = response.data;

				setUser((prev) => ({
					...prev,
					secure_url: profilePicture.secure_url,
				}));
			} else if (uploadType === 'cover') {
				uploadData.collectionId = collection;

				const response = await axiosInstance.post(
					'/api/user/collectionPictures',
					uploadData
				);

				const { coverPhoto } = response.data;
				setPicture(coverPhoto.secure_url);
				setCoverPhoto(coverPhoto.secure_url);
			} else if (uploadType === 'collection' || uploadType === 'yoyo') {
				uploadData.collectionId = collection;

				await axiosInstance.post('/api/user/collectionPictures', uploadData);
			} else {
				console.error('Unrecognized upload type');
			}
		} catch (err) {
			console.error(
				'Upload error:',
				err.response?.data?.error?.message || 'Failed to upload image'
			);
		} finally {
			setLoading(false);
			setImageToUpload(null);
			setUpdatingPicture(false);
			setNewCollectionCounter((prev) => (prev += 1));
		}
	};

	// Handle delete
	const handleDelete = async () => {
		try {
			if (uploadType === 'profile') {
				await axiosInstance.delete(
					`/api/user/profilePictures?category=${uploadType}`
				);
				setUser((prev) => ({
					...prev,
					secure_url: null,
				}));
			} else if (uploadType === 'cover') {
				await axiosInstance.delete('/api/user/collectionPictures', {
					data: {
						collection,
						uploadType,
					},
				});
				setPicture(null);
				setCoverPhoto(null);
			} else {
				console.log('do nothing');
			}
			setPreviewUrl(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
			setRemove(false);
		} catch (error) {
			console.error('There was an error deleting the photo:', error.message);
		} finally {
			setNewCollectionCounter((prev) => (prev += 1));
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles['picture-container']}>
				<label
					htmlFor='fileInput'
					className={`
						${styles.placeholder} 
						${uploadType === 'profile' ? styles.circle : styles.square} 
						${editing && !picture && styles.glowing} 
						${uploadType === 'collection' && styles.collection}
					`}
					style={{
						boxShadow: uploadType === 'cover' && '0 0 1.5rem black',
					}}
				>
					<input
						name='fileInput'
						id='fileInput'
						type='file'
						ref={fileInputRef}
						accept='image/*'
						onChange={handleUpload}
						disabled={loading}
						className={`${styles.input} ${
							uploadType === 'profile' ? styles.circle : styles.square
						}`}
					/>
					{uploadType !== 'collection' && (
						<div
							className={`${styles.options} ${
								uploadType === 'profile' ? styles.circle : styles.square
							}`}
						>
							<div
								className={`${styles.update} ${
									uploadType === 'profile' ? styles.circle : styles.square
								}`}
								style={{
									fontSize: uploadType === 'collection' ? '2rem' : '3rem',
								}}
							>
								<FileUpload className={styles.upload} />
								{picture || previewUrl ? 'Change' : 'Upload Photo'}
							</div>
						</div>
					)}
					{previewUrl ? (
						<img
							src={previewUrl}
							alt='Preview profile picture'
							className={`${styles.image} ${
								uploadType === 'profile' ? styles.circle : styles.square
							}`}
						/>
					) : picture && !updatingPicture ? (
						<img
							src={picture}
							alt='Current profile picture'
							className={`${styles.image} ${
								uploadType === 'profile' ? styles.circle : styles.square
							}`}
						/>
					) : uploadType === 'profile' ? (
						<BlankProfilePhoto />
					) : uploadType === 'cover' ? (
						<BlankCoverPhoto />
					) : (
						<div className={styles.new}></div>
					)}
				</label>
				{remove && (
					<div
						className={`${styles['remove-container']} ${
							uploadType === 'profile' ? styles.circle : styles.square
						}`}
					>
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
			{uploadType !== 'collection' && (
				<div className={styles.buttons}>
					{updatingPicture && (
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
						{picture || previewUrl ? 'Change' : 'Upload Photo'}
					</label>
					{previewUrl && (
						<button
							className={styles.button}
							type='button'
							onClick={handleSave}
						>
							Save
						</button>
					)}
					{picture && !updatingPicture && (
						<button
							className={styles.button}
							type='button'
							onClick={() => setRemove(true)}
						>
							Remove
						</button>
					)}
				</div>
			)}
			{error && <p className={styles.error}>{error}</p>}
		</div>
	);
}

export default PictureUploader;
