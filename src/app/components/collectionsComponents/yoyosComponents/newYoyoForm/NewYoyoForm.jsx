'use client';

// Libraries
import React, { useState, useEffect } from 'react';

// Styles
import styles from './newYoyoForm.module.scss';

// MUI
import { North } from '@mui/icons-material';

// Components
import ManufacturerDropdown from './manufacturerDropdown/ManufacturerDropdown';
import YearDropdown from './yearDropdown/YearDropdown';
import ResponseDropdown from './responseDropdown/ResponseDropdown';
import BearingDropdown from './bearingDropdown/bearingDropdown';

function NewYoyoForm() {
	const [addYoyo, setAddYoyo] = useState(null);
	const [more, setMore] = useState(null);
	const [yoyoFormData, setYoyoFormData] = useState({
		model: '',
		manufacturer: '',
		color: '',
		year: '',
		originalOwner: '',
		purchased: '',
		price: '',
		category: '',
		response: '',
		condition: '',
		value: '',
	});
	const [maxHeight, setMaxHeight] = useState('2.5rem');

	useEffect(() => {
		if (addYoyo && !more) {
			setMaxHeight('15.25rem'); // ADJUST THIS FOR MOBILE RESPONSIVENESS LATER
		} else if (addYoyo && more) {
			setMaxHeight('41.25rem'); // ADJUST THIS FOR MOBILE RESPONSIVENESS LATER
		} else setMaxHeight('2.5rem'); // ADJUST THIS FOR MOBILE RESPONSIVENESS LATER
	}, [addYoyo, more]);

	const handleDropdownChange = (e, meta) => {
		const { name } = meta;
		const value = e ? e.value : '';

		setYoyoFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setYoyoFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleCancel = () => {
		setYoyoFormData({
			model: '',
			manufacturer: '',
			color: '',
			year: '',
			originalOwner: '',
			purchased: '',
			price: '',
			category: '',
			response: '',
			condition: '',
		});
		setAddYoyo(false);
		setMore(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		console.log(yoyoFormData);
	};

	return (
		<>
			<div
				className={styles['form-container']}
				style={{
					maxHeight: maxHeight,
					overflow: 'hidden',
					transition: '.5s',
				}}
			>
				<form
					className={styles.form}
					style={{
						maxHeight: maxHeight,
						overflow: 'hidden',
						transition: '.5s',
						borderTopLeftRadius: '.5rem',
						borderTopRightRadius: '.5rem',
						borderBottomLeftRadius: addYoyo ? '0' : '.5rem',
						borderBottomRightRadius: addYoyo ? '0' : '.5rem',
					}}
				>
					<div
						className={`${styles.add} ${addYoyo && styles['add-selected']}`}
						onClick={() => {
							setAddYoyo((prev) => !prev);
							more && setMore(false);
						}}
						style={{
							borderRadius: !addYoyo && '.5rem',
						}}
					>
						Add Yoyo
					</div>
					<div className={styles.content}>
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
										value={yoyoFormData.model}
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
										value={yoyoFormData.color}
									/>
								</div>
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
										value={yoyoFormData.category}
									/>
								</div>
								<div className={styles['input-box']}>
									<label htmlFor='response' className={styles.label}>
										Response Type:
									</label>
									<ResponseDropdown
										value={yoyoFormData.response}
										handleChange={handleDropdownChange}
										name='response'
									/>
								</div>
								<div className={styles['input-box']}>
									<label htmlFor='bearing' className={styles.label}>
										Bearing Type:
									</label>
									<BearingDropdown
										value={yoyoFormData.response}
										handleChange={handleDropdownChange}
										name='bearing'
									/>
								</div>
								<div className={styles['input-box']}>
									<label htmlFor='year' className={styles.label}>
										Release Date (year):
									</label>
									<YearDropdown
										value={yoyoFormData.year}
										handleChange={handleDropdownChange}
										name='year'
									/>
								</div>
							</div>
							<div className={styles.right}>
								<div className={styles['input-box']}>
									<label htmlFor='manufacturer' className={styles.label}>
										Brand:
									</label>
									<ManufacturerDropdown
										value={yoyoFormData.manufacturer}
										handleChange={handleDropdownChange}
										name='manufacturer'
									/>
								</div>
								<div className={styles['photo-input']}>
									<label htmlFor='yoyoInput' className={styles.label}>
										Add Photos
									</label>
								</div>
								<div className={styles['input-box']}>
									<div className={styles['radio-label']}>Original Owner?</div>
									<div className={styles.options}>
										<div className={styles.option}>
											<input
												id='originalOwnerYes'
												name='originalOwner'
												type='radio'
												className={styles.radio}
												onChange={handleChange}
												value='yes'
												checked={yoyoFormData.originalOwner === 'yes'}
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
												checked={yoyoFormData.originalOwner === 'no'}
											/>
											<label htmlFor='originalOwnerNo' className={styles.label}>
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
										value={yoyoFormData.purchased}
										handleChange={handleDropdownChange}
										name='purchased'
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
										value={yoyoFormData.price}
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
										value={yoyoFormData.value}
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
								value={yoyoFormData.condition}
								onChange={handleChange}
							/>
						</div>
					</div>
				</form>
				{addYoyo && (
					<div
						className={`${more && styles['more-selected']} ${styles.more}`}
						onClick={() => setMore((prev) => !prev)}
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
				)}
			</div>
			{addYoyo && (
				<div className={styles.buttons}>
					<div className={styles.button} onClick={handleSubmit}>
						Save
					</div>
					<div className={styles.button} onClick={handleSubmit}>
						Save & Add New
					</div>
					<div className={styles.button} onClick={handleCancel}>
						Cancel
					</div>
				</div>
			)}
		</>
	);
}

export default NewYoyoForm;
