'use client';

// Libraries
import React, { useState, useEffect } from 'react';

// Utils
import axiosInstance from '@/lib/utils/axios';
import arraySplitter from '@/lib/helpers/arraySplitter';

// Styles
import styles from './collectionPhotos.module.scss';

// Components
import CollectionPhoto from '../collectionPhoto/CollectionPhoto';
import PictureUploader from '../pictureUploader/PictureUploader';
import LoadingSpinner from '../loading/LoadingSpinner';

// Context
import { useAppContext } from '@/app/context/AppContext';

function CollectionPhotos({
	collectionId,
	collectionType,
	scroll,
	size,
	setCoverPhoto,
}) {
	// collection is the collection id

	const { newCollectionCounter, setNewCollectionCounter } = useAppContext();

	const [photos, setPhotos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [splitUpCollection, setSplitUpCollection] = useState([]);
	const [visibleTile, setVisibleTile] = useState(0);
	const [selectedCollection, setSelectedCollection] = useState(1);

	useEffect(() => {
		const fetchCollectionPhotos = async () => {
			try {
				setLoading(true);
				const collectionData = await axiosInstance.get(
					`/api/user/collections/byCollectionId?collectionId=${collectionId}`,
					{
						withCredentials: true,
					}
				);

				const { collectionPhotos } = collectionData.data;

				console.log(collectionPhotos);

				setPhotos(collectionPhotos);

				if (collectionPhotos.length > 4) {
					setSplitUpCollection(arraySplitter(collectionPhotos, 4));
				}
			} catch (error) {
				console.error(
					'There was an error fetching the collectionData',
					error.message
				);
			} finally {
				setLoading(false);
			}
		};
		fetchCollectionPhotos();
	}, [newCollectionCounter]);

	useEffect(() => {
		if (visibleTile + 1 > splitUpCollection.length) {
			setVisibleTile((prev) => prev - 1);
		}
		if (visibleTile + 1 < splitUpCollection.length) {
			setVisibleTile(splitUpCollection.length - 1);
		}
	}, [splitUpCollection]);

	const renderCollections = () => {
		if (photos.length === 0 && !loading) {
			return (
				<div className={styles['collections-tiles']}>
					<PictureUploader uploadType='collection' collection={collectionId} />
				</div>
			);
		}

		if (photos.length > 4 && scroll === 'click') {
			return (
				<div className={styles['photo-tiles-nav']}>
					{splitUpCollection.map((splitCollection, index) => {
						return (
							visibleTile === index && (
								<div className={styles['sub-collection']} key={index}>
									<div className={styles['photo-tiles']}>
										{splitCollection.map((photo, colIndex) => {
											return (
												<CollectionPhoto
													key={colIndex}
													photoData={photo}
													currentUser={true} // Change this when on profiles page, not profile page. This is for current user viewing their own profile, not viewing other people's profiles
													collectionType={collectionType}
												/>
											);
										})}
									</div>
								</div>
							)
						);
					})}
					<div className={styles.dots}>
						{splitUpCollection.map((_, dotIndex) => {
							return (
								<div
									className={`${styles.dot} ${
										visibleTile === dotIndex && styles.selected
									}`}
									key={dotIndex}
									onClick={() => {
										setVisibleTile(dotIndex);
									}}
								></div>
							);
						})}
					</div>
				</div>
			);
		}

		return (
			<div className={styles['photo-tiles']}>
				{collectionType === 'user' && (
					<PictureUploader uploadType='collection' collection={collectionId} />
				)}
				{photos &&
					photos.map((photo, index) => {
						return (
							<CollectionPhoto
								key={index}
								photoData={photo}
								currentUser={true}
								size={size}
								collectionType={collectionType}
								setCoverPhoto={setCoverPhoto}
							/>
						);
					})}
			</div>
		);
	};

	return renderCollections();
}

export default CollectionPhotos;
