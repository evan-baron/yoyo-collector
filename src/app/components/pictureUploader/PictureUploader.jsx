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

function PictureUploader({
	input,
	uploadType,
	defaultUrl,
	collection,
	setCoverPhoto,
	editing,
}) {
	// Context
	const { loading, setLoading, user, setUser, setNewCollectionCounter } =
		useAppContext();

	const MAX_FILES = 10;
	const MAX_FILE_SIZE = 4 * 1024 * 1024;

	// State to hold the uploaded image URL
	const [imageToUpload, setImageToUpload] = useState([]);
	const [previewUrl, setPreviewUrl] = useState();
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
		setError(null);

		const files = Array.from(e.target.files);

		if (uploadType === 'yoyo') {
			console.log('not built yet');
			return;
		}

		if (!files.length) return;

		if (
			uploadType !== 'profile' &&
			uploadType !== 'cover' &&
			files.length > MAX_FILES
		) {
			setError(`You may only upload up to ${MAX_FILES} files at a time.`);
			return;
		}

		console.log(uploadType);

		const validFiles = files.filter((file) => file.size <= MAX_FILE_SIZE);

		if (uploadType === 'profile' || uploadType === 'cover') {
			if (!validFiles.length) {
				setError('File must not exceed 4MB');
				return;
			}

			const file = validFiles[0];

			// IF THERE IS ALREADY A PICTURE URL, SET TO UPDATE, ELSE SET TO NEW
			if (!picture) {
				setUploadAction('new');
			} else {
				setUploadAction('update');
			}

			setUpdatingPicture(true);
			setImageToUpload(file);
			setPreviewUrl(URL.createObjectURL(file));

			return;
		} else {
			if (!validFiles.length && files.length === 1) {
				setError('File must not exceed 4MB');
				return;
			} else if (!validFiles.length) {
				setError('All selected files were too large (max: 4MB).');
				return;
			} else if (validFiles.length !== files.length) {
				setError('Some files were larger than 4MB and were skipped.');
			}

			try {
				setLoading(true);

				const preset = getPreset(uploadType);

				const uploadPromises = validFiles.map(async (file) => {
					const formData = new FormData();
					formData.append('file', file);
					formData.append('upload_preset', preset);

					const { data } = await axios.post(
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
					} = data;

					const uploadData = {
						...data,
						category: uploadType,
						uploadAction: 'new',
						collectionId: collection,
					};

					await axiosInstance.post('/api/user/collectionPictures', uploadData);
					setNewCollectionCounter((prev) => prev + 1);
				});

				await Promise.all(uploadPromises);
			} catch (error) {
				console.log('There was an error saving the photo:', error);
			} finally {
				fileInputRef.current.value = '';
				setLoading(false);
				setImageToUpload(null);
				setUpdatingPicture(false);
			}
			return;
		}
	};

	// Handle save
	const handleSave = async () => {
		if (!imageToUpload) return;

		if (imageToUpload.size > MAX_FILE_SIZE) {
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
			setNewCollectionCounter((prev) => prev + 1);
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
						remove,
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
			setNewCollectionCounter((prev) => prev + 1);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles['picture-container']}>
				<label
					htmlFor={input}
					className={`
						${styles.placeholder} 
						${uploadType === 'profile' ? styles.circle : styles.square} 
						${editing && !picture && styles.glowing} 
						${uploadType === 'collection' && styles.collection}
					`}
					style={{
						boxShadow:
							(uploadType === 'cover' || uploadType === 'yoyo') &&
							'0.25rem 0.25rem 1rem black',
					}}
				>
					<input
						name={input}
						id={input}
						type='file'
						multiple={uploadType !== 'profile' && uploadType !== 'cover'}
						ref={fileInputRef}
						accept='image/*'
						onChange={handleUpload}
						disabled={loading}
						className={`${styles.input} ${
							uploadType === 'profile' ? styles.circle : styles.square
						}`}
					/>
					{uploadType !== 'collection' && uploadType !== 'yoyo' && (
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
									fontSize:
										uploadType === 'collection' || uploadType === 'profile'
											? '2rem'
											: '2.5rem',
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
				{error && (
					<div className={styles['remove-container']}>
						<div className={styles.remove}>
							<p className={styles.error}>{error}</p>
							<div className={styles.buttons}>
								<button
									className={styles['delete-button']}
									onClick={() => {
										setError(null);
										setImageToUpload(null);
										fileInputRef.current.value = '';
									}}
								>
									Ok
								</button>
							</div>
							<div className={styles.background}></div>
						</div>
					</div>
				)}
			</div>
			{uploadType !== 'collection' && uploadType !== 'yoyo' && (
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
		</div>
	);
}

export default PictureUploader;
