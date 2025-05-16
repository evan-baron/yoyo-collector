'use client';

// Libraries
import React, { useState } from 'react';

// Styles
import styles from './yoyoPhotoScroller.module.scss';

// MUI
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';

// Components
import PhotoOptions from '@/app/components/photoOptions/PhotoOptions';

function YoyoPhotoScroller({ optionsSize, photos }) {
	const mainIndex = photos.findIndex((photo) => photo.main_yoyo_photo === 1);
	const [displayPhoto, setDisplayPhoto] = useState(
		mainIndex !== -1 ? mainIndex : 0
	);

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
			<div className={styles['image-box']}>
				<img src={photos[displayPhoto].secure_url} className={styles.image} />
				<PhotoOptions optionsSize={optionsSize} photo={photos[displayPhoto]} />
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
