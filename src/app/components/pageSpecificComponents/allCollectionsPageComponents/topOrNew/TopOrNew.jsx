'use client';

// Libraries
import React, { useState } from 'react';

// Styles
import styles from './topOrNew.module.scss';

// Components
import CollectionCarousel from '@/app/components/collectionCarousel/CollectionCarousel';

function TopOrNew({ top, newest, favorites }) {
	const [selected, setSelected] = useState('top');

	return (
		<div className={styles.container}>
			<div className={styles['switch-view']}>
				<h2
					className={`${styles.option}								
										${(selected === 'top' || !selected) && styles.selected}`}
					onClick={() => {
						if (selected === 'top') {
							return;
						} else {
							setSelected('top');
						}
					}}
				>
					Top Collections
				</h2>
				<div className={styles.divider}></div>
				<h2
					className={`${styles.option}									
										${(selected === 'new' || !selected) && styles.selected}`}
					onClick={() => {
						if (selected === 'new') {
							return;
						} else {
							setSelected('new');
						}
					}}
				>
					Newest Collections
				</h2>
				{favorites.length > 0 && (
					<>
						<div className={styles.divider}></div>
						<h2
							className={`${styles.option}	 									
										${(selected === 'favorites' || !selected) && styles.selected}`}
							onClick={() => {
								if (selected === 'favorites') {
									return;
								} else {
									setSelected('favorites');
								}
							}}
						>
							My Favorites
						</h2>
					</>
				)}
			</div>
			{selected === 'top' && <CollectionCarousel collections={top} />}
			{selected === 'new' && <CollectionCarousel collections={newest} />}
			{selected === 'favorites' && (
				<CollectionCarousel collections={favorites} />
			)}
		</div>
	);
}

export default TopOrNew;
