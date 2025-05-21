'use client';

// Libraries
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import dayjs from 'dayjs';

// Utils
import axiosInstance from '@/lib/utils/axios';

// Styles
import styles from './myCollectionPage.module.scss';

// MUI
import {
	Edit,
	Save,
	ZoomIn,
	Share,
	Add,
	DeleteOutline,
} from '@mui/icons-material';

// Components
import BlankCoverPhoto from '@/app/components/blankCoverPhoto/BlankCoverPhoto';
import PictureUploader from '@/app/components/pictureUploader/PictureUploader';
import EditableDescription from '@/app/components/pageSpecificComponents/myCollectionsPageComponents/editableDescription/EditableDescription';
import EditableTitle from '@/app/components/pageSpecificComponents/myCollectionsPageComponents/editableTitle/EditableTitle';
import Heart from '@/app/components/icons/heart/Heart';
import LoadingSpinner from '@/app/components/loading/LoadingSpinner';
import CollectionPhotos from '@/app/components/pageSpecificComponents/myCollectionsPageComponents/collectionComponents/collectionPhotos/CollectionPhotos';
import YoyoTiles from '@/app/components/pageSpecificComponents/myCollectionsPageComponents/yoyosComponents/yoyoTiles/YoyoTiles';
import YoyoModal from '@/app/components/yoyoModal/YoyoModal';

// Context
import { useAppContext } from '@/app/context/AppContext';

function Collection() {
	const { collectionId } = useParams();
	//original params were collection, photos
	const {
		dirty,
		dirtyType,
		editing,
		editingYoyos,
		error,
		loading,
		loadingMessage,
		newCollectionCounter,
		newCollectionData,
		newYoyoData,
		originalCollectionData,
		originalYoyoData,
		selectedYoyo,
		selectedYoyos,
		yoyoDisplayType,
		yoyoModalOpen,
		setDirty,
		setDirtyType,
		setEditing,
		setEditingYoyos,
		setError,
		setModalOpen,
		setModalType,
		setNewCollectionData,
		setNewCollectionCounter,
		setNewYoyoData,
		setOriginalCollectionData,
		setOriginalYoyoData,
		setSelectedYoyo,
		setSelectedYoyos,
		setShareLink,
		setViewingCollectionId,
		setViewPhoto,
		setYoyoModalOpen,
		setYoyoModalType,
	} = useAppContext();

	const [collection, setCollection] = useState({});
	const [photos, setPhotos] = useState([]);
	const [yoyos, setYoyos] = useState([]);
	const [hover, setHover] = useState(false);

	useEffect(() => {
		if (!collectionId) return;

		setViewingCollectionId(collectionId);

		const fetchCollectionData = async () => {
			const response = await axiosInstance.get(
				`/api/user/collections/byCollectionId?collectionId=${collectionId}`
			);
			const { collectionData, collectionPhotos, yoyosData } = response.data;

			setCollection(collectionData);
			setPhotos(collectionPhotos);
			setYoyos(yoyosData);
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
	const [addYoyo, setAddYoyo] = useState(false);

	// Resets editing state on page load
	useEffect(() => {
		setSelectedYoyo(null);
		setSelectedYoyos([]);
	}, []);

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
			editing && setEditing((prev) => !prev);
			if (editingYoyos && yoyoModalOpen) {
				setYoyoModalOpen(false);
				setEditingYoyos(false);
				return;
			}
			editingYoyos && setEditingYoyos((prev) => !prev);
			return;
		}

		if (dirtyType === 'collection') {
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
		} else if (dirtyType === 'yoyo') {
			if (error) {
				setModalType('error');
				return;
			}

			const valuesToUpdate = Object.entries(newYoyoData).reduce(
				(obj, [key, value]) => {
					if (value !== originalYoyoData[key]) {
						obj[key] = value;
					}
					return obj;
				},
				{}
			);

			try {
				await axiosInstance.patch('/api/user/yoyos', {
					yoyoId: selectedYoyo,
					valuesToUpdate: valuesToUpdate,
				});
			} catch (error) {
				console.error(
					'There was an error updating the yoyo details at mycollections/id/page',
					error
				);
				return;
			} finally {
				setEditingYoyos((prev) => !prev);
				setDirty(false);
				setDirtyType(null);
				setNewCollectionCounter((prev) => prev + 1);
				setNewYoyoData(null);
				setOriginalYoyoData(null);
				setYoyoModalOpen(false);
			}
		}
	};

	const handleDeleteYoyos = async () => {
		setModalOpen(true);
		setModalType('delete-yoyos');
	};

	const loadingComplete = useMemo(() => {
		return (
			collection?.id &&
			'title' in formData &&
			'description' in formData &&
			'title' in pendingData &&
			'description' in pendingData &&
			Array.isArray(photos)
		);
	}, [collection, formData, pendingData, photos]);

	if (!loadingComplete) return <LoadingSpinner message='Loading' />;

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
							{collection.likes} likes
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
				<div className={styles['switch-view']}>
					<div
						className={`${styles.option} ${styles['col-1']}									
										${(selected === 'collection' || !selected) && styles.selected}`}
						onClick={() => {
							if (dirty) {
								setModalOpen(true);
								setModalType('dirty');
								return;
							}

							if (selected === 'yoyos') {
								editingYoyos && setEditingYoyos(false);
								setSelected('collection');
								setSelectedYoyos([]);
								setSelectedYoyo(null);
							} else if (selected === 'collection') {
								return;
							}
						}}
					>
						Collection
					</div>
					<div className={styles.divider}></div>
					<div
						className={`${styles.option} ${styles['col-2']}	 									
										${(selected === 'yoyos' || !selected) && styles.selected}`}
						onClick={() => {
							if (dirty) {
								setModalOpen(true);
								setModalType('dirty');
								return;
							}

							if (selected === 'yoyos') {
								return;
							} else if (selected === 'collection') {
								editing && setEditing(false);
								setSelected('yoyos');
							}
						}}
					>
						Yoyos
					</div>
				</div>
				<div className={styles.collection}>
					{selected === 'collection' ? (
						<section className={styles['photos-container']}>
							<div className={styles.left}>
								<h2 className={styles.h2}>Cover Photo</h2>
								<div className={styles.cover}>
									{editing ? (
										<PictureUploader
											key={'cover'}
											uploadType={'cover'}
											input={'coverInput'}
											defaultUrl={selected === 'collection' ? coverPhoto : ''}
											collection={collection.id}
											setCoverPhoto={setCoverPhoto}
											editing={selected === 'collection' && editing}
										/>
									) : selected === 'collection' && coverPhoto ? (
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
											<div
												className={`${styles.menu} ${hover && styles.hover}`}
											>
												<div
													className={`${styles.option} ${
														!editing && styles['not-editing']
													}`}
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
										<div style={{ boxShadow: '0.25rem 0.25rem 1rem black' }}>
											<BlankCoverPhoto />
										</div>
									)}
								</div>
							</div>
							<div className={styles.right}>
								<div className={styles.titles}>
									<h2 className={styles.h2}>Collection Photos</h2>
								</div>
								<div className={styles.photos}>
									<CollectionPhotos
										collectionId={collectionId}
										collectionType='user'
										scroll='click'
										setCoverPhoto={setCoverPhoto}
										editing={editing}
										photos={photos}
									/>
								</div>
							</div>
						</section>
					) : (
						<section
							className={styles['yoyos-container']}
							style={{ display: !selected && 'none' }}
						>
							<div className={styles.yoyos}>
								<YoyoTiles
									yoyos={yoyos}
									selectedYoyos={selectedYoyos}
									setSelectedYoyos={setSelectedYoyos}
									editingYoyos={editingYoyos}
									addYoyo={addYoyo}
									setAddYoyo={setAddYoyo}
									collectionType={'user'}
								/>
							</div>
						</section>
					)}
				</div>
				<div
					className={styles['settings-box']}
					style={{ zIndex: yoyoModalOpen && '10' }}
				>
					<button
						className={`${styles['settings-button']} ${
							error && styles.disabled
						}`}
						onClick={() => {
							if (editing || editingYoyos) {
								handleSubmit();
							} else {
								if (selected === 'collection') {
									setEditing((prev) => !prev);
								} else if (selected === 'yoyos') {
									setEditingYoyos((prev) => !prev);
								}
							}
							yoyoModalOpen && setYoyoModalType('edit-yoyo');
						}}
						disabled={error}
						style={{
							cursor: error ? '' : 'pointer',
						}}
					>
						{editing || editingYoyos ? (
							<Save className={styles['settings-icon']} />
						) : (
							<Edit className={styles['settings-icon']} />
						)}
						<p className={styles.settings}>
							{editing || editingYoyos
								? 'Save Changes'
								: selected === 'yoyos'
								? yoyoDisplayType === 'small' && selectedYoyo
									? 'Edit Yoyo'
									: yoyoModalOpen
									? 'Edit Yoyo'
									: 'Edit Yoyos'
								: 'Edit Collection'}
						</p>
					</button>
					{selected === 'yoyos' && !yoyoModalOpen && (
						<button
							className={`${styles['settings-button']} ${
								error && styles.disabled
							}`}
							onClick={() => {
								if (dirty) {
									setModalOpen(true);
									setModalType('dirty');
									return;
								}
								!addYoyo && setAddYoyo(true);
								editingYoyos && setEditingYoyos(false);
								// selectedYoyo && setSelectedYoyo(null);
							}}
							disabled={error}
							style={{
								cursor: error ? '' : 'pointer',
							}}
						>
							<Add
								className={styles['settings-icon']}
								style={{ fontSize: '1.75rem' }}
							/>

							<p className={styles.settings}>Add Yoyo</p>
						</button>
					)}
					{selectedYoyos.length > 0 && selected === 'yoyos' && (
						<button
							className={`${styles['settings-button']} ${
								error && styles.disabled
							}`}
							onClick={handleDeleteYoyos}
							disabled={error}
							style={{
								cursor: error ? '' : 'pointer',
							}}
						>
							<DeleteOutline
								className={styles['settings-icon']}
								style={{ fontSize: '1.75rem' }}
							/>

							<p className={styles.settings}>Delete Selected</p>
						</button>
					)}
				</div>
			</div>
			{loading && <LoadingSpinner message={loadingMessage} />}
			{yoyoModalOpen && <YoyoModal />}
		</>
	);
}

export default Collection;
