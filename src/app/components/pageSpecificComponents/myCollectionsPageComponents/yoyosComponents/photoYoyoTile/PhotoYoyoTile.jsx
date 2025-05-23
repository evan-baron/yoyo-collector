'use client';

// Libraries
import React, { useState, useEffect } from 'react';

// Utils
import axiosInstance from '@/lib/utils/axios';

// Styles
import styles from './photoYoyoTile.module.scss';

// MUI
import { Star, ZoomIn, Edit } from '@mui/icons-material';

// Components
import BlankYoyoPhoto from '@/app/components/blankYoyoPhoto/BlankYoyoPhoto';
import Heart from '@/app/components/icons/heart/Heart';

// Context
import { useAppContext } from '@/app/context/AppContext';

function PhotoYoyoTile({ yoyoData, collectionType, setYoyos }) {
	const {
		user,
		setYoyoModalOpen,
		setYoyoModalType,
		setViewingYoyoData,
		newCollectionCounter,
		setSelectedYoyo,
		setEditingYoyos,
		userFavorites,
		setUserFavorites,
	} = useAppContext();

	const { id, brand, likes, model, photos } = yoyoData;

	const [hover, setHover] = useState(false);
	const [starHover, setStarHover] = useState(false);
	const [currentLikes, setCurrentLikes] = useState(likes);

	useEffect(() => {
		if (!user) return;
		setYoyos((prev) =>
			prev.map((yoyo) =>
				yoyo.id === id ? { ...yoyo, likes: currentLikes } : yoyo
			)
		);
	}, [currentLikes]);

	useEffect(() => {}, [newCollectionCounter]);

	const displayUrl = (() => {
		if (!photos || !photos.length) return null;

		const mainPhotoIndex = photos.findIndex(
			(photo) => photo.main_yoyo_photo === 1
		);

		const fallbackIndex = 0;

		const validIndex = mainPhotoIndex !== -1 ? mainPhotoIndex : fallbackIndex;

		const photoUrl = photos[validIndex]?.secure_url;

		return photoUrl;
	})();

	const handleFavorite = async (e) => {
		e.stopPropagation();
		if (!user) return;

		setUserFavorites((prev) => {
			const updatedType = { ...prev.yoyos };
			delete updatedType[id];

			return {
				...prev,
				yoyos: updatedType,
			};
		});
		try {
			await axiosInstance.delete('/api/favorites', {
				data: {
					favorited_id: id,
					favorited_type: 'yoyos',
				},
				withCredentials: true,
			});
		} catch (error) {
			console.error('Error occurred with liking the photo:', error.message);
		}
		setStarHover(false);
	};

	return (
		<div className={`${styles.container} ${hover && styles.hover}`}>
			<div
				className={styles.image}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
			>
				{photos.length ? (
					<img className={styles.image} src={displayUrl} />
				) : (
					<BlankYoyoPhoto noBorder={true} />
				)}
				<div className={styles.options}>
					<div className={styles.menu}>
						<div className={styles.option}>
							<ZoomIn
								className={`${styles.icon} ${
									collectionType === 'visitor' && styles.visitor
								}`}
								onClick={() => {
									setSelectedYoyo(yoyoData.id);
									setViewingYoyoData(yoyoData);
									setYoyoModalOpen(true);
									setYoyoModalType('view-yoyo');
								}}
							/>
						</div>
						{collectionType !== 'visitor' && (
							<div className={styles.option}>
								<Edit
									className={styles.icon}
									onClick={() => {
										setSelectedYoyo(yoyoData.id);
										setViewingYoyoData(yoyoData);
										setYoyoModalOpen(true);
										setYoyoModalType('edit-yoyo');
										setEditingYoyos(true);
									}}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className={styles.details}>
				<div className={styles.attributes}>
					<h3 className={styles.model}>
						{' '}
						{userFavorites.yoyos[id] && (
							<svg
								viewBox='0 0 24 24'
								className={styles.star}
								onClick={(e) => handleFavorite(e)}
								onMouseEnter={() => setStarHover(true)}
								onMouseLeave={() => setStarHover(false)}
							>
								<path
									d='M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
									className={styles.path}
								/>
							</svg>
						)}
						{model}
					</h3>
					<h3 className={styles.brand}>{brand}</h3>
				</div>
				<div className={styles.likes}>
					<Heart
						size='small'
						likes={currentLikes}
						itemId={id}
						likeType={'yoyos'}
						setLikes={setCurrentLikes}
					/>
					{currentLikes > 0 && <>{currentLikes}</>}
				</div>
			</div>
		</div>
	);
}

export default PhotoYoyoTile;
