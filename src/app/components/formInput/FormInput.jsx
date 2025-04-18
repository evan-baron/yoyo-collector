'use client';

// Libraries
import React, { useRef, useEffect } from 'react';

// Styles
import styles from './formInput.module.scss';

// MUI
import { Edit, Check } from '@mui/icons-material';

// Context
import { useAppContext } from '@/app/context/AppContext';

function FormInput({
	type,
	name,
	value,
	currentlyEditing,
	setCurrentlyEditing,
	handleChange,
}) {
	const { setModalOpen, setModalType } = useAppContext();

	const inputRef = useRef(null);

	const editing = currentlyEditing === name;

	useEffect(() => {
		if (editing && inputRef.current) {
			inputRef.current.focus();
		}
	}, [editing]);

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

	const handleKeyDown = (e) => {
		const { name, value } = e.target;

		if (e.key === 'Tab' || e.key === 'Enter') {
			e.preventDefault();
			setCurrentlyEditing(null);
		}
	};

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
						ref={inputRef}
						onKeyDown={handleKeyDown}
						spellCheck='off'
					/>
					<Check
						sx={{ fontSize: '1.75rem', cursor: 'pointer' }}
						onClick={() => setCurrentlyEditing(null)}
					/>
				</div>
			) : (
				<div
					className={styles['input-box']}
					onClick={() => {
						if (name === 'location') {
							setModalOpen(true);
							setModalType('location-picker');
						} else {
							setCurrentlyEditing(name);
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
