'use client';

// Libraries
import React, { useState, useEffect } from 'react';

// Utils
import axios from 'axios';
import axiosInstance from '@/lib/utils/axios';

// Styles
import styles from './newYoyoForm.module.scss';

// MUI
import { North } from '@mui/icons-material';

// Components
import ManufacturerDropdown from './manufacturerDropdown/ManufacturerDropdown';
import YearDropdown from './yearDropdown/YearDropdown';
import ResponseDropdown from './responseDropdown/ResponseDropdown';
import BearingDropdown from './bearingDropdown/bearingDropdown';
import PictureUploader from '@/app/components/pictureUploader/PictureUploader';

// Context
import { useAppContext } from '@/app/context/AppContext';

function NewYoyoForm({
	collectionId,
	yoyoData,
	setYoyoData,
	setAddYoyo,
	added,
	setAdded,
	uploadError,
	setUploadError,
}) {
	const {
		formImagesToUpload,
		setFormImagesToUpload,
		setNewCollectionCounter,
		clearInputRef,
		setClearInputRef,
		setPreviewUrls,
	} = useAppContext();

	const [more, setMore] = useState(null);
	const [animate, setAnimate] = useState(false);
	const [error, setError] = useState({
		model: {
			valid: true,
			message: '',
		},
		brand: {
			valid: true,
			message: '',
		},
		color: {
			valid: true,
			message: '',
		},
		category: {
			valid: true,
			message: '',
		},
		price: {
			valid: true,
			message: '',
		},
		value: {
			valid: true,
			message: '',
		},
		condition: {
			valid: true,
			message: '',
		},
	});
	const [hidden, setHidden] = useState('hidden');

	useEffect(() => {
		let timeout;
		if (!animate && more) {
			timeout = setTimeout(() => {
				setMore(false);
			}, 700);
		}
		return () => clearTimeout(timeout);
	}, [animate]);

	useEffect(() => {
		let timeout;
		if (animate && more) {
			timeout = setTimeout(() => {
				setHidden('');
			}, 700);
		} else {
			setHidden('hidden');
		}
		return () => clearTimeout(timeout);
	}, [animate]);

	// Validation
	//Constants
	const noSpecials = [
		'model',
		'brand',
		'bearing',
		'responseType',
		'color',
		'category',
	];
	const onlyNums = ['year', 'purchased'];
	const specialsAllowed = ['value', 'price', 'condition'];

	const getInvalidChars = (name, input) => {
		const noSpecialsTest = /[^a-zA-Z0-9 \-./!']/g;
		const specialsTest = /[^a-zA-Z0-9 '$%^&*()\-\+\/!@,.?:\";#]/g;
		if (noSpecials.includes(name)) {
			const matches = input.match(noSpecialsTest);
			return matches ? matches.join('') : '';
		}
		if (specialsAllowed.includes(name)) {
			const matches = input.match(specialsTest);
			return matches ? matches.join('') : '';
		}
	};

	const handleDropdownChange = (e, meta) => {
		const { name } = meta;
		const value = e ? e.value : '';

		error &&
			setError((prev) => ({
				...prev,
				[name]: {
					valid: true,
					message: '',
				},
			}));

		const invalidChars = getInvalidChars(name, value);

		if (invalidChars) {
			setError((prev) => ({
				...prev,
				[name]: {
					valid: false,
					message: `Invalid characters used: ${invalidChars}`,
				},
			}));
		} else {
			setError((prev) => ({
				...prev,
				[name]: {
					valid: true,
					message: '',
				},
			})); // Clear any previous error
		}

		setYoyoData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleChange = (e) => {
		const { name, value } = e.target;

		error &&
			setError((prev) => ({
				...prev,
				[name]: {
					valid: true,
					message: '',
				},
			}));

		const invalidChars = getInvalidChars(name, value);

		if (invalidChars) {
			setError((prev) => ({
				...prev,
				[name]: {
					valid: false,
					message: `Invalid characters used: ${invalidChars}`,
				},
			}));
		} else {
			setError((prev) => ({
				...prev,
				[name]: {
					valid: true,
					message: '',
				},
			})); // Clear any previous error
		}

		setYoyoData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleCancel = () => {
		setYoyoData({
			...yoyoData,
			model: '',
			bearing: '',
			value: '',
			brand: '',
			color: '',
			year: '',
			originalOwner: '',
			purchased: '',
			price: '',
			category: '',
			responseType: '',
			condition: '',
		});
		more && setMore(false);
		setAddYoyo(false);
		setFormImagesToUpload(null);
		setClearInputRef(true);
	};

	const noSpecialsTest = (param) => /^[a-zA-Z0-9 \-./!']+$/.test(param);
	const numsTest = (param) => /^[0-9]+$/.test(param);
	const specialsTest = (param) =>
		/^[a-zA-Z0-9 '$%^&*()\-\+\/!@,.?:\";#]+$/.test(param);

	const validateField = (name, value) => {
		if (value === null || value === '') {
			return true;
		}

		if (name === 'collectionId' || name === 'originalOwner') {
			return true;
		}

		if (noSpecials.includes(name)) {
			return noSpecialsTest(value);
		}

		if (onlyNums.includes(name)) {
			return numsTest(value);
		}

		if (specialsAllowed.includes(name)) {
			return specialsTest(value);
		}
	};

	const trimAndValidate = (formData) => {
		const trimmedData = Object.fromEntries(
			Object.entries(formData).map(([key, value]) => {
				const trimmed = typeof value === 'string' ? value.trim() : value;
				return [key, trimmed === '' ? null : trimmed];
			})
		);

		const values = Object.entries(trimmedData);

		const failed = values.filter(([key, val]) => !validateField(key, val));

		return { trimmedData, failed };
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { name } = e.target.dataset;

		// Validate data
		const { trimmedData } = trimAndValidate(yoyoData);

		if (!trimmedData.model) {
			trimmedData.model = 'Unknown';
		}

		if (!trimmedData.brand) {
			trimmedData.brand = 'Unknown';
		}

		try {
			if (formImagesToUpload?.length > 0) {
				const imagesToUpload = await Promise.all(
					formImagesToUpload.map(async (file) => {
						const formData = new FormData();
						formData.append('file', file);
						formData.append(
							'upload_preset',
							process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_YOYO
						);

						const { data } = await axios.post(
							'https://api.cloudinary.com/v1_1/ddbotvjio/image/upload',
							formData
						);

						data.category = 'yoyo';
						data.uploadAction = 'new';

						return data;
					})
				);

				await axiosInstance.post('/api/user/yoyos', {
					yoyoData: trimmedData,
					yoyoPhotos: imagesToUpload,
				});
			} else {
				await axiosInstance.post('/api/user/yoyos', { yoyoData: trimmedData });
			}
		} catch (error) {
			console.error(
				'There was an error saving the yoyo at NewYoyoForm.jsx',
				error
			);
			return;
		} finally {
			setYoyoData({
				...yoyoData,
				model: '',
				bearing: '',
				value: '',
				brand: '',
				color: '',
				year: '',
				originalOwner: '',
				purchased: '',
				price: '',
				category: '',
				responseType: '',
				condition: '',
			});

			if (name === 'save') {
				more && setMore(false);
				animate && setAnimate(false);
				setHidden('hidden');
				setAddYoyo(false);
			}

			setNewCollectionCounter((prev) => prev + 1);
			setFormImagesToUpload([]);
			setPreviewUrls([]);
			setClearInputRef(true);
		}
	};

	return (
		<>
			<section className={styles['add-yoyo-form']}>
				<div className={styles['picture-box']}>
					<div
						className={`${styles['image-box']} ${
							formImagesToUpload?.length > 1 && styles['multi-yoyo']
						}`}
					>
						<PictureUploader
							collection={collectionId}
							key='addYoyoFormYoyoInput'
							uploadType='yoyo'
							input='addYoyoFormYoyoInput'
							setAdded={setAdded}
							setUploadError={setUploadError}
							newYoyoForm={true}
						/>
					</div>
				</div>
				<div className={styles['form-container']}>
					<div className={styles.add}>Add Yoyo</div>
					<form className={styles.form}>
						<div className={styles.content}>
							<div className={styles.top}>
								<div className={styles.details}>
									<div className={styles.left}>
										<div className={styles['input-box']}>
											<label htmlFor='model' className={styles.label}>
												Model:
											</label>
											<input
												id='model'
												name='model'
												type='text'
												className={styles.input}
												onChange={handleChange}
												value={yoyoData.model}
												maxLength={50}
											/>
											{!error.model.valid && (
												<p className={styles.error}>{error.model.message}</p>
											)}
										</div>
										<div className={styles['input-box']}>
											<label htmlFor='color' className={styles.label}>
												Color/Colorway Name:
											</label>
											<input
												id='color'
												name='color'
												type='text'
												className={styles.input}
												onChange={handleChange}
												value={yoyoData.color}
												maxLength={50}
											/>
											{!error.color.valid && (
												<p className={styles.error}>{error.color.message}</p>
											)}
										</div>
									</div>
									<div className={styles.right}>
										<div className={styles['input-box']}>
											<label htmlFor='brand' className={styles.label}>
												Brand:
											</label>
											<ManufacturerDropdown
												value={yoyoData.brand}
												handleChange={handleDropdownChange}
												name='brand'
												type='yoyoForm'
											/>
											{!error.brand.valid && (
												<p className={styles.error}>{error.brand.message}</p>
											)}
										</div>
										<div className={styles['photo-input']}>
											<label
												htmlFor='addYoyoFormYoyoInput'
												className={styles.label}
												disabled={formImagesToUpload?.length > 9}
											>
												Add {formImagesToUpload?.length > 0 ? 'More' : ''}{' '}
												Photos
											</label>
										</div>
									</div>
								</div>
							</div>
							{more && (
								<>
									<div
										className={`${styles.bottom} ${
											animate ? styles.active : styles.inactive
										}`}
										style={{ overflow: hidden }}
									>
										<div className={styles.details}>
											<div className={styles.left}>
												<div className={styles['input-box']}>
													<label htmlFor='category' className={styles.label}>
														Category (fixed, bimetal, etc.):
													</label>
													<input
														id='category'
														name='category'
														type='text'
														className={styles.input}
														onChange={handleChange}
														value={yoyoData.category}
														maxLength={60}
														disabled={!more}
													/>
												</div>
												<div className={styles['input-box']}>
													<label
														htmlFor='responseType'
														className={styles.label}
													>
														Response Type:
													</label>
													<ResponseDropdown
														value={yoyoData.responseType}
														handleChange={handleDropdownChange}
														name='responseType'
														disabled={!more}
														type='yoyoForm'
													/>
												</div>
												<div className={styles['input-box']}>
													<label htmlFor='bearing' className={styles.label}>
														Bearing Type:
													</label>
													<BearingDropdown
														value={yoyoData.bearing}
														handleChange={handleDropdownChange}
														name='bearing'
														disabled={!more}
														type='yoyoForm'
													/>
												</div>
												<div className={styles['input-box']}>
													<label htmlFor='year' className={styles.label}>
														Release Date (year):
													</label>
													<YearDropdown
														value={yoyoData.year}
														handleChange={handleDropdownChange}
														name='year'
														disabled={!more}
														type='yoyoForm'
													/>
												</div>
											</div>

											<div className={styles.right}>
												<div className={styles['input-box']}>
													<div className={styles['radio-label']}>
														Original Owner?
													</div>
													<div className={styles.options}>
														<div className={styles.option}>
															<input
																id='originalOwnerYes'
																name='originalOwner'
																type='radio'
																className={styles.radio}
																onChange={handleChange}
																value='yes'
																checked={yoyoData.originalOwner === 'yes'}
																disabled={!more}
															/>
															<label
																htmlFor='originalOwnerYes'
																className={styles.label}
															>
																Yes
															</label>
														</div>
														<div className={styles.option}>
															<input
																id='originalOwnerNo'
																name='originalOwner'
																type='radio'
																className={styles.radio}
																onChange={handleChange}
																value='no'
																checked={yoyoData.originalOwner === 'no'}
																disabled={!more}
															/>
															<label
																htmlFor='originalOwnerNo'
																className={styles.label}
															>
																No
															</label>
														</div>
													</div>
												</div>
												<div className={styles['input-box']}>
													<label htmlFor='purchased' className={styles.label}>
														Purchase Date (year):
													</label>
													<YearDropdown
														value={yoyoData.purchased}
														handleChange={handleDropdownChange}
														name='purchased'
														disabled={!more}
														type='yoyoForm'
													/>
												</div>
												<div className={styles['input-box']}>
													<label htmlFor='price' className={styles.label}>
														Purchase Price (private):
													</label>
													<input
														id='price'
														name='price'
														type='text'
														className={styles.input}
														onChange={handleChange}
														value={yoyoData.price}
														maxLength={100}
														disabled={!more}
													/>
													{!error.price.valid && (
														<p className={styles.error}>
															{error.price.message}
														</p>
													)}
												</div>
												<div className={styles['input-box']}>
													<label htmlFor='value' className={styles.label}>
														Approximate Value:
													</label>
													<input
														id='value'
														name='value'
														type='text'
														className={styles.input}
														onChange={handleChange}
														value={yoyoData.value}
														maxLength={20}
														disabled={!more}
													/>
													{!error.value.valid && (
														<p className={styles.error}>
															{error.value.message}
														</p>
													)}
												</div>
											</div>
										</div>
										<div className={styles['input-box']}>
											<label htmlFor='condition' className={styles.label}>
												Condition/Additional Notes:
											</label>
											<textarea
												className={styles.textarea}
												name='condition'
												id='condition'
												maxLength={300}
												rows='3'
												placeholder="This yoyo is worth at least a thousand bucks, Janice. Don't let anyone convince you otherwise. If I pass on and I see the kids sell it for anything less..."
												value={yoyoData.condition}
												onChange={handleChange}
												disabled={!more}
											/>
											{!error.condition.valid && (
												<p className={styles.error}>
													{error.condition.message}
												</p>
											)}
										</div>
									</div>
								</>
							)}
						</div>
					</form>

					<div
						className={styles.more}
						onClick={() => {
							if (!more) {
								setMore(true);
								setAnimate(true);
							} else {
								setAnimate(false);
							}
						}}
					>
						<North
							className={styles.icon}
							style={{
								transform: !more && 'rotate(180deg)',
							}}
						/>
						{more ? 'Less' : 'More'} Details
						<North
							className={styles.icon}
							style={{
								transform: !more && 'rotate(180deg)',
							}}
						/>
					</div>

					{uploadError && (
						<div className={styles['remove-container']}>
							<div className={styles.remove}>
								<p className={styles.error}>{uploadError}</p>
								<div className={styles.buttons}>
									<button
										className={styles['delete-button']}
										onClick={() => {
											setUploadError(null);
											if (
												uploadError !==
												'Some files were larger than 4MB and were skipped.'
											) {
												setFormImagesToUpload(null);
												setClearInputRef(true);
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
			</section>
			<div className={styles.buttons}>
				<div data-name='save' className={styles.button} onClick={handleSubmit}>
					Save
				</div>
				<div
					data-name='save-and-new'
					className={styles.button}
					onClick={handleSubmit}
				>
					Save & Add New
				</div>
				<div className={styles.button} onClick={handleCancel}>
					Cancel
				</div>
			</div>
		</>
	);
}

export default NewYoyoForm;
