// Libraries
import React from 'react';

// Styles
import styles from './collectionCarousel.module.scss';

function CollectionCarousel({ type }) {
	return (
		<div className={styles.collection}>
			<h2 className={styles.h2}>{type}</h2>
			<div className={styles['scroll-wrapper']}>
				<div className={styles.carousel}>
					<div className={styles.tile}></div>
					<div className={styles.tile}></div>
					<div className={styles.tile}></div>
					<div className={styles.tile}></div>
					<div className={styles.tile}></div>
					<div className={styles.tile}></div>
					<div className={styles.tile}></div>
					<div className={styles.tile}></div>
				</div>
			</div>
		</div>
	);
}

export default CollectionCarousel;
