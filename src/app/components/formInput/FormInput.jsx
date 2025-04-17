// Libraries
import React from 'react';

// Styles
import styles from './formInput.module.scss';

function FormInput({ type, name, value, handleChange }) {
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
			<input
				type={type}
				id={name}
				name={name}
				placeholder={placeholder(name)}
				className={styles.input}
				value={value || ''}
				onChange={handleChange}
			/>
		</div>
	);
}

export default FormInput;
