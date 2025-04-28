'use client';

// Libraries
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

// Utils
import axiosInstance from '@/utils/axios';

// Styles
import styles from './editableCollectionTemplate.module.scss';

// MUI
import { Edit, Check, Close, Save, Undo } from '@mui/icons-material';

// Components
import BlankCoverPhoto from '../blankCoverPhoto/BlankCoverPhoto';
import PictureUploader from '../pictureUploader/PictureUploader';

// Context
import { useAppContext } from '@/app/context/AppContext';

function EditableCollectionTemplate({ collection }) {
	const { id, collection_name, collection_description, likes, created_at } =
		collection;
	const created = dayjs(created_at).format('MMMM, D, YYYY');

	const {
		dirty,
		error,
		setError,
		setDirty,
		setDirtyType,
		originalCollectionData,
		setOriginalCollectionData,
		setNewCollectionData,
	} = useAppContext();

	// States

	const [formData, setFormData] = useState({
		collectionName: collection_name,
		description: collection_description,
	});
	const [pendingData, setPendingData] = useState({ ...formData });
	const [editing, setEditing] = useState(false);
	const [currentlyEditing, setCurrentlyEditing] = useState({
		collectionName: false,
		description: false,
	});

	// Semi-states
	const undo = {
		collectionName:
			formData.collectionName !== originalCollectionData.collectionName,
		description: formData.description !== originalCollectionData.description,
	};

	useEffect(() => {
		setOriginalCollectionData((prev) => ({
			collectionName: collection_name,
			description: collection_description,
		}));
		setNewCollectionData((prev) => ({
			collectionName: collection_name,
			description: collection_description,
			id: id,
		}));
	}, []);

	// Set Dirty
	useEffect(() => {
		setDirty(
			formData.collectionName !== originalCollectionData.collectionName ||
				formData.collectionName !== pendingData.collectionName ||
				formData.description !== originalCollectionData.description ||
				(formData.description || '') !== (pendingData.description || '')
		);

		setDirtyType('collection');
	}, [originalCollectionData, formData, pendingData]);

	// Helper functions
	const toggleEditing = (field) => {
		setCurrentlyEditing((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	const handleSave = (field) => {
		if (field === 'collectionName' && !pendingData[field].trim().length) {
			setError('Your collection must have a name');
			return;
		}

		if (field === 'collectionName' && error) {
			return;
		}

		setCurrentlyEditing((prev) => ({
			...prev,
			[field]: false,
		}));
		setFormData((prev) => ({
			...prev,
			[field]: pendingData[field],
		}));
		setNewCollectionData((prev) => ({
			...prev,
			[field]: pendingData[field],
		}));
	};

	const handleCancel = (field) => {
		setCurrentlyEditing((prev) => ({
			...prev,
			[field]: false,
		}));
		setPendingData((prev) => ({
			...prev,
			[field]: formData[field].trim(),
		}));
		setNewCollectionData((prev) => ({
			...prev,
			[field]: formData[field].trim(),
		}));
		setError(null);
	};

	const handleUndo = (field) => {
		setFormData((prev) => ({
			...prev,
			[field]: originalCollectionData[field],
		}));
		setPendingData((prev) => ({
			...prev,
			[field]: originalCollectionData[field],
		}));
		setNewCollectionData((prev) => ({
			...prev,
			[field]: originalCollectionData[field],
		}));
	};

	const getInvalidChars = (input) => {
		const regex = /[^A-Za-z0-9\-_\.~()"' ]/g;
		const matches = input.match(regex);
		return matches ? matches.join('') : '';
	};

	// Handles
	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === 'collectionName') {
			error && setError(null);
			const invalidChars = getInvalidChars(value);

			if (invalidChars) {
				setError(`Invalid characters in name: ${invalidChars}`);
			} else {
				setError(null); // Clear any previous error
			}
		}
		setPendingData((pendingData) => ({
			...pendingData,
			[name]: value,
		}));
		setNewCollectionData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async () => {
		if (!dirty) {
			setEditing((prev) => !prev);
			return;
		}

		const { collectionName } = formData;

		const trimmed = collectionName.trim();

		const valid = (param) => /^[A-Za-z0-9\-_.~()"' ]+$/.test(param);

		if (!trimmed) {
			setError(`Collection name can't be empty.`);
			return;
		}

		if (!valid(trimmed)) {
			setError('Only letters, numbers, spaces, -, _, ., and ~ are allowed.');
			return;
		}

		try {
			const submitData = { ...formData, id: id };
			await axiosInstance.patch('/api/user/collections', submitData);
		} catch (error) {
			console.error(
				'There was an error updating the collection',
				error.message
			);
		} finally {
			setOriginalCollectionData({
				collectionName: '',
				description: '',
			});
			setEditing((prev) => !prev);
			setCurrentlyEditing({
				collectionName: false,
				description: false,
			});
			setOriginalCollectionData({
				collectionName: formData.collectionName,
				description: formData.description,
			});
		}
	};

	return (
		<div className={styles['collection-container']}>
			<div className={styles.title}>
				{currentlyEditing.collectionName ? (
					<div className={styles['input-box']}>
						<input
							type='text'
							name='collectionName'
							placeholder='My Collection'
							autoComplete='off'
							className={styles.input}
							value={pendingData.collectionName || ''}
							onChange={handleChange}
							onKeyDown={(e) => {
								if (['Enter', 'Tab'].includes(e.key)) {
									handleSave('collectionName');
								}
							}}
							maxLength='30'
							spellCheck='off'
						/>
						<div className={styles.icons}>
							<Check
								sx={{ fontSize: '2rem' }}
								onClick={() => handleSave('collectionName')}
							/>
							<Close
								sx={{ fontSize: '2rem' }}
								onClick={() => handleCancel('collectionName')}
							/>
						</div>
					</div>
				) : (
					<div
						className={styles['collection-name-box']}
						style={{ cursor: editing ? 'pointer' : '' }}
						onClick={() => editing && toggleEditing('collectionName')}
					>
						<h1 className={styles.h1}>{pendingData.collectionName}</h1>

						{editing && (
							<>
								<Edit
									className={styles['name-edit-icon']}
									onClick={(e) => {
										e.stopPropagation(); // prevent h1 click from also firing
										toggleEditing('collectionName');
									}}
								/>
								{undo.collectionName && (
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

				{error && <p style={{ color: 'red' }}>{error}</p>}
				{dirty && <p style={{ color: 'red' }}>Dirty</p>}

				<div className={styles.details}>
					<h3 className={styles.h3}>Created {created}</h3>
					<p className={styles.likes}>
						<svg viewBox='0 0 24 24' className={styles.heart}>
							<defs>
								<linearGradient
									id='quoteGradient'
									x1='0%'
									y1='0%'
									x2='100%'
									y2='100%'
								>
									<stop offset='0%' stopColor='#ff00ff' />
									<stop offset='90%' stopColor='#00e1ff' />
								</linearGradient>
							</defs>
							<path
								d='m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z'
								fill='url(#quoteGradient)'
							/>
						</svg>
						{likes ? likes : '69'} likes
					</p>
				</div>

				{editing ? (
					currentlyEditing.description ? (
						// Case 1: Editing mode ON and actively editing the description
						<div className={styles['textarea-box']}>
							<textarea
								className={styles.textarea}
								name='description'
								id='description'
								maxLength={300}
								rows='3'
								placeholder='A totally reasonable assortment of precision string spinners — definitely not an absurd retirement plan disguised as shiny toys...'
								value={pendingData.description || ''}
								onChange={handleChange}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										toggleEditing('description');
										handleSave('description');
									}
								}}
							/>
							<Check
								sx={{ fontSize: '1.75rem', cursor: 'pointer' }}
								onClick={() => handleSave('description')}
							/>
							<Close
								sx={{ fontSize: '1.75rem', cursor: 'pointer' }}
								onClick={() => handleCancel('description')}
							/>

							<div className={styles['max-length']}>
								{300 - (pendingData.description?.length || 0)}
							</div>
						</div>
					) : formData.description ? (
						// Case 2: Editing mode ON but NOT actively editing description (and a description exists)
						<div
							className={styles.description}
							style={{ cursor: 'pointer' }}
							onClick={() => {
								toggleEditing('description');
							}}
						>
							{pendingData.description}
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
							{undo.description && (
								<Undo
									sx={{
										position: 'relative',
										top: '.375rem',
										fontSize: formData.collectionName.length
											? '1.25rem'
											: '1.75rem',
										cursor: 'pointer',
										height: formData.collectionName.length
											? '1.25rem'
											: '1.75rem',
										alignSelf: 'end',
									}}
									onClick={(e) => {
										e.stopPropagation();
										handleUndo('description');
									}}
								/>
							)}
						</div>
					) : (
						// Case 3: Editing mode ON but NO description yet
						<div
							className={styles['textarea-box']}
							onClick={() => {
								toggleEditing('description');
							}}
							style={{ cursor: 'pointer' }}
						>
							<p className={styles.placeholder}>
								Click here to add a description...
							</p>
							{undo.description && (
								<Undo
									sx={{
										position: 'relative',
										top: '1px', // ULTRA FINE TOUCH FORMATTING
										fontSize: formData.description?.length
											? '1.25rem'
											: '1.5rem',
										cursor: 'pointer',
										height: formData.description?.length ? '1.25rem' : '1.5rem',
										alignSelf: 'end',
									}}
									onClick={(e) => {
										e.stopPropagation();
										handleUndo('description');
									}}
								/>
							)}
						</div>
					)
				) : formData.description ? (
					// Case 4: NOT editing mode, just show the description if it exists
					<p className={styles.description}>{formData.description}</p>
				) : (
					// Case 5: NOT editing mode, and no description — show nothing
					''
				)}
			</div>
			<div className={styles.collection}>
				<section className={styles['photos-container']}>
					<div className={styles.left}>
						<h2 className={styles.h2}>Cover Photo</h2>
						<div className={styles.cover}>
							{editing ? (
								<PictureUploader uploadType='cover' />
							) : (
								<BlankCoverPhoto />
							)}
						</div>
					</div>
					<div className={styles.right}>
						<h2 className={styles.h2}>Collection Photos</h2>
						<div className={styles.photos}>
							<div className={styles.grid}>
								<div className={styles.photo}></div>
								<div className={styles.photo}></div>
								<div className={styles.photo}></div>
								<div className={styles.photo}></div>
							</div>
						</div>
					</div>
				</section>
				<section className={styles['yoyos-container']}>
					<h2 className={styles.h2}>Yoyos</h2>
					<div className={styles.sort}>
						<div className={styles.style}>Photos Only</div>
						<div className={styles.style}>Details Only</div>
						<div className={styles.style}>Photos and Details</div>
					</div>
					<div className={styles.yoyos}>
						<div className={styles.tile}>
							(This will be its own component called YoyoTile)
						</div>
						<div className={styles.tile}>
							(This will be its own component called YoyoTile)
						</div>
						<div className={styles.tile}>
							(This will be its own component called YoyoTile)
						</div>
						<div className={styles.tile}>
							(This will be its own component called YoyoTile)
						</div>
					</div>
				</section>
			</div>
			<button
				className={`${styles['settings-box']} ${error && styles.disabled}`}
				onClick={() => {
					if (editing) {
						handleSubmit();
					} else {
						setEditing((prev) => !prev);
					}
				}}
				disabled={error}
				style={{
					cursor: error ? '' : 'pointer',
				}}
			>
				{editing ? (
					<Save className={styles['settings-icon']} />
				) : (
					<Edit className={styles['settings-icon']} />
				)}
				<p className={styles.settings}>
					{editing ? 'Save Changes' : 'Edit Collection'}
				</p>
			</button>
		</div>
	);
}

export default EditableCollectionTemplate;
