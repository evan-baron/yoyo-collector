'use client';

// Libraries
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

// Utils
import axiosInstance from '@/lib/utils/axios';

// Styles
import styles from './collectionPage.module.scss';

// MUI
import { ZoomIn, Share, Star, Search } from '@mui/icons-material';

// Components
import BlankCoverPhoto from '@/app/components/blankCoverPhoto/BlankCoverPhoto';
import Heart from '@/app/components/icons/heart/Heart';
import LoadingSpinner from '@/app/components/loading/LoadingSpinner';
import CollectionPhotos from '@/app/components/pageSpecificComponents/myCollectionsPageComponents/collectionComponents/collectionPhotos/CollectionPhotos';
import YoyoTiles from '@/app/components/pageSpecificComponents/myCollectionsPageComponents/yoyosComponents/yoyoTiles/YoyoTiles';
import YoyoModal from '@/app/components/yoyoModal/YoyoModal';

// Context
import { useAppContext } from '@/app/context/AppContext';

function Collection() {
	const { collectionId } = useParams();

	const router = useRouter();

	//original params were collection, photos
	const {
		user,
		userFavorites,
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
		setUserFavorites,
		setViewingCollectionId,
		setViewPhoto,
	} = useAppContext();

	const [collection, setCollection] = useState({});
	const [privacy, setPrivacy] = useState(null);
	const [privacyChecked, setPrivacyChecked] = useState(false);
	const [photos, setPhotos] = useState([]);
	const [yoyos, setYoyos] = useState([]);
	const [hover, setHover] = useState(false);
	const [currentLikes, setCurrentLikes] = useState(null);
	const [favoriteHover, setFavoriteHove] = useState(false);

	useEffect(() => {
		if (!collectionId) return;

		setViewingCollectionId(collectionId);

		const fetchCollectionData = async () => {
			const response = await axiosInstance.get(
				`/api/user/collections/byCollectionId?collectionId=${collectionId}`
			);
			const {
				collectionData,
				collectionPhotos,
				yoyosData,
				privacy,
				prefer_handle,
			} = response.data;

			if (privacy === 'private') {
				router.push('/');
				return;
			}
			setPrivacyChecked(true);

			const displayName = (() => {
				let name;
				if (prefer_handle === 0) {
					name = collectionData.first_name;
				} else if (prefer_handle === 1) {
					name = collectionData.handle;
				}

				if (privacy === 'public') {
					return name;
				} else {
					return 'Anonymous';
				}
			})();

			collectionData.display_name = displayName;

			setPrivacy(privacy);
			setCollection(collectionData);
			setPhotos(collectionPhotos);
			setYoyos(yoyosData);
			setCurrentLikes(collectionData.likes);
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
		display_name: displayName,
		likes,
		user_id,
	} = collection;

	const link = `/profiles/${user_id}`;

	// States
	const [coverPhoto, setCoverPhoto] = useState(null);
	const [selected, setSelected] = useState('collection');

	// Resets editing state on page load
	useEffect(() => {
		setSelectedYoyo(null);
		setSelectedYoyos([]);
	}, []);

	const handleFavorite = async () => {
		if (!user) return;

		if (!userFavorites.collections[collectionId]) {
			setUserFavorites((prev) => ({
				...prev,
				collections: {
					...prev.collections,
					[collectionId]: true,
				},
			}));
			try {
				await axiosInstance.post(
					'/api/favorites',
					{
						favorited_id: collectionId,
						favorited_type: 'collections',
					},
					{
						withCredentials: true,
					}
				);
			} catch (error) {
				console.error(
					'Error occurred with favoriting the yoyo:',
					error.message
				);
			}
		} else {
			setUserFavorites((prev) => {
				const updatedType = { ...prev.collections };
				delete updatedType[collectionId];

				return {
					...prev,
					collections: updatedType,
				};
			});
			try {
				await axiosInstance.delete('/api/favorites', {
					data: {
						favorited_id: collectionId,
						favorited_type: 'collections',
					},
					withCredentials: true,
				});
			} catch (error) {
				console.error('Error occurred with liking the photo:', error.message);
			}
		}
	};

	const loadingComplete = useMemo(() => {
		return (
			collection?.id && Array.isArray(photos) && privacyChecked && currentLikes
		);
	}, [collection, photos, privacy]);

	if (!loadingComplete) return <LoadingSpinner message='Loading' />;

	return (
		<>
			<div className={styles['collection-container']}>
				<div className={styles.title}>
					<div className={styles['collection-name-box']}>
						<h1 className={styles.h1}>
							{privacy === 'anonymous'
								? 'Anonymous Collection'
								: collectionName}
						</h1>
					</div>

					<div className={styles.details}>
						<h3 className={styles.h3}>Created {created}</h3>
						<p className={styles.likes}>
							<Heart
								likes={currentLikes}
								size='small'
								likeType={'collections'}
								itemId={collectionId}
								setLikes={setCurrentLikes}
							/>
							{currentLikes} likes
						</p>
					</div>

					{privacy === 'public' && (
						<div className={styles.description}>{description}</div>
					)}

					{user && (
						<div
							className={`${styles['favorites-button']} ${
								userFavorites.collections[collectionId] && styles.favorited
							}`}
							onClick={handleFavorite}
							onMouseEnter={() => setFavoriteHove(true)}
							onMouseLeave={() => setFavoriteHove(false)}
						>
							<Star
								className={`${styles.star} ${
									userFavorites.collections[collectionId] && styles.favorited
								} ${favoriteHover && styles.hover}`}
							/>
							{userFavorites.collections[collectionId]
								? 'Favorited!'
								: 'Add to Favorites'}
						</div>
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
										collectionType='visitor'
										scroll='click'
										photos={photos}
										setPhotos={setPhotos}
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
									collectionType={'visitor'}
									setYoyos={setYoyos}
								/>
							</div>
						</section>
					)}
				</div>
			</div>
			{loading && <LoadingSpinner message={loadingMessage} />}
			{yoyoModalOpen && (
				<YoyoModal collectionType={'visitor'} setYoyos={setYoyos} />
			)}
			<Link href={link}>
				<button className={styles['profile-button']}>
					<Search className={styles.icon} style={{ fontSize: '1.75rem' }} />

					<p className={styles.button}>{displayName}'s Profile</p>
				</button>
			</Link>
		</>
	);
}

export default Collection;
