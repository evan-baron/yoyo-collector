// Libraries
import React, { useState } from 'react';

// Styles
import styles from './formInput.module.scss';

// MUI
import { Edit, Check } from '@mui/icons-material';

function FormInput({ type, name, value, handleChange }) {
	const [editing, setEditing] = useState(false);

	const placeholder = (name) => {
		switch (name) {
			case 'first':
				return 'First';
			case 'last':
				return 'Last';
			case 'handle':
				return 'Nickname';
			case 'yoyo':
				return 'Duncan Imperial';
			case 'brand':
				return 'Duncan';
			case 'Location':
				return 'Earth';
			default:
				return '';
		}
	};

	const label = (name) => {
		switch (name) {
			case 'first':
				return 'First Name';
			case 'last':
				return 'Last Name';
			case 'handle':
				return 'Handle';
			case 'yoyo':
				return 'Favorite Yoyo';
			case 'brand':
				return 'Favorite Brand';
			case 'location':
				return 'Location';
			default:
				return '';
		}
	};

	return (
		<div className={styles.item}>
			<label htmlFor={name} className={styles.label}>
				{label(name)}
			</label>
			{editing ? (
				<div className={styles['input-box']}>
					<input
						type={type}
						id={name}
						name={name}
						placeholder={placeholder(name)}
						className={styles.input}
						value={value || ''}
						onChange={handleChange}
					/>
					<Check
						sx={{ fontSize: '1.75rem', cursor: 'pointer' }}
						onClick={() => setEditing((prev) => !prev)}
					/>
				</div>
			) : (
				<div className={styles['input-box']}>
					<p className={styles.p}>{value}</p>
					<Edit
						sx={{ fontSize: '1.5rem', cursor: 'pointer' }}
						onClick={() => {
							if (name === 'location') {
								console.log('location');
							} else {
								setEditing((prev) => !prev);
							}
						}}
					/>
				</div>
			)}
		</div>
	);
}

export default FormInput;
