'use client';

// Libraries
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

// Utils
import axiosInstance from '@/lib/utils/axios';

// Styles
import styles from '../../mycollections/[collectionId]/collectionPage.module.scss';

// MUI
import { ZoomIn, Share } from '@mui/icons-material';

// Components
import BlankCoverPhoto from '@/app/components/blankCoverPhoto/BlankCoverPhoto';
import Heart from '@/app/components/icons/heart/Heart';
import LoadingSpinner from '@/app/components/loading/LoadingSpinner';
import CollectionPhotos from '@/app/components/collectionsComponents/collectionComponents/collectionPhotos/CollectionPhotos';
import YoyoTiles from '@/app/components/collectionsComponents/yoyosComponents/yoyoTiles/YoyoTiles';
import YoyoModal from '@/app/components/yoyoModal/YoyoModal';

// Context
import { useAppContext } from '@/app/context/AppContext';

function Collection() {
	const { collectionId } = useParams();

	const router = useRouter();

	//original params were collection, photos
	const {
		editing,
		editingYoyos,
		loading,
		loadingMessage,
		selectedYoyos,
		yoyoModalOpen,
		setModalOpen,
		setModalType,
		setSelectedYoyo,
		setSelectedYoyos,
		setShareLink,
		setViewingCollectionId,
		setViewPhoto,
	} = useAppContext();

	const [collection, setCollection] = useState({});
	const [privacy, setPrivacy] = useState(null);
	const [privacyChecked, setPrivacyChecked] = useState(false);
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
			const { collectionData, collectionPhotos, yoyosData, privacy } =
				response.data;

			if (privacy === 'private') {
				router.push('/');
				return;
			}
			setPrivacyChecked(true);

			console.log(response.data);

			setPrivacy(privacy);
			setCollection(collectionData);
			setPhotos(collectionPhotos);
			setYoyos(yoyosData);
			setCoverPhoto(
				collectionPhotos.find((photo) => photo.upload_category === 'cover')
					?.secure_url
			);
		};
		fetchCollectionData();
	}, [collectionId]);

	const created = dayjs(collection.created_at).format('MMMM, D, YYYY');

	const {
		collection_description: description,
		collection_name: collectionName,
		first_name: first,
		handle,
		likes,
	} = collection;

	// States
	const [coverPhoto, setCoverPhoto] = useState(null);
	const [selected, setSelected] = useState('collection');

	// Resets editing state on page load
	useEffect(() => {
		setSelectedYoyo(null);
		setSelectedYoyos([]);
	}, []);

	const loadingComplete = useMemo(() => {
		return collection?.id && Array.isArray(photos) && privacyChecked;
	}, [collection, photos, privacy]);

	if (!loadingComplete) return <LoadingSpinner message='Loading' />;

	return (
		<>
			<div className={styles['collection-container']}>
				<div className={styles.title}>
					<div className={styles['collection-name-box']}>
						<h1 className={styles.h1}>
							{privacy === 'anonymous'
								? "Anonymous's Collection"
								: collectionName}
						</h1>
					</div>

					<div className={styles.details}>
						<h3 className={styles.h3}>Created {created}</h3>
						<p className={styles.likes}>
							<Heart likes={likes} size='small' />
							{likes} likes
						</p>
					</div>

					{privacy === 'public' && (
						<div className={styles.description}>{description}</div>
					)}
				</div>
				<div className={styles['switch-view']}>
					<div
						className={`${styles.option} ${styles['col-1']}									
										${(selected === 'collection' || !selected) && styles.selected}`}
						onClick={() => {
							if (selected === 'yoyos') {
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
							if (selected === 'yoyos') {
								return;
							} else if (selected === 'collection') {
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
									{selected === 'collection' && coverPhoto ? (
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
									addYoyo={false}
									setAddYoyo={null}
								/>
							</div>
						</section>
					)}
				</div>
			</div>
			{loading && <LoadingSpinner message={loadingMessage} />}
			{yoyoModalOpen && <YoyoModal />}
		</>
	);
}

export default Collection;
