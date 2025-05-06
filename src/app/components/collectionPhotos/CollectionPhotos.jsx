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
	size,
	setCoverPhoto,
	editing,
}) {
	// collection is the collection id

	const { newCollectionCounter } = useAppContext();

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
		if (photos.length === 0 && !loading && editing) {
			return (
				<div className={styles['photo-tiles']}>
					<PictureUploader
						key='collection'
						input='collectionInput'
						uploadType='collection'
						collection={collectionId}
					/>
				</div>
			);
		}

		return (
			<div className={styles['photo-tiles']}>
				{collectionType === 'user' && editing && (
					<PictureUploader
						key='collection'
						input='collectionInput'
						uploadType='collection'
						collection={collectionId}
					/>
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
								editing={editing}
							/>
						);
					})}
			</div>
		);
	};

	return renderCollections();
}

export default CollectionPhotos;
