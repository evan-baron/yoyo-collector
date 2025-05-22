'use client';

// Libraries
import React, { useState, useEffect } from 'react';

// Styles
import styles from './collectionPhotos.module.scss';

// Components
import CollectionPhoto from '../collectionPhoto/CollectionPhoto';
import PictureUploader from '@/app/components/pictureUploader/PictureUploader';

// Context
import { useAppContext } from '@/app/context/AppContext';

function CollectionPhotos({
	photos,
	setPhotos,
	collectionId,
	collectionType,
	size,
	setCoverPhoto,
	editing,
}) {
	const { newCollectionCounter } = useAppContext();

	const [loading, setLoading] = useState(true);

	useEffect(() => {}, [newCollectionCounter]);

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
						if (
							photo.upload_category === 'cover' ||
							photo.upload_category === 'collection'
						) {
							return (
								<CollectionPhoto
									key={index}
									photoData={photo}
									currentUser={true}
									size={size}
									collectionType={collectionType}
									setCoverPhoto={setCoverPhoto}
									editing={editing}
									setPhotos={setPhotos}
								/>
							);
						}
					})}
			</div>
		);
	};

	return renderCollections();
}

export default CollectionPhotos;
