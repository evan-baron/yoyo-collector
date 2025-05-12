'use client';

// Libraries
import React, { useState, useEffect, useRef } from 'react';

// Styles
import styles from './yoyoTileInput.module.scss';

// MUI
import { Edit } from '@mui/icons-material';

// Components
import ManufacturerDropdown from '../newYoyoForm/manufacturerDropdown/ManufacturerDropdown';
import ResponseDropdown from '../newYoyoForm/responseDropdown/ResponseDropdown';
import YearDropdown from '../newYoyoForm/yearDropdown/YearDropdown';
import BearingDropdown from '../newYoyoForm/bearingDropdown/bearingDropdown';

// Context
import { useAppContext } from '@/app/context/AppContext';

function YoyoTileInput({
	type,
	name,
	itemLabel,
	value,
	handleChange,
	handleDropdownChange,
	maxLength,
	error,
}) {
	const { currentlyEditing, setCurrentlyEditing } = useAppContext();

	const inputRef = useRef(null);

	const editingInput = currentlyEditing === itemLabel;

	useEffect(() => {
		if (editingInput && inputRef.current) {
			inputRef.current.focus();
		}
	}, [editingInput]);

	return (
		<div
			className={styles.attribute}
			style={{ gap: value ? '.5rem' : '.25rem' }}
		>
			<label className={styles.label} htmlFor={value}>
				{itemLabel}:
			</label>
			{value ? (
				editingInput ? (
					name === 'brand' ? (
						<ManufacturerDropdown
							value={value}
							handleChange={handleDropdownChange}
							name='brand'
						/>
					) : (
						<input
							type={type}
							id={name}
							ref={inputRef}
							name={name}
							className={styles.input}
							value={value || ''}
							onChange={handleChange}
							maxLength={maxLength}
							autoComplete='off'
							spellCheck='off'
						/>
					)
				) : (
					<p
						className={styles.p}
						onClick={() => {
							setCurrentlyEditing(itemLabel);
						}}
					>
						{name === 'Original owner'
							? String(value) === '0'
								? 'No'
								: String(value) === '1'
								? 'Yes'
								: ''
							: value}
						<Edit
							sx={{
								fontSize: '1.25rem',
								alignSelf: 'end',
							}}
							className={styles.icon}
						/>
					</p>
				)
			) : editingInput ? (
				<input
					type={type}
					id={name}
					ref={inputRef}
					name={name}
					className={styles.input}
					value={value || ''}
					onChange={handleChange}
					maxLength={maxLength}
					autoComplete='off'
					spellCheck='off'
				/>
			) : (
				<Edit
					sx={{
						fontSize: '1.25rem',
						alignSelf: 'end',
					}}
					className={styles.icon}
					onClick={() => {
						setCurrentlyEditing(itemLabel);
					}}
				/>
			)}
		</div>
	);
}

export default YoyoTileInput;
