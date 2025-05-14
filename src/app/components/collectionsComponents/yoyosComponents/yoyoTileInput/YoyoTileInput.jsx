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
						<>
							<ManufacturerDropdown
								value={value}
								handleChange={handleChange}
								name={name}
								ref={inputRef}
							/>
							<Check
								className={styles.check}
								onClick={(e) => {
									e.stopPropagation();
									setCurrentlyEditing(null);
								}}
							/>
							<Close
								className={styles.close}
								onClick={(e) => {
									e.stopPropagation();
									setCurrentlyEditing(null);
									handleUndo(name);
								}}
							/>
						</>
					) : name === 'releaseYear' ? (
						<>
							<YearDropdown
								value={value}
								handleChange={handleChange}
								name={name}
								ref={inputRef}
							/>
							<Check
								className={styles.check}
								onClick={(e) => {
									e.stopPropagation();
									setCurrentlyEditing(null);
								}}
							/>
							<Close
								className={styles.close}
								onClick={(e) => {
									e.stopPropagation();
									setCurrentlyEditing(null);
									handleUndo(name);
								}}
							/>
						</>
					) : name === 'purchaseYear' ? (
						<>
							<YearDropdown
								value={value}
								handleChange={handleChange}
								name={name}
								ref={inputRef}
							/>
							<Check
								className={styles.check}
								onClick={(e) => {
									e.stopPropagation();
									setCurrentlyEditing(null);
								}}
							/>
							<Close
								className={styles.close}
								onClick={(e) => {
									e.stopPropagation();
									setCurrentlyEditing(null);
									handleUndo(name);
								}}
							/>
						</>
					) : name === 'responseType' ? (
						<>
							<ResponseDropdown
								value={value}
								handleChange={handleChange}
								name={name}
								ref={inputRef}
							/>
							<Check
								className={styles.check}
								onClick={(e) => {
									e.stopPropagation();
									setCurrentlyEditing(null);
								}}
							/>
							<Close
								className={styles.close}
								onClick={(e) => {
									e.stopPropagation();
									setCurrentlyEditing(null);
									handleUndo(name);
								}}
							/>
						</>
					) : name === 'bearing' ? (
						<>
							<BearingDropdown
								value={value}
								handleChange={handleChange}
								name={name}
								ref={inputRef}
							/>
							<Check
								className={styles.check}
								onClick={(e) => {
									e.stopPropagation();
									setCurrentlyEditing(null);
								}}
							/>
							<Close
								className={styles.close}
								onClick={(e) => {
									e.stopPropagation();
									setCurrentlyEditing(null);
									handleUndo(name);
								}}
							/>
						</>
					) : name === 'originalOwner' ? (
						<>
							<div className={styles.options}>
								<div className={styles.option}>
									<input
										id='originalOwnerYes'
										name={name}
										type={input.inputType}
										className={styles.radio}
										onChange={handleChange}
										value='yes'
										checked={value === 'yes'}
									/>
									<label htmlFor='originalOwnerYes' className={styles.label}>
										Yes
									</label>
								</div>
								<div className={styles.option}>
									<input
										id='originalOwnerNo'
										name={name}
										type={input.inputType}
										className={styles.radio}
										onChange={handleChange}
										value='no'
										checked={value === 'no'}
									/>
									<label htmlFor='originalOwnerNo' className={styles.label}>
										No
									</label>
								</div>
							</div>
						</>
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
								onClick={(e) => {
									e.stopPropagation();
									if (!error.valid) return;
									setCurrentlyEditing(null);
								}}
							/>
							<Close
								className={styles.close}
								onClick={(e) => {
									e.stopPropagation();
									setCurrentlyEditing(null);
									handleUndo(name);
								}}
							/>
						</>
					)
				) : name === 'originalOwner' ? (
					<>
						<div className={styles.options}>
							<div className={styles.option}>
								<input
									id='originalOwnerYes'
									name={name}
									type={input.inputType}
									className={styles.radio}
									onChange={handleChange}
									value='yes'
									checked={value === 'yes'}
								/>
								<label htmlFor='originalOwnerYes' className={styles.label}>
									Yes
								</label>
							</div>
							<div className={styles.option}>
								<input
									id='originalOwnerNo'
									name={name}
									type={input.inputType}
									className={styles.radio}
									onChange={handleChange}
									value='no'
									checked={value === 'no'}
								/>
								<label htmlFor='originalOwnerNo' className={styles.label}>
									No
								</label>
							</div>
						</div>
					</>
				) : (
					<p
						className={styles.p}
						onClick={(e) => {
							e.stopPropagation();
							setCurrentlyEditing(itemLabel);
						}}
					>
						{value}
						<Edit
							className={styles.icon}
							onClick={(e) => {
								e.stopPropagation();
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
					</p>
				)
			) : editingInput ? (
				name === 'brand' ? (
					<>
						<ManufacturerDropdown
							value={value}
							handleChange={handleChange}
							name={name}
							ref={inputRef}
						/>
						<Check
							className={styles.check}
							onClick={(e) => {
								e.stopPropagation();
								setCurrentlyEditing(null);
							}}
						/>
						<Close
							className={styles.close}
							onClick={(e) => {
								e.stopPropagation();
								setCurrentlyEditing(null);
								handleUndo(name);
							}}
						/>
					</>
				) : name === 'releaseYear' ? (
					<>
						<YearDropdown
							value={value}
							handleChange={handleChange}
							name={name}
							ref={inputRef}
						/>
						<Check
							className={styles.check}
							onClick={(e) => {
								e.stopPropagation();
								setCurrentlyEditing(null);
							}}
						/>
						<Close
							className={styles.close}
							onClick={(e) => {
								e.stopPropagation();
								setCurrentlyEditing(null);
								handleUndo(name);
							}}
						/>
					</>
				) : name === 'purchaseYear' ? (
					<>
						<YearDropdown
							value={value}
							handleChange={handleChange}
							name={name}
							ref={inputRef}
						/>
						<Check
							className={styles.check}
							onClick={(e) => {
								e.stopPropagation();
								setCurrentlyEditing(null);
							}}
						/>
						<Close
							className={styles.close}
							onClick={(e) => {
								e.stopPropagation();
								setCurrentlyEditing(null);
								handleUndo(name);
							}}
						/>
					</>
				) : name === 'responseType' ? (
					<>
						<ResponseDropdown
							value={value}
							handleChange={handleChange}
							name={name}
							ref={inputRef}
						/>
						<Check
							className={styles.check}
							onClick={(e) => {
								e.stopPropagation();
								setCurrentlyEditing(null);
							}}
						/>
						<Close
							className={styles.close}
							onClick={(e) => {
								e.stopPropagation();
								setCurrentlyEditing(null);
								handleUndo(name);
							}}
						/>
					</>
				) : name === 'bearing' ? (
					<>
						<BearingDropdown
							value={value}
							handleChange={handleChange}
							name={name}
							ref={inputRef}
						/>
						<Check
							className={styles.check}
							onClick={(e) => {
								e.stopPropagation();
								setCurrentlyEditing(null);
							}}
						/>
						<Close
							className={styles.close}
							onClick={(e) => {
								e.stopPropagation();
								setCurrentlyEditing(null);
								handleUndo(name);
							}}
						/>
					</>
				) : name === 'originalOwner' ? (
					<div className={styles.options}>
						<div className={styles.option}>
							<input
								id='originalOwnerYes'
								name={name}
								type={input.inputType}
								className={styles.radio}
								onChange={handleChange}
								value='yes'
								checked={value === 'yes'}
							/>
							<label htmlFor='originalOwnerYes' className={styles.label}>
								Yes
							</label>
						</div>
						<div className={styles.option}>
							<input
								id='originalOwnerNo'
								name={name}
								type={input.inputType}
								className={styles.radio}
								onChange={handleChange}
								value='no'
								checked={value === 'no'}
							/>
							<label htmlFor='originalOwnerNo' className={styles.label}>
								No
							</label>
						</div>
					</div>
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
							onClick={(e) => {
								e.stopPropagation();
								if (!error.valid) return;
								setCurrentlyEditing(null);
							}}
						/>
						<Close
							className={styles.close}
							onClick={(e) => {
								e.stopPropagation();
								setCurrentlyEditing(null);
								handleUndo(name);
							}}
						/>
					</>
				)
			) : name === 'originalOwner' ? (
				<>
					<div className={styles.options}>
						<div className={styles.option}>
							<input
								id='originalOwnerYes'
								name={name}
								type={input.inputType}
								className={styles.radio}
								onChange={handleChange}
								value='yes'
								checked={value === 'yes'}
							/>
							<label htmlFor='originalOwnerYes' className={styles.label}>
								Yes
							</label>
						</div>
						<div className={styles.option}>
							<input
								id='originalOwnerNo'
								name={name}
								type={input.inputType}
								className={styles.radio}
								onChange={handleChange}
								value='no'
								checked={value === 'no'}
							/>
							<label htmlFor='originalOwnerNo' className={styles.label}>
								No
							</label>
						</div>
					</div>
				</>
			) : (
				<>
					<Edit
						className={styles.icon}
						onClick={(e) => {
							e.stopPropagation();
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
