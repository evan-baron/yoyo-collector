'use client';

// Libraries
import React, { useState, useEffect, useRef } from 'react';

// Utils
import axios from 'axios';
import axiosInstance from '@/lib/utils/axios';

// Styles
import styles from './pictureUploader.module.scss';

// MUI
import {
	FileUpload,
	Undo,
	ArrowBackIosNew,
	ArrowForwardIos,
	Close,
} from '@mui/icons-material';

// Context
import { useAppContext } from '@/app/context/AppContext';

// Components
import BlankProfilePhoto from '../blankProfilePhoto/BlankProfilePhoto';
import BlankCoverPhoto from '../blankCoverPhoto/BlankCoverPhoto';
import BlankYoyoPhoto from '../blankYoyoPhoto/BlankYoyoPhoto';

function PictureUploader({
	input,
	uploadType,
	defaultUrl,
	setCoverPhoto,
	editing,
	setUploadError,
	newYoyoForm,
	photosLength,
}) {
	// Context
	const {
		previewUrls,
		setPreviewUrls,
		clearInputRef,
		setClearInputRef,
		formImagesToUpload,
		setFormImagesToUpload,
		imagesToUpload,
		setImagesToUpload,
		loading,
		setLoading,
		setLoadingMessage,
		user,
		setUser,
		setNewCollectionCounter,
		selectedYoyo,
		viewingCollectionId,
	} = useAppContext();

	const MAX_FILES = 10;
	const MAX_FILE_SIZE = 4 * 1024 * 1024;

	// State to hold the uploaded image URL
	const [previewUrl, setPreviewUrl] = useState();
	const [previewIndex, setPreviewIndex] = useState(0);
	const [hover, setHover] = useState(false);
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

	useEffect(() => {
		if (clearInputRef) {
			fileInputRef.current.value = '';
			setClearInputRef(false);
		}
	}, [clearInputRef]);

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

		console.log(newYoyoForm);

		const files = Array.from(e.target.files);

		if (!files.length) return;

		if (
			uploadType !== 'profile' &&
			uploadType !== 'cover' &&
			files.length > MAX_FILES
		) {
			if (uploadType !== 'yoyo') {
				setError(`You may only upload up to ${MAX_FILES} files at a time.`);
				return;
			}
			setUploadError(`You may only upload up to ${MAX_FILES} files at a time.`);
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
			setImagesToUpload(file);
			setPreviewUrl(URL.createObjectURL(file));

			return;
		} else if (uploadType === 'yoyo' && newYoyoForm) {
			if (!validFiles.length && files.length === 1) {
				setUploadError('File must not exceed 4MB');
				return;
			} else if (!validFiles.length) {
				setUploadError('All selected files were too large (max: 4MB).');
				return;
			} else if (validFiles.length !== files.length) {
				setUploadError('Some files were larger than 4MB and were skipped.');
			}

			if ((previewUrls?.length || 0) + validFiles.length > 10) {
				setUploadError('A maximum of 10 images is allowed per yoyo');
				return;
			}

			setFormImagesToUpload((prev) => [...(prev || []), ...validFiles]);
			setPreviewUrls((prev) => [...(prev || []), ...validFiles]);
			setClearInputRef(true);
			return;
		} else {
			if (uploadType === 'yoyo') {
				if (!validFiles.length && files.length === 1) {
					setUploadError('File must not exceed 4MB');
					return;
				} else if (!validFiles.length) {
					setUploadError('All selected files were too large (max: 4MB).');
					return;
				} else if (validFiles.length !== files.length) {
					setUploadError('Some files were larger than 4MB and were skipped.');
				}

				if (validFiles.length > 10 || photosLength + validFiles.length > 10) {
					setUploadError(
						`A maximum of 10 images is allowed per yoyo. You may upload ${
							10 - photosLength
						} ${10 - photosLength === 1 ? 'photo' : 'photos'} to this yoyo.`
					);
					return;
				}
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
			}

			try {
				setLoading(true);
				setLoadingMessage('Uploading');

				const preset = getPreset(uploadType);

				const uploadPromises = validFiles.map(async (file) => {
					const formData = new FormData();
					formData.append('file', file);
					formData.append('upload_preset', preset);

					const { data } = await axios.post(
						'https://api.cloudinary.com/v1_1/ddbotvjio/image/upload',
						formData
					);

					const uploadData = {
						...data,
						category: uploadType,
						uploadAction: 'new',
						collectionId: viewingCollectionId,
						yoyoId: selectedYoyo,
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
				setImagesToUpload([]);
				setUpdatingPicture(false);
				setClearInputRef(true);
			}
			return;
		}
	};

	// Handle save
	const handleSave = async () => {
		if (!imagesToUpload) return;

		if (imagesToUpload.size > MAX_FILE_SIZE) {
			setError('File must not exceed 4mb');
			return;
		}

		const formData = new FormData();

		const preset = getPreset(uploadType);

		formData.append('file', imagesToUpload);
		formData.append('upload_preset', preset);

		setLoading(true);
		setLoadingMessage('Saving');
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
				uploadData.collectionId = viewingCollectionId;

				const response = await axiosInstance.post(
					'/api/user/collectionPictures',
					uploadData
				);

				const { coverPhoto } = response.data;
				setPicture(coverPhoto.secure_url);
				setCoverPhoto(coverPhoto.secure_url);
			} else if (uploadType === 'collection' || uploadType === 'yoyo') {
				uploadData.collectionId = viewingCollectionId;

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
			setImagesToUpload([]);
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
						collection: viewingCollectionId,
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
			<div
				className={`${styles['picture-container']} ${
					previewUrls?.length > 1 && styles['yoyo-upload']
				}`}
			>
				{previewUrls?.length > 0 ? (
					<div className={styles.preview}>
						<div className={styles['yoyo-upload']}>
							{previewUrls?.length > 1 && (
								<div
									className={styles.arrow}
									onClick={() => {
										if (previewIndex === 0) {
											setPreviewIndex(previewUrls.length - 1);
										} else {
											setPreviewIndex((prev) => prev - 1);
										}
										return;
									}}
								>
									<ArrowBackIosNew className={styles.icon} />
								</div>
							)}
							<input
								name={input}
								id={input}
								type='file'
								multiple={uploadType !== 'profile' && uploadType !== 'cover'}
								ref={fileInputRef}
								accept='image/*'
								onChange={handleUpload}
								disabled={
									loading || previewUrls?.length > 9 || photosLength > 9
								}
								className={styles.input}
							/>
							<img
								src={URL.createObjectURL(previewUrls[previewIndex])}
								alt='Preview profile picture'
								className={styles.image}
								onMouseOver={() => setHover(true)}
								onMouseOut={() => setHover(false)}
							/>
							<div
								className={`${styles.close} ${hover && styles.hover}`}
								onClick={() => {
									setFormImagesToUpload(
										formImagesToUpload?.filter(
											(_, index) => index !== previewIndex
										)
									);
									setPreviewUrls(
										previewUrls.filter((_, index) => index !== previewIndex)
									);
									setPreviewIndex(0);
								}}
							>
								<Close className={styles['close-icon']} />
							</div>
							{previewUrls?.length > 1 && (
								<div
									className={styles.arrow}
									onClick={() => {
										if (previewIndex === previewUrls.length - 1) {
											setPreviewIndex(0);
										} else {
											setPreviewIndex((prev) => prev + 1);
										}
										return;
									}}
								>
									<ArrowForwardIos className={styles.icon} />
								</div>
							)}
						</div>
						{previewUrls?.length > 1 && (
							<div className={styles['preview-counter']}>
								{previewIndex + 1}/{previewUrls?.length}
							</div>
						)}
					</div>
				) : (
					<label
						htmlFor={input}
						className={`
						${styles.placeholder} 
						${
							uploadType === 'profile'
								? styles.circle
								: newYoyoForm
								? styles['small-square']
								: styles.square
						} 
						${editing && !picture && styles.glowing} 
						${uploadType === 'collection' && styles.collection}
					`}
						style={{
							boxShadow: uploadType === 'cover' && '0.25rem 0.25rem 1rem black',
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
							disabled={loading || previewUrls?.length > 9 || photosLength > 9}
							className={`${styles.input} ${
								uploadType === 'profile'
									? styles.circle
									: newYoyoForm
									? styles['small-square']
									: styles.square
							}`}
						/>
						{uploadType !== 'collection' && uploadType !== 'yoyo' && (
							<div
								className={`${styles.options} ${
									uploadType === 'profile'
										? styles.circle
										: newYoyoForm
										? styles['small-square']
										: styles.square
								}`}
							>
								<div
									className={`${styles.update} ${
										uploadType === 'profile'
											? styles.circle
											: newYoyoForm
											? styles['small-square']
											: styles.square
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
									uploadType === 'profile'
										? styles.circle
										: newYoyoForm
										? styles['small-square']
										: styles.square
								}`}
							/>
						) : picture && !updatingPicture ? (
							<img
								src={picture}
								alt='Current profile picture'
								className={`${styles.image} ${
									uploadType === 'profile'
										? styles.circle
										: newYoyoForm
										? styles['small-square']
										: styles.square
								}`}
							/>
						) : uploadType === 'profile' ? (
							<BlankProfilePhoto />
						) : uploadType === 'cover' ? (
							<BlankCoverPhoto />
						) : uploadType === 'yoyo' ? (
							<BlankYoyoPhoto />
						) : (
							<div className={styles.new}></div>
						)}
					</label>
				)}
				{remove && (
					<div
						className={`${styles['remove-container']} ${
							uploadType === 'profile'
								? styles.circle
								: newYoyoForm
								? styles['small-square']
								: styles.square
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
				{error && uploadType !== 'yoyo' && (
					<div className={styles['remove-container']}>
						<div className={styles.remove}>
							<p className={styles.error}>{error}</p>
							<div className={styles.buttons}>
								<button
									className={styles['delete-button']}
									onClick={() => {
										setError(null);
										if (uploadType === 'profile' || uploadType === 'cover') {
											setImagesToUpload([]);
											if (fileInputRef.current) {
												fileInputRef.current.value = '';
											}
										}
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
								setImagesToUpload([]);
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
