'use client';

// Libraries
import React, { useState, useEffect } from 'react';

// Utils
import axiosInstance from '@/lib/utils/axios';
import arraySplitter from '@/lib/helpers/arraySplitter';

// Styles
import styles from './collectionsTiles.module.scss';

// Components
import CollectionTile from '../collectionTile/CollectionTile';
import NewCollectionTile from '../newCollectionTile/NewCollectionTile';
import LoadingSpinner from '@/app/components/loading/LoadingSpinner';

// Context
import { useAppContext } from '@/app/context/AppContext';

function CollectionsTiles({ scroll, size, collectionType, userName, page }) {
	const { newCollectionCounter } = useAppContext();

	const [loading, setLoading] = useState(true);
	const [collections, setCollections] = useState([]);
	const [splitUpCollection, setSplitUpCollection] = useState([]);
	const [visibleTile, setVisibleTile] = useState(0);
	const [selectedCollection, setSelectedCollection] = useState(1);

	useEffect(() => {
		const fetchCollections = async () => {
			try {
				setLoading(true);
				const collectionsData = await axiosInstance.get(
					'/api/user/collections',
					{
						withCredentials: true,
					}
				);
				setCollections(collectionsData.data);
				if (collectionsData.data.length > 2) {
					setSplitUpCollection(arraySplitter(collectionsData.data, 2));
				}
			} catch (error) {
				console.error(
					'There was an error fetching the collectionsData',
					error.message
				);
			} finally {
				setLoading(false);
			}
		};
		fetchCollections();
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
		if (collections.length === 0 && collectionType === 'user' && !loading) {
			return (
				<div
					className={styles['collections-tiles']}
					style={{
						width: size === 'small' ? '100%' : '100%',
						gap: size === 'small' ? '0 1rem' : '0 2rem',
					}}
				>
					<NewCollectionTile size={size} />
				</div>
			);
		}

		if (collections.length > 2 && scroll === 'click') {
			return (
				<div className={styles['collections-tiles-nav']}>
					{splitUpCollection.map((splitCollection, index) => {
						return (
							visibleTile === index && (
								<div className={styles['sub-collection']} key={index}>
									<div
										className={styles['collections-tiles']}
										style={{
											width: size === 'small' ? '' : '100%',
											gap: size === 'small' ? '0 1rem' : '0 2rem',
										}}
									>
										{splitCollection.map((collection, colIndex) => {
											return (
												<CollectionTile
													key={colIndex}
													collectionData={collection}
													currentUser={true} // Change this when on profiles page, not profile page. This is for current user viewing their own profile, not viewing other people's profiles
													collectionType={collectionType}
													size={size}
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
			<div
				className={styles['collections-tiles']}
				style={{
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
		);
	};

	// Loading screen
	const loadingComplete = !!(collections && splitUpCollection && !loading);

	if (!loadingComplete) return <LoadingSpinner message='Loading' />;

	return (
		<>
			{page === 'profile' && (
				<h2 className={styles.h2}>
					{collectionType === 'user' ? 'Your' : `${userName}'s`}{' '}
					{collections.length > 1 ? 'Collections' : 'Collection'}:
				</h2>
			)}
			{renderCollections()}
		</>
	);
}

export default CollectionsTiles;
