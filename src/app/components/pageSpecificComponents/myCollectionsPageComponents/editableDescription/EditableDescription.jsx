'use client';

// Libraries
import React, { useState } from 'react';

// Styles
import styles from './editableDescription.module.scss';

// MUI
import { Edit, Check, Close, Undo } from '@mui/icons-material';

// Context
import { useAppContext } from '@/app/context/AppContext';

function EditableDescription({
	value,
	formData,
	setFormData,
	setPendingData,
	handleChange,
}) {
	const { setNewCollectionData, originalCollectionData } = useAppContext();

	const [editing, setEditing] = useState(false);

	const undo = formData?.description !== originalCollectionData?.description;

	function toggleEditing() {
		setEditing((prev) => !prev);
	}

	// Handle Save
	const handleSave = () => {
		toggleEditing();

		if (!value.trim().length) {
			setPendingData((prev) => ({
				...prev,
				description: '',
			}));
		}

		setFormData((prev) => ({
			...prev,
			description: value.trim(),
		}));
		setNewCollectionData((prev) => ({
			...prev,
			description: value.trim(),
		}));
	};

	// Handle Cancel
	const handleCancel = () => {
		if (!value || value === '') {
			toggleEditing();
			return;
		} else {
			toggleEditing();

			setPendingData((prev) => ({
				...prev,
				description: formData.description.trim(),
			}));
			setNewCollectionData((prev) => ({
				...prev,
				description: formData.description.trim(),
			}));
		}
	};

	// Handle Undo
	const handleUndo = () => {
		setFormData((prev) => ({
			...prev,
			description: originalCollectionData.description.trim(),
		}));
		setPendingData((prev) => ({
			...prev,
			description: originalCollectionData.description.trim(),
		}));
		setNewCollectionData((prev) => ({
			...prev,
			description: originalCollectionData.description.trim(),
		}));
	};

	return (
		<>
			{editing ? (
				<div className={styles['textarea-box']}>
					<textarea
						className={styles.textarea}
						name='description'
						id='description'
						maxLength={300}
						rows='3'
						placeholder='A totally reasonable assortment of precision string spinners — definitely not an absurd retirement plan disguised as shiny toys...'
						value={value || ''}
						onChange={handleChange}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault();
								toggleEditing();
								handleSave();
							}
						}}
					/>
					<Check
						sx={{ fontSize: '1.75rem', cursor: 'pointer' }}
						onClick={() => handleSave()}
					/>
					<Close
						sx={{ fontSize: '1.75rem', cursor: 'pointer' }}
						onClick={() => handleCancel()}
					/>

					<div className={styles['max-length']}>
						{300 - (value?.length || 0)}
					</div>
				</div>
			) : value?.trim() ? (
				<div
					className={styles.description}
					style={{ cursor: 'pointer' }}
					onClick={() => {
						toggleEditing();
					}}
				>
					{value.trim()}
					<Edit
						sx={{
							position: 'relative',
							top: '.125rem',
							fontSize: '1.25rem',
							cursor: 'pointer',
							marginLeft: '.25rem',
							height: '1rem',
						}}
					/>
					{undo && (
						<Undo
							sx={{
								position: 'relative',
								top: '.375rem',
								fontSize: value?.length ? '1.25rem' : '1.75rem',
								cursor: 'pointer',
								height: value?.length ? '1.25rem' : '1.75rem',
								alignSelf: 'end',
							}}
							onClick={(e) => {
								e.stopPropagation();
								handleUndo();
							}}
						/>
					)}
				</div>
			) : (
				<div
					className={styles['textarea-box']}
					onClick={() => {
						toggleEditing();
					}}
					style={{ cursor: 'pointer' }}
				>
					<p className={styles.placeholder}>
						Click here to add a description...
					</p>
					{undo && (
						<Undo
							sx={{
								position: 'relative',
								top: '1px', // ULTRA FINE TOUCH FORMATTING
								fontSize: value?.length ? '1.25rem' : '1.5rem',
								cursor: 'pointer',
								height: value?.length ? '1.25rem' : '1.5rem',
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

export default EditableDescription;
