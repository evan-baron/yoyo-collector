'use client';

// Libraries
import React, { useState, useEffect } from 'react';

// Utils
import axiosInstance from '@/utils/axios';

// Styles
import styles from './myCollectionsTiles.module.scss';

// Components
import CollectionTile from '../collectionTile/CollectionTile';
import NewCollectionTile from '../newCollectionTile/NewCollectionTile';
import LoadingSpinner from '../loading/LoadingSpinner';

// Context
import { useAppContext } from '@/app/context/AppContext';

function MyCollectionsTiles() {
	const { newCollectionCounter, loading } = useAppContext();

	const [collections, setCollections] = useState(null);

	useEffect(() => {
		const fetchCollections = async () => {
			try {
				const collectionsData = await axiosInstance.get(
					'/api/user/collections'
				);
				setCollections(collectionsData.data);
			} catch (error) {
				console.error(
					'There was an error fetching the collectionsData',
					error.message
				);
			}
		};
		fetchCollections();
	}, [newCollectionCounter]);

	useEffect(() => {
		console.log(collections);
	}, [collections]);

	return (
		<>
			<div className={styles['collections-tiles']}>
				{collections &&
					collections.map((collection, index) => {
						return <CollectionTile key={index} collectionData={collection} />;
					})}
				<NewCollectionTile />
			</div>
			{loading && <LoadingSpinner message='Loading' />}
		</>
	);
}

export default MyCollectionsTiles;
