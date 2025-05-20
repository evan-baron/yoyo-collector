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

function CollectionsTiles({
	profileId, // userId of the collection owner
	scroll, // 'click' or 'scroll' - controls if use carousel or not
	size, // 'small' or not small - controls size of the tiles
	collectionType, // 'user' or 'visitor' - controls UI/UX
	userName, // either the user's name or Anonymous if their profile privacy is anonymous
	page, // 'profile' or not profile - used to determine if h2 is present
	privacy, // privacy of the collection owner
}) {
	const { newCollectionCounter } = useAppContext();

	const [loading, setLoading] = useState(true);
	const [collections, setCollections] = useState([]);
	const [splitUpCollection, setSplitUpCollection] = useState([]);
	const [visibleTile, setVisibleTile] = useState(0);

	useEffect(() => {
		const fetchCollections = async () => {
			try {
				setLoading(true);

				if (collectionType === 'user') {
					const collectionsData = await axiosInstance.get(
						'/api/user/collections',
						{
							withCredentials: true,
						}
					);
					const allCollections = collectionsData.data;
					setCollections(allCollections);

					if (allCollections.length > 2) {
						const split = arraySplitter(allCollections, 2);
						setSplitUpCollection(split);
						setVisibleTile(0);
					} else {
						setSplitUpCollection([]);
						setVisibleTile(0);
					}
				} else {
					const collectionsData = await axiosInstance.get(
						`/api/user/collections?profileId=${profileId}`
					);

					const allCollections = collectionsData.data;
					setCollections(allCollections);

					if (allCollections.length > 2) {
						const split = arraySplitter(allCollections, 2);
						setSplitUpCollection(split);
						setVisibleTile(0);
					} else {
						setSplitUpCollection([]);
						setVisibleTile(0);
					}
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
		if (visibleTile + 1 < splitUpCollection.length) {
			setVisibleTile(splitUpCollection.length - 1);
			return;
		}
		if (visibleTile + 1 > splitUpCollection.length) {
			setVisibleTile((prev) => prev - 1);
			return;
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
													collectionType={collectionType}
													size={size}
													privacy={privacy}
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
								size={size}
								collectionType={collectionType}
								privacy={privacy}
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
