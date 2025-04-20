'use client';

// Libraries
import React, { useState, useRef, useEffect } from 'react';

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
	errMessage,
	setErrMessage,
}) {
	const [warning, setWarning] = useState(false);

	const {
		profileSettingsFormData,
		setProfileSettingsFormData,
		setModalOpen,
		setModalType,
		user,
	} = useAppContext();

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
			if (!value.length && (name === 'first' || name === 'last')) {
				setProfileSettingsFormData({
					...profileSettingsFormData,
					[name]: user[`${name}_name`],
				});
				setWarning(true);
			}
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
							onClick={() => {
								if (!value.length && (name === 'first' || name === 'last')) {
									setProfileSettingsFormData({
										...profileSettingsFormData,
										[name]: user[`${name}_name`],
									});
									setWarning(true);
								}
								setCurrentlyEditing(null);
							}}
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
				<>
					<div className={styles['input-box']} style={{ cursor: 'pointer' }}>
						<p
							className={styles.p}
							onClick={() => {
								errMessage.length &&
									setErrMessage((prev) =>
										prev?.filter(([attribute]) => attribute !== name)
									);

								(name === 'first' || name === 'last') && setWarning(false);
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
								setErrMessage((prev) =>
									prev?.filter(([attribute]) => attribute !== name)
								);

								(name === 'first' || name === 'last') && setWarning(false);
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
									top: value.length ? '.25rem' : '.25rem',
									fontSize: value.length ? '1.25rem' : '1.75rem',
									cursor: 'pointer',
									height: value.length ? '1rem' : '1.25rem',
									alignSelf: 'center',
								}}
								viewBox='2 6 18 18'
								onClick={handleChange}
								data-name='undo'
								data-value={name}
							/>
						)}
					</div>
					<p className={styles.warning}>
						{errMessage?.find(([attr]) => attr === name)?.[1]}
					</p>
					{warning && (
						<div className={styles.warning}>
							<p
								onClick={() => setWarning(false)}
								style={{ cursor: 'pointer' }}
							>
								Your must have a {name} name.{' '}
								<span
									style={{
										color: 'var(--lightestGray)',
										border: '1px solid var(--lightestGray)',
										padding: '0 .25rem',
										borderRadius: '.25rem',
										fontSize: '.5rem',
									}}
								>
									OK
								</span>
							</p>
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default FormInput;
