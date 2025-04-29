'use client';

// Libraries
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

// Utils
import axiosInstance from '@/utils/axios';

// Styles
import styles from './editableCollectionTemplate.module.scss';

// MUI
import { Edit, Save } from '@mui/icons-material';

// Components
import BlankCoverPhoto from '../blankCoverPhoto/BlankCoverPhoto';
import PictureUploader from '../pictureUploader/PictureUploader';
import EditableDescription from './editableDescription/EditableDescription';
import EditableTitle from './editableTitle/EditableTitle';
import Heart from '../icons/heart/Heart';
import LoadingSpinner from '../loading/LoadingSpinner';

// Context
import { useAppContext } from '@/app/context/AppContext';

function EditableCollectionTemplate({ collection, photos }) {
	const { id, collection_name, collection_description, likes, created_at } =
		collection;
	const originalCoverPhoto = photos.find(
		(photo) => photo.upload_category === 'cover'
	)?.secure_url;
	const created = dayjs(created_at).format('MMMM, D, YYYY');

	const {
		dirty,
		error,
		loading,
		setError,
		setDirty,
		setDirtyType,
		originalCollectionData,
		newCollectionData,
		setOriginalCollectionData,
		setNewCollectionData,
	} = useAppContext();

	// States
	const [formData, setFormData] = useState({
		title: collection_name,
		description: collection_description,
	});
	const [pendingData, setPendingData] = useState({ ...formData });
	const [editing, setEditing] = useState(false);
	const [coverPhoto, setCoverPhoto] = useState(originalCoverPhoto);

	useEffect(() => {
		setOriginalCollectionData({
			title: collection_name,
			description: collection_description,
		});
		setNewCollectionData({
			title: collection_name,
			description: collection_description,
			id: id,
		});
	}, []);

	// Set Dirty
	useEffect(() => {
		setDirty(
			formData.title !== originalCollectionData.title ||
				formData.title !== pendingData.title ||
				formData.description !== originalCollectionData.description ||
				(formData.description || '') !== (pendingData.description || '')
		);

		setDirtyType('collection');
	}, [originalCollectionData, formData, pendingData]);

	// Handles
	const handleChange = (e) => {
		const { name, value } = e.target;

		const getInvalidChars = (input) => {
			const regex = /[^A-Za-z0-9\-_\.~()"' ]/g;
			const matches = input.match(regex);
			return matches ? matches.join('') : '';
		};

		if (name === 'title') {
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
		const { title } = newCollectionData;

		const trimmed = title.trim();

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
			const submitData = { ...newCollectionData };

			await axiosInstance.patch(
				'/api/user/collections/byCollectionId',
				submitData
			);
		} catch (error) {
			console.error(
				'There was an error updating the collection',
				error.message
			);
		} finally {
			setEditing((prev) => !prev);
			setOriginalCollectionData({
				title: newCollectionData.title,
				description: newCollectionData.description,
			});
		}
	};

	return (
		<>
			<div className={styles['collection-container']}>
				<div className={styles.title}>
					{editing ? (
						<EditableTitle
							value={pendingData.title}
							setPendingData={setPendingData}
							formData={formData}
							setFormData={setFormData}
							handleChange={handleChange}
						/>
					) : (
						<div className={styles['collection-name-box']}>
							<h1 className={styles.h1}>{pendingData.title}</h1>
						</div>
					)}

					{error && <p style={{ color: 'red' }}>{error}</p>}

					<div className={styles.details}>
						<h3 className={styles.h3}>Created {created}</h3>
						<p className={styles.likes}>
							<Heart />
							{likes ? likes : '69'} likes
						</p>
					</div>

					{editing ? (
						<EditableDescription
							value={pendingData.description}
							formData={formData}
							setFormData={setFormData}
							setPendingData={setPendingData}
							handleChange={handleChange}
						/>
					) : pendingData.description ? (
						<div className={styles.description}>{pendingData.description}</div>
					) : (
						''
					)}
				</div>
				<div className={styles.collection}>
					<section className={styles['photos-container']}>
						<div className={styles.left}>
							<h2 className={styles.h2}>Cover Photo</h2>
							<div className={styles.cover}>
								{editing ? (
									<PictureUploader
										uploadType='cover'
										defaultUrl={coverPhoto}
										collection={id}
										setCoverPhoto={setCoverPhoto}
										editing={editing}
									/>
								) : coverPhoto ? (
									<img
										src={coverPhoto}
										alt='Collection cover photo'
										className={styles.image}
									/>
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
			{loading && <LoadingSpinner message='Saving' />}
		</>
	);
}

export default EditableCollectionTemplate;
