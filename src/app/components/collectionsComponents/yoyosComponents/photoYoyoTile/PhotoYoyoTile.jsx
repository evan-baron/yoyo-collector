// Libraries
import React from 'react';

// Styles
import styles from './photoYoyoTile.module.scss';

// Components
import YoyoPhotoScroller from '../yoyoPhotoScroller/YoyoPhotoScroller';
import BlankYoyoPhoto from '@/app/components/blankYoyoPhoto/BlankYoyoPhoto';
import Heart from '@/app/components/icons/heart/Heart';

function PhotoYoyoTile({ yoyoData }) {
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
			{photos.length ? (
				<img className={styles.image} src={displayUrl} />
			) : (
				<div className={styles.image}>
					<BlankYoyoPhoto noBorder={true} />
				</div>
			)}
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
