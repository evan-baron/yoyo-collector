'use client';

// Libraries
import React, { useState } from 'react';

// Styles
import styles from './editableTitle.module.scss';

// MUI
import { Edit, Check, Close, Undo } from '@mui/icons-material';

// Context
import { useAppContext } from '@/app/context/AppContext';

function EditableTitle({
	value,
	formData,
	setFormData,
	setPendingData,
	handleChange,
}) {
	const { error, setError, setNewCollectionData, originalCollectionData } =
		useAppContext();

	const [editing, setEditing] = useState(false);

	const undo = formData.title !== originalCollectionData.title;

	function toggleEditing() {
		setEditing((prev) => !prev);
	}

	// Handle Save
	const handleSave = () => {
		if (!value.trim().length) {
			setError('Your collection must have a name');
			return;
		}

		if (error) {
			return;
		}

		toggleEditing();

		setFormData((prev) => ({
			...prev,
			title: value,
		}));
		setNewCollectionData((prev) => ({
			...prev,
			title: value,
		}));
	};

	// Handle Cancel
	const handleCancel = () => {
		toggleEditing();
		setPendingData((prev) => ({
			...prev,
			title: formData.title.trim(),
		}));
		setNewCollectionData((prev) => ({
			...prev,
			title: formData.title.trim(),
		}));
		setError(null);
	};

	// Handle Undo
	const handleUndo = () => {
		setFormData((prev) => ({
			...prev,
			title: originalCollectionData.title,
		}));
		setPendingData((prev) => ({
			...prev,
			title: originalCollectionData.title,
		}));
		setNewCollectionData((prev) => ({
			...prev,
			title: originalCollectionData.title,
		}));
	};

	return (
		<>
			{editing ? (
				<div className={styles['input-box']}>
					<input
						type='text'
						name='title'
						placeholder='My Collection'
						autoComplete='off'
						className={styles.input}
						value={value || ''}
						onChange={handleChange}
						onKeyDown={(e) => {
							if (['Enter', 'Tab'].includes(e.key)) {
								handleSave();
							}
						}}
						maxLength='30'
						spellCheck='off'
					/>
					<div className={styles.icons}>
						<Check sx={{ fontSize: '2rem' }} onClick={() => handleSave()} />
						<Close sx={{ fontSize: '2rem' }} onClick={() => handleCancel()} />
					</div>
				</div>
			) : (
				<div
					className={styles['collection-name-box']}
					style={{ cursor: !editing ? 'pointer' : '' }}
					onClick={() => !editing && toggleEditing()}
				>
					<h1 className={styles.h1}>{value}</h1>
					<Edit
						className={styles['name-edit-icon']}
						onClick={(e) => {
							e.stopPropagation(); // prevent h1 click from also firing
							toggleEditing();
						}}
					/>
					{undo && (
						<Undo
							sx={{
								position: 'relative',
								top: '.25rem',
								fontSize: value?.length ? '2.25rem' : '2.75rem',
								cursor: 'pointer',
								height: value?.length ? '2.25rem' : '2.75rem',
								alignSelf: 'end',
							}}
							onClick={(e) => {
								e.stopPropagation();
								handleUndo();
							}}
						/>
					)}
				</div>
			)}
		</>
	);
}

export default EditableTitle;
