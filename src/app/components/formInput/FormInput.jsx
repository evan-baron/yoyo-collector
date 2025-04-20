'use client';

// Libraries
import React, { useRef, useEffect } from 'react';

// Styles
import styles from './formInput.module.scss';

// MUI
import { Edit, Check, Close, Undo } from '@mui/icons-material';

// Context
import { useAppContext } from '@/app/context/AppContext';

function FormInput({
	type,
	name,
	value,
	currentlyEditing,
	setCurrentlyEditing,
	handleChange,
	originalLocation,
}) {
	const { setModalOpen, setModalType, user } = useAppContext();

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
			undo: user.first_name !== value,
		},
		last: {
			label: 'Last Name',
			placeholder: 'Last',
			maxLength: '20',
			undo: user.last_name !== value,
		},
		handle: {
			label: 'Handle',
			placeholder: 'Nickname',
			maxLength: '16',
			undo: user[name] !== value,
		},
		yoyo: {
			label: 'Favorite Yoyo',
			placeholder: 'Duncan Imperial',
			maxLength: '30',
			undo: user.favorite_yoyo !== value,
		},
		brand: {
			label: 'Favorite Brand',
			placeholder: 'Duncan',
			maxLength: '30',
			undo: user.favorite_brand !== value,
		},
		location: {
			label: 'Location',
			placeholder: 'Earth',
			maxLength: '',
			undo: originalLocation !== value,
		},
	};

	const defaultField = {
		label: '',
		placeholder: '',
		maxLength: '12',
	};

	const { label, placeholder, maxLength, undo } =
		fieldConfig[name] || defaultField;

	const handleKeyDown = (e) => {
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
					<div className={styles.icons}>
						<Check
							sx={{ fontSize: '1.25rem', cursor: 'pointer' }}
							onClick={() => setCurrentlyEditing(null)}
						/>
						<Close
							sx={{ fontSize: '1.25rem', cursor: 'pointer' }}
							onClick={handleChange}
							data-name='undo'
							data-value={name}
						/>
					</div>
				</div>
			) : (
				<div className={styles['input-box']} style={{ cursor: 'pointer' }}>
					<p
						className={styles.p}
						onClick={() => {
							if (name === 'location') {
								setModalOpen(true);
								setModalType('location-picker');
							} else {
								setCurrentlyEditing(name);
							}
						}}
					>
						{value}
					</p>
					<Edit
						sx={{
							fontSize: value ? '1rem' : '1.5rem',
							alignSelf: undo ? 'center' : 'end',
						}}
						onClick={() => {
							if (name === 'location') {
								setModalOpen(true);
								setModalType('location-picker');
							} else {
								setCurrentlyEditing(name);
							}
						}}
					/>
					{undo && (
						<Undo
							sx={{
								position: 'relative',
								top: value.length ? '.25rem' : '',
								fontSize: value.length ? '1.25rem' : '1.75rem',
								cursor: 'pointer',
								height: '1rem',
								alignSelf: 'center',
							}}
							viewBox='2 6 18 18'
							onClick={handleChange}
							data-name='undo'
							data-value={name}
						/>
					)}
				</div>
			)}
		</div>
	);
}

export default FormInput;
