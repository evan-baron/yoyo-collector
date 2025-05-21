'use client';

// Libraries
import React, { useState } from 'react';

// Styles
import styles from './topOrNew.module.scss';

// Components
import CollectionCarousel from '@/app/components/collectionCarousel/CollectionCarousel';

function TopOrNew({ top, newest }) {
	const [selected, setSelected] = useState('top');

	return (
		<div className={styles.container}>
			<div className={styles['switch-view']}>
				<h2
					className={`${styles.option} ${styles['col-1']}									
										${(selected === 'top' || !selected) && styles.selected}`}
					onClick={() => {
						if (selected === 'new') {
							setSelected('top');
						} else if (selected === 'top') {
							return;
						}
					}}
				>
					Top Collections
				</h2>
				<div className={styles.divider}></div>
				<h2
					className={`${styles.option} ${styles['col-2']}	 									
										${(selected === 'new' || !selected) && styles.selected}`}
					onClick={() => {
						if (selected === 'new') {
							return;
						} else if (selected === 'top') {
							setSelected('new');
						}
					}}
				>
					Newest Collections
				</h2>
			</div>
			{selected === 'top' ? (
				<CollectionCarousel collections={top} />
			) : (
				<CollectionCarousel collections={newest} />
			)}
		</div>
	);
}

export default TopOrNew;
