'use client';

// Libraries
import React, { useState, useRef } from 'react';

// Styles
import styles from './yoyoTileInput.module.scss';

// MUI
import { Edit } from '@mui/icons-material';

// Context
import { useAppContext } from '@/app/context/AppContext';

function YoyoTileInput({
	type,
	name,
	itemLabel,
	value,
	handleChange,
	maxLength,
}) {
	const { currentlyEditing } = useAppContext();
	const [editing, setEditing] = useState(false);

	const inputRef = useRef(null);

	// const editingInput = currentlyEditing === name;

	// useEffect(() => {
	// 	if (editingInput && inputRef.current) {
	// 		inputRef.current.focus();
	// 	}
	// }, [editingInput]);

	return (
		<div
			className={styles.attribute}
			style={{ gap: value ? '.5rem' : '.25rem' }}
		>
			<label className={styles.label} htmlFor={value}>
				{itemLabel}:
			</label>
			{value ? (
				editing ? (
					<input
						type={type}
						id={name}
						name={name}
						className={styles.input}
						value={value || ''}
						onChange={handleChange}
						maxLength={maxLength}
						autoComplete='off'
						spellCheck='off'
					/>
				) : (
					<p className={styles.p} onClick={() => setEditing(true)}>
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
			) : (
				<Edit
					sx={{
						fontSize: '1.25rem',
						alignSelf: 'end',
					}}
					className={styles.icon}
					onClick={() => setEditing(true)}
				/>
			)}
		</div>
	);
}

export default YoyoTileInput;
