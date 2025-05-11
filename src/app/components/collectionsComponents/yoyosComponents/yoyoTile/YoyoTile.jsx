'use client';

// Libraries
import React, { useState } from 'react';

// Styles
import styles from './yoyoTile.module.scss';

function YoyoTile({
	viewingId, // ADD IN LATER TO PROTECT PRIVATE FIELDS FROM PUBLIC YOYOTILE
	ownerId, // ADD IN LATER TO PROTECT PRIVATE FIELDS FROM PUBLIC YOYOTILE
	displayType, // 'small' = SMALL DETAILS (DEFAULT), 'photos' = PHOTOS ONLY WITH NAME AND COLORWAY, 'full' = BIG TILE WITH PICTURES AND ALL INFO
	editing,
	yoyoData,
	setSelectedYoyo,
	setSelectedYoyos,
}) {
	const {
		id,
		bearing,
		brand,
		category,
		colorway,
		likes,
		model,
		original_owner: originalOwner,
		purchase_price: purchasePrice,
		purchase_year: purchaseYear,
		release_year: releaseYear,
		response_type: responseType,
		yoyo_condition: condition,
		yoyo_value: value,
	} = yoyoData;

	const handleSelect = () => {
		console.log(yoyoData);
		setSelectedYoyo(id);
	};

	return (
		<div className={styles.tile} onClick={handleSelect}>
			<div className={styles.legend}>
				<ul className={`${styles.ul} ${editing && styles.editing}`}>
					{editing && (
						<li className={styles.checkbox}>
							<input type='checkbox' className={styles.input} />
						</li>
					)}
					<li className={styles.name}>{model}</li>
					<li className={styles.colorway}>{colorway}</li>
					<li className={styles.manufacturer}>{brand}</li>
					<li className={styles.year}>{releaseYear}</li>
				</ul>
			</div>
		</div>
	);
}

export default YoyoTile;
