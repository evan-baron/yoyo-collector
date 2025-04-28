'use client';

// Libraries
import React, { useState } from 'react';

// Styles
import styles from '../editableCollectionTemplate.module.scss';

// MUI
import { Edit, Check, Close, Save, Undo } from '@mui/icons-material';

function EditableTitle({
	currentlyEditing,
	editing,
	value,
	handleChange,
	handleFieldSave,
	handleFieldCancel,
	hasUndo,
	toggleEditing,
}) {
	return (
		<>
			{currentlyEditing ? (
				<div className={styles['input-box']}>
					<input
						type='text'
						name='collectionName'
						placeholder='My Collection'
						className={styles.input}
						value={value || ''}
						onChange={handleChange}
						onKeyDown={(e) =>
							['Enter', 'Tab'].includes(e.key) &&
							handleFieldSave('collectionName')
						}
						maxLength='30'
						spellCheck='off'
					/>
					<div className={styles.icons}>
						<Check
							sx={{ fontSize: '2rem' }}
							onClick={() => handleFieldSave('collectionName')}
						/>
						<Close
							sx={{ fontSize: '2rem' }}
							onClick={() => handleFieldCancel('collectionName')}
						/>
					</div>
				</div>
			) : (
				<div
					className={styles['collection-name-box']}
					style={{ cursor: editing ? 'pointer' : 'default' }}
					onClick={() => editing && toggleEditing('collectionName')}
				>
					<h1 className={styles.h1}>{value}</h1>

					{editing && (
						<>
							<Edit
								className={styles['name-edit-icon']}
								onClick={(e) => {
									e.stopPropagation(); // prevent h1 click from also firing
									toggleEditing('collectionName');
								}}
							/>
							{hasUndo.collectionName && (
								<Undo
									sx={{
										position: 'relative',
										top: '.25rem',
										fontSize: formData.collectionName.length
											? '2.25rem'
											: '2.75rem',
										cursor: 'pointer',
										height: formData.collectionName.length
											? '2.25rem'
											: '2.75rem',
										alignSelf: 'end',
									}}
									onClick={(e) => {
										e.stopPropagation();
										handleUndo('collectionName');
									}}
								/>
							)}
						</>
					)}
				</div>
			)}
		</>
	);
}

export default EditableTitle;
