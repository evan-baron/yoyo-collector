// Libraries
import React, { useState } from 'react';

// Styles
import styles from './formInput.module.scss';

// MUI
import { Edit, Check } from '@mui/icons-material';

function FormInput({ type, name, value, handleChange }) {
	const [editing, setEditing] = useState(false);

	// setSelected((prev) =>
	// 	Object.fromEntries(
	// 		Object.entries(prev).map(([key, val]) => [
	// 			key,
	// 			{ ...val, selected: key.toLowerCase() === name },
	// 		])
	// 	)
	// );

	const fieldConfig = {
		first: {
			label: 'First Name',
			placeholder: 'First',
			maxLength: '20',
		},
		last: {
			label: 'Last Name',
			placeholder: 'Last',
			maxLength: '20',
		},
		handle: {
			label: 'Handle',
			placeholder: 'Nickname',
			maxLength: '16',
		},
		yoyo: {
			label: 'Favorite Yoyo',
			placeholder: 'Duncan Imperial',
			maxLength: '30',
		},
		brand: {
			label: 'Favorite Brand',
			placeholder: 'Duncan',
			maxLength: '30',
		},
		location: {
			label: 'Location',
			placeholder: 'Earth',
			maxLength: '',
		},
	};

	const defaultField = {
		label: '',
		placeholder: '',
		maxLength: '12',
	};

	const { label, placeholder, maxLength } = fieldConfig[name] || defaultField;

	return (
		<div className={styles.item}>
			<label htmlFor={name} className={styles.label}>
				{label}:
			</label>
			{editing ? (
				<div className={styles['input-box']}>
					<input
						type={type}
						id={name}
						name={name}
						placeholder={placeholder}
						className={styles.input}
						value={value || ''}
						onChange={handleChange}
						maxLength={maxLength}
						autoComplete='off'
					/>
					<Check
						sx={{ fontSize: '1.75rem', cursor: 'pointer' }}
						onClick={() => setEditing((prev) => !prev)}
					/>
				</div>
			) : (
				<div
					className={styles['input-box']}
					onClick={() => {
						if (name === 'location') {
							console.log('location');
						} else {
							setEditing((prev) => !prev);
						}
					}}
					style={{ cursor: 'pointer' }}
				>
					<p className={styles.p}>{value}</p>
					<Edit
						sx={{
							fontSize: value ? '1rem' : '1.5rem',
							alignSelf: 'end',
						}}
					/>
				</div>
			)}
		</div>
	);
}

export default FormInput;
