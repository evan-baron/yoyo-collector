'use client';

// Libraries
import React, { useState } from 'react';

// Styles
import styles from './newYoyoForm.module.scss';

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
		colorway: '',
		year: '',
		originalOwner: '',
		purchased: '',
		price: '',
		material: '',
		response: '',
		condition: '',
	});

	const handleDropdownChange = (e, meta) => {
		const { name } = meta;
		const value = e ? e.value : '';
		console.log(value, name);

		setYoyoFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		console.log('test');
	};

	return (
		<div className={styles['form-container']}>
			<form className={styles.form} onSubmit={handleSubmit}>
				<div
					className={`${styles.add} ${addYoyo && styles['add-selected']}`}
					onClick={() => setAddYoyo((prev) => !prev)}
					style={{
						borderRadius: !addYoyo && '.5rem',
					}}
				>
					Add Yoyo
				</div>
				{addYoyo && (
					<>
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
							</div>
						</div>
						<div
							className={`${styles.add} ${more && styles['more-selected']} ${
								styles.more
							}`}
							onClick={() => setMore((prev) => !prev)}
						>
							{more ? 'Less' : 'More'} Details
						</div>

						{more && (
							<div className={styles.details}>
								<div className={styles.left}>
									<div className={styles['input-box']}>
										<label htmlFor='material' className={styles.label}>
											Material:
										</label>
										<input
											id='material'
											name='material'
											type='text'
											className={styles.input}
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
									{' '}
									<div className={styles['input-box']}>
										<label htmlFor='originalOwner' className={styles.label}>
											Original Owner?
										</label>
										<input
											id='originalOwner'
											name='originalOwner'
											type='text'
											className={styles.input}
										/>
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
										/>
									</div>
									<div className={styles['input-box']}>
										<label htmlFor='condition' className={styles.label}>
											Condition:
										</label>
										<input
											id='condition'
											name='condition'
											type='text'
											className={styles.input}
										/>
									</div>
								</div>
							</div>
						)}
					</>
				)}
			</form>
		</div>
	);
}

export default NewYoyoForm;
