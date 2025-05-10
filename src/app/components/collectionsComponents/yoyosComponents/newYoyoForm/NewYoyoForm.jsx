'use client';

// Libraries
import React, { useState, useEffect } from 'react';

// Utils
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

// Context
import { useAppContext } from '@/app/context/AppContext';

function NewYoyoForm({ yoyoData, setYoyoData }) {
	const { imagesToUpload, setImagesToUpload, setNewCollectionCounter } =
		useAppContext();

	const [more, setMore] = useState(null);
	const [animate, setAnimate] = useState(false);

	useEffect(() => {
		let timeout;
		if (!animate && more) {
			timeout = setTimeout(() => {
				setMore(false);
			}, 700);
		}
		return () => clearTimeout(timeout);
	}, [animate]);

	const handleDropdownChange = (e, meta) => {
		const { name } = meta;
		const value = e ? e.value : '';

		setYoyoData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setYoyoData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleCancel = () => {
		setYoyoData({
			...yoyoData,
			model: '',
			manufacturer: '',
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
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { name } = e.target.dataset;

		try {
			await axiosInstance.post('/api/user/yoyos', yoyoData);
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
				manufacturer: '',
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
			}

			setNewCollectionCounter((prev) => prev + 1);
		}
	};

	return (
		<>
			<div
				className={styles['form-container']}
				// style={{
				// 	maxHeight: maxHeight,
				// 	overflow: 'hidden',
				// 	transition: '.5s',
				// }}
			>
				<div className={styles.add}>Add Yoyo</div>
				<form
					className={styles.form}
					// style={{
					// 	maxHeight: maxHeight,
					// 	overflow: 'hidden',
					// 	transition: '.5s',
					// 	borderTopLeftRadius: '.5rem',
					// 	borderTopRightRadius: '.5rem',
					// 	borderBottomLeftRadius: addYoyo ? '0' : '.5rem',
					// 	borderBottomRightRadius: addYoyo ? '0' : '.5rem',
					// }}
				>
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
										/>
									</div>
									<div className={styles['photo-input']}>
										<label htmlFor='yoyoInput' className={styles.label}>
											Add Photos
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
												<label htmlFor='responseType' className={styles.label}>
													Response Type:
												</label>
												<ResponseDropdown
													value={yoyoData.responseType}
													handleChange={handleDropdownChange}
													name='responseType'
													disabled={!more}
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
			</div>

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
