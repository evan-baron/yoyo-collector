'use client';

// Libraries
import React, { useState, useEffect } from 'react';

// Styles
import styles from './photoYoyoTile.module.scss';

// MUI
import { Share, ZoomIn, Edit } from '@mui/icons-material';

// Components
import BlankYoyoPhoto from '@/app/components/blankYoyoPhoto/BlankYoyoPhoto';
import Heart from '@/app/components/icons/heart/Heart';

// Context
import { useAppContext } from '@/app/context/AppContext';

function PhotoYoyoTile({ yoyoData }) {
	const {
		setYoyoModalOpen,
		setYoyoModalType,
		setViewingYoyoData,
		newCollectionCounter,
		setSelectedYoyo,
		setEditingYoyos,
	} = useAppContext();

	useEffect(() => {}, [newCollectionCounter]);

	const { brand, likes, model, photos } = yoyoData;

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

	return (
		<div className={styles.container}>
			<div className={styles.image}>
				{photos.length ? (
					<img className={styles.image} src={displayUrl} />
				) : (
					<BlankYoyoPhoto noBorder={true} />
				)}
				<div className={styles.options}>
					<div className={styles.menu}>
						<div
							className={styles.option}
							onClick={() => {
								console.log('zoom action');
							}}
						>
							<ZoomIn
								className={styles.icon}
								onClick={() => {
									setSelectedYoyo(yoyoData.id);
									setViewingYoyoData(yoyoData);
									setYoyoModalOpen(true);
									setYoyoModalType('view-yoyo');
								}}
							/>
						</div>
						<div
							className={styles.option}
							onClick={() => {
								console.log('zoom action');
							}}
						>
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
					</div>
				</div>
			</div>
			<div className={styles.details}>
				<div className={styles.attributes}>
					<h3 className={styles.model}>{model}</h3>
					<h3 className={styles.brand}>{brand}</h3>
				</div>
				<div className={styles.likes}>
					<Heart size='small' likes={likes} />
					{likes > 0 && (
						<>
							{likes} {likes === 1 ? 'like' : 'likes'}
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default PhotoYoyoTile;
