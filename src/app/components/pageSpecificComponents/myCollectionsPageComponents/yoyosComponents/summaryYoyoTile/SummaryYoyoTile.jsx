// Libraries
import React from 'react';

// Styles
import styles from './summaryYoyoTile.module.scss'; // or use your existing styles file

const SummaryYoyoTile = ({
	model,
	colorway,
	brand,
	releaseYear,
	editing,
	handleSelect,
	selectedTile,
}) => {
	return (
		<div
			className={`${styles.tile} ${selectedTile ? styles.selected : ''} ${
				editing ? styles.editing : ''
			}`}
			onClick={handleSelect}
		>
			<div className={styles.legend}>
				<ul className={`${styles.ul} ${editing ? styles.editing : ''}`}>
					<li className={styles.name}>{model}</li>
					<li className={styles.colorway}>{colorway}</li>
					<li className={styles.manufacturer}>{brand}</li>
					<li className={styles.year}>{releaseYear}</li>
				</ul>
			</div>
		</div>
	);
};

export default SummaryYoyoTile;
