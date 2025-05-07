'use client';

// Libraries
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dayjs from 'dayjs';

// Utils
import axiosInstance from '@/lib/utils/axios';

// Styles
import styles from './collectionPage.module.scss';

// MUI
import { Edit, Save, ZoomIn, Share } from '@mui/icons-material';

// Components
import BlankCoverPhoto from '@/app/components/blankCoverPhoto/BlankCoverPhoto';
import PictureUploader from '@/app/components/pictureUploader/PictureUploader';
import EditableDescription from '@/app/components/collectionsComponents/myCollectionsComponents/editableDescription/EditableDescription';
import EditableTitle from '@/app/components/collectionsComponents/myCollectionsComponents/editableTitle/EditableTitle';
import Heart from '@/app/components/icons/heart/Heart';
import LoadingSpinner from '@/app/components/loading/LoadingSpinner';
import CollectionPhotos from '@/app/components/collectionsComponents/collectionComponents/collectionPhotos/CollectionPhotos';
import YoyoTiles from '@/app/components/collectionsComponents/yoyosComponents/yoyoTiles/YoyoTiles';

// Context
import { useAppContext } from '@/app/context/AppContext';

function Collection() {
	const { collectionId } = useParams();
	//original params were collection, photos
	const {
		dirty,
		editing,
		error,
		loading,
		setEditing,
		setError,
		setDirty,
		setDirtyType,
		setShareLink,
		originalCollectionData,
		newCollectionData,
		newCollectionCounter,
		setOriginalCollectionData,
		setModalOpen,
		setModalType,
		setViewPhoto,
		setNewCollectionData,
	} = useAppContext();

	const [collection, setCollection] = useState({});
	const [photos, setPhotos] = useState([]);
	const [hover, setHover] = useState(false);

	useEffect(() => {
		if (!collectionId) return;

		const fetchCollectionData = async () => {
			const response = await axiosInstance.get(
				`/api/user/collections/byCollectionId?collectionId=${collectionId}`
			);
			const { collectionData, collectionPhotos } = response.data;

			console.log(response.data);

			setCollection(collectionData);
			setPhotos(collectionPhotos);
			setCoverPhoto(
				collectionPhotos.find((photo) => photo.upload_category === 'cover')
					?.secure_url
			);
		};
		fetchCollectionData();
	}, [newCollectionCounter]);

	const created = dayjs(collection.created_at).format('MMMM, D, YYYY');

	// States
	const [formData, setFormData] = useState({});
	const [pendingData, setPendingData] = useState({});
	const [coverPhoto, setCoverPhoto] = useState(null);
	const [selected, setSelected] = useState('collection');

	useEffect(() => {
		setFormData({
			title: collection.collection_name,
			description: collection.collection_description,
		});
		setPendingData({
			title: collection.collection_name,
			description: collection.collection_description,
		});
		setOriginalCollectionData({
			title: collection.collection_name,
			description: collection.collection_description,
		});
		setNewCollectionData({
			title: collection.collection_name,
			description: collection.collection_description,
			id: collection.id,
		});
	}, [collection]);

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

	// Loading screen
	const loadingComplete = !!(
		collection?.id &&
		formData.title &&
		formData.description &&
		pendingData.title &&
		pendingData.description &&
		photos
	);

	if (!loadingComplete) return <LoadingSpinner message='loading' />;

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
							<Heart likes={collection.likes} size='small' />
							{collection.likes ? collection.likes : '69'} likes
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
							<h2 className={styles.h2}>
								{selected === 'collection' ? 'Cover Photo' : 'Yoyo Photos'}
							</h2>
							<div className={styles.cover}>
								{editing ? (
									<PictureUploader
										key='cover'
										uploadType={selected === 'collection' ? 'cover' : 'yoyo'}
										input='coverInput'
										defaultUrl={coverPhoto}
										collection={collection.id}
										setCoverPhoto={setCoverPhoto}
										editing={editing}
									/>
								) : coverPhoto ? (
									<div
										className={styles['image-box']}
										onMouseEnter={() => setHover(true)}
										onMouseLeave={() => {
											setHover(false);
										}}
									>
										<img
											src={coverPhoto}
											alt='Collection cover photo'
											className={styles.image}
										/>
										<div className={`${styles.menu} ${hover && styles.hover}`}>
											<div
												className={`${styles.option} ${
													!editing && styles['not-editing']
												}`}
												onClick={() => {
													console.log('zoom action');
												}}
											>
												<ZoomIn
													className={`${styles.icon} ${
														!editing && styles['not-editing']
													}`}
													onClick={() => {
														setModalOpen(true);
														setModalType('view-photo');
														setViewPhoto(coverPhoto);
													}}
												/>
											</div>
											<div
												className={`${styles.option} ${
													!editing && styles['not-editing']
												}`}
												onClick={() => {
													setModalOpen(true);
													setModalType('share');
													setShareLink(coverPhoto);
												}}
											>
												<Share
													className={`${styles.icon} ${
														!editing && styles['not-editing']
													}`}
												/>
											</div>
										</div>
									</div>
								) : (
									<BlankCoverPhoto />
								)}
							</div>
						</div>
						<div className={styles.right}>
							<div className={styles.titles}>
								<h2
									className={`
										${styles.h2} 
										${(selected === 'collection' || !selected) && styles.selected}`}
									onClick={() => setSelected('collection')}
								>
									Collection Photos
								</h2>
								<div className={styles.divider}></div>
								<h2
									className={`
										${styles.h2} 
										${(selected === 'yoyos' || !selected) && styles.selected}
									`}
									onClick={() => setSelected('yoyos')}
								>
									Yoyos
								</h2>
							</div>
							<div
								className={styles.photos}
								style={{ display: selected === 'collection' ? 'flex' : 'none' }}
							>
								<CollectionPhotos
									collectionId={collectionId}
									collectionType='user'
									scroll='click'
									setCoverPhoto={setCoverPhoto}
									editing={editing}
								/>
							</div>
							<section
								className={styles['yoyos-container']}
								style={{ display: selected === 'yoyos' ? 'flex' : 'none' }}
							>
								{!editing ? (
									<>
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
									</>
								) : (
									<div className={styles.yoyos}>
										<YoyoTiles editing={editing} />
									</div>
								)}
							</section>
							{/* {selected === 'collection' ? (
								<div className={styles.photos}>
									<CollectionPhotos
										collectionId={collectionId}
										collectionType='user'
										scroll='click'
										setCoverPhoto={setCoverPhoto}
										editing={editing}
									/>
								</div>
							) : (
								<section className={styles['yoyos-container']}>
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
							)} */}
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

export default Collection;
