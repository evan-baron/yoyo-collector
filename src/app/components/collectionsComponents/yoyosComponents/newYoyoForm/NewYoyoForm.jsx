'use client';

// Libraries
import React, { useState } from 'react';

// Styles
import styles from './newYoyoForm.module.scss';

// Components
import ManufacturerDropdown from './manufacturerDropdown/ManufacturerDropdown';
import YearDropdown from './yearDropdown/YearDropdown';
import ResponseDropdown from './responseDropdown/ResponseDropdown';

function NewYoyoForm() {
	const [addYoyo, setAddYoyo] = useState(null);
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

	const handleDropdownChange = (e) => {
		const { value = '', name = 'manufacturer' } = e || {};
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
			<div className={styles.add} onClick={() => setAddYoyo((prev) => !prev)}>
				Add Yoyo
			</div>
			{addYoyo && (
				<form className={styles.form} onSubmit={handleSubmit}>
					<div className={styles['input-box']}>
						<label htmlFor='model' className={styles.label}>
							Model name:
						</label>
						<input
							id='model'
							name='model'
							type='text'
							className={styles.input}
						/>
					</div>
					<div className={styles['input-box']}>
						<label htmlFor='manufacturer' className={styles.label}>
							Manufacturer:
						</label>
						<ManufacturerDropdown
							value={yoyoFormData.manufacturer}
							handleChange={handleDropdownChange}
						/>
					</div>
					<div className={styles['input-box']}>
						<label htmlFor='color' className={styles.label}>
							Colorway:
						</label>
						<input
							id='color'
							name='color'
							type='text'
							className={styles.input}
						/>
					</div>
					<div className={styles['input-box']}>
						<label htmlFor='originalOwner' className={styles.label}>
							Original owner:
						</label>
						<input
							id='originalOwner'
							name='originalOwner'
							type='text'
							className={styles.input}
						/>
					</div>
					<div className={styles['input-box']}>
						<label htmlFor='year' className={styles.label}>
							Release date (year):
						</label>
						<YearDropdown
							value={yoyoFormData.year}
							handleChange={handleDropdownChange}
							name='year'
						/>
					</div>
					<div className={styles['input-box']}>
						<label htmlFor='purchased' className={styles.label}>
							Purchase date (year):
						</label>
						<YearDropdown
							value={yoyoFormData.purchased}
							handleChange={handleDropdownChange}
							name='purchased'
						/>
					</div>
					<div className={styles['input-box']}>
						<label htmlFor='price' className={styles.label}>
							Purchase price (private):
						</label>
						<input
							id='price'
							name='price'
							type='text'
							className={styles.input}
						/>
					</div>
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
							Response type:
						</label>
						<ResponseDropdown
							value={yoyoFormData.response}
							handleChange={handleDropdownChange}
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
				</form>
			)}
		</div>
	);
}

export default NewYoyoForm;
