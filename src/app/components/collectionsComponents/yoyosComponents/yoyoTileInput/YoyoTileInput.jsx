'use client';

// Libraries
import React, { useState, useEffect, useRef } from 'react';

// Styles
import styles from './yoyoTileInput.module.scss';

// MUI
import { Edit, Check, Close, Undo } from '@mui/icons-material';

// Components
import ManufacturerDropdown from '../newYoyoForm/manufacturerDropdown/ManufacturerDropdown';
import ResponseDropdown from '../newYoyoForm/responseDropdown/ResponseDropdown';
import YearDropdown from '../newYoyoForm/yearDropdown/YearDropdown';
import BearingDropdown from '../newYoyoForm/bearingDropdown/bearingDropdown';

// Context
import { useAppContext } from '@/app/context/AppContext';

function YoyoTileInput({
	name,
	itemLabel,
	value,
	handleChange,
	maxLength,
	input,
	undo,
	handleUndo,
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
			// style={{ gap: value ? '.5rem' : '.25rem' }}
		>
			<label
				className={styles.label}
				htmlFor={name}
				style={{ marginRight: value ? '.5rem' : '.25rem' }}
			>
				{itemLabel}:
			</label>
			{value ? (
				editingInput ? (
					name === 'brand' ? (
						<ManufacturerDropdown
							value={value}
							handleChange={handleChange}
							name={name}
							className={styles.input}
						/>
					) : name === 'releaseYear' ? (
						<YearDropdown
							value={value}
							handleChange={handleDropdownChange}
							name={name}
							className={styles.input}
						/>
					) : name === 'purchaseYear' ? (
						<YearDropdown
							value={value}
							handleChange={handleDropdownChange}
							name={name}
							className={styles.input}
						/>
					) : name === 'responseType' ? (
						<ResponseDropdown
							value={value}
							handleChange={handleDropdownChange}
							name={name}
							className={styles.input}
						/>
					) : name === 'bearing' ? (
						<BearingDropdown
							value={value}
							handleChange={handleDropdownChange}
							name={name}
							className={styles.input}
						/>
					) : (
						<>
							<input
								type={input.inputType}
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
							<Check
								className={styles.check}
								onClick={() => setCurrentlyEditing(null)}
							/>
							<Close
								className={styles.close}
								onClick={() => {
									setCurrentlyEditing(null);
									handleUndo(name);
								}}
							/>
						</>
					)
				) : (
					<p
						className={styles.p}
						onClick={() => {
							setCurrentlyEditing(itemLabel);
						}}
					>
						{name === 'originalOwner'
							? String(value) === '0'
								? 'No'
								: String(value) === '1'
								? 'Yes'
								: ''
							: value}
						<Edit className={styles.icon} />
						{undo && (
							<Undo
								onClick={(e) => {
									e.stopPropagation();
									handleUndo(name);
								}}
								className={styles.undo}
							/>
						)}
					</p>
				)
			) : editingInput ? (
				name === 'brand' ? (
					<ManufacturerDropdown
						value={value}
						handleChange={handleChange}
						name={name}
					/>
				) : name === 'releaseYear' ? (
					<YearDropdown value={value} handleChange={handleChange} name={name} />
				) : name === 'purchaseYear' ? (
					<YearDropdown value={value} handleChange={handleChange} name={name} />
				) : name === 'responseType' ? (
					<ResponseDropdown
						value={value}
						handleChange={handleChange}
						name={name}
					/>
				) : name === 'bearing' ? (
					<BearingDropdown
						value={value}
						handleChange={handleChange}
						name={name}
					/>
				) : (
					<input
						type={input.inputType}
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
				<>
					<Edit
						className={styles.icon}
						onClick={() => {
							setCurrentlyEditing(itemLabel);
						}}
					/>
					{undo && (
						<Undo
							onClick={(e) => {
								e.stopPropagation();
								handleUndo(name);
							}}
							className={styles.undo}
						/>
					)}
				</>
			)}
		</div>
	);
}

export default YoyoTileInput;
