'use client';

// Libraries
import React, { useState, useEffect } from 'react';

// Styles
import styles from './yoyoPhotoScroller.module.scss';

// MUI
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';

// Components
import PhotoOptions from '@/app/components/photoOptions/PhotoOptions';
import BlankYoyoPhoto from '@/app/components/blankYoyoPhoto/BlankYoyoPhoto';

// Context
import { useAppContext } from '@/app/context/AppContext';

function YoyoPhotoScroller({ displayType, optionsSize, photos }) {
	const { yoyoModalOpen } = useAppContext();

	const mainIndex = photos.findIndex((photo) => photo.main_yoyo_photo === 1);
	const [displayPhoto, setDisplayPhoto] = useState(
		mainIndex !== -1 ? mainIndex : 0
	);

	useEffect(() => {
		if (photos.length === 0) return;

		// Reset to 0 if displayPhoto is now out of bounds
		if (displayPhoto >= photos.length) {
			setDisplayPhoto(photos.length - 1);
		}
	}, [photos, displayPhoto]);

	const handleChange = (e) => {
		e.stopPropagation();
		const { name } = e.currentTarget.dataset;

		if (name === 'increment') {
			if (displayPhoto === photos.length - 1) {
				setDisplayPhoto(0);
			} else {
				setDisplayPhoto((prev) => prev + 1);
			}
			return;
		}

		if (name === 'decrement') {
			if (displayPhoto === 0) {
				setDisplayPhoto(photos.length - 1);
			} else {
				setDisplayPhoto((prev) => prev - 1);
			}
			return;
		}
	};

	return (
		<div className={styles['photo-scroller']}>
			{photos.length > 1 && (
				<div
					data-name='decrement'
					className={styles.arrow}
					onClick={handleChange}
				>
					<ArrowBackIosNew className={styles.icon} />
				</div>
			)}
			<div
				className={`${styles['image-box']} ${
					displayType === 'photo' && styles['photo-tile']
				} ${yoyoModalOpen && styles['yoyo-modal']}`}
			>
				{photos.length > 0 && photos[displayPhoto] ? (
					<>
						<img
							src={photos[displayPhoto].secure_url}
							className={styles.image}
						/>
						<PhotoOptions
							// displayType={displayType}
							optionsSize={optionsSize}
							photo={photos[displayPhoto]}
						/>
					</>
				) : (
					<BlankYoyoPhoto />
				)}
			</div>
			{photos.length > 1 && (
				<div
					data-name='increment'
					className={styles.arrow}
					onClick={handleChange}
				>
					<ArrowForwardIos className={styles.icon} />
				</div>
			)}
		</div>
	);
}

export default YoyoPhotoScroller;
