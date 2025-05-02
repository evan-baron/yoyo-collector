'use client';

// Libraries
import React, { useState, useEffect } from 'react';

// Utils
import axiosInstance from '@/lib/utils/axios';

// Styles
import styles from './collectionsTiles.module.scss';

// Components
import CollectionTile from '../collectionTile/CollectionTile';
import NewCollectionTile from '../newCollectionTile/NewCollectionTile';
import LoadingSpinner from '../loading/LoadingSpinner';

// Context
import { useAppContext } from '@/app/context/AppContext';

function CollectionsTiles({ size, collectionType }) {
	const { newCollectionCounter, loading } = useAppContext();

	const [collections, setCollections] = useState(null);

	useEffect(() => {
		const fetchCollections = async () => {
			try {
				const collectionsData = await axiosInstance.get(
					'/api/user/collections',
					{
						withCredentials: true,
					}
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
		// rerendering page when collections increases or decreases
	}, [collections]);

	return (
		<>
			<div
				className={styles['collections-tiles']}
				style={{
					width: size === 'small' ? '' : '100%',
					gap: size === 'small' ? '0 1rem' : '0 2rem',
				}}
			>
				{size !== 'small' && collectionType === 'user' && (
					<NewCollectionTile size={size} />
				)}
				{collections &&
					collections.map((collection, index) => {
						return (
							<CollectionTile
								key={index}
								collectionData={collection}
								currentUser={true}
								size={size}
								collectionType={collectionType}
							/>
						);
					})}
			</div>
			{loading && <LoadingSpinner message='Loading' />}
		</>
	);
}

export default CollectionsTiles;
