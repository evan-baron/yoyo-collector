'use client';

// Libraries
import React, { useState } from 'react';

// Styles
import styles from './yoyoTile.module.scss';

// MUI
import { Edit, Undo } from '@mui/icons-material';

// Components
import BlankYoyoPhoto from '@/app/components/blankYoyoPhoto/BlankYoyoPhoto';
import Heart from '@/app/components/icons/heart/Heart';

function YoyoTile({
	viewingId, // ADD IN LATER TO PROTECT PRIVATE FIELDS FROM PUBLIC YOYOTILE
	ownerId, // ADD IN LATER TO PROTECT PRIVATE FIELDS FROM PUBLIC YOYOTILE
	displayType, // 'small' = SMALL DETAILS (DEFAULT), 'photos' = PHOTOS ONLY WITH NAME AND COLORWAY, 'full' = BIG TILE WITH PICTURES AND ALL INFO
	editing,
	yoyoData,
	setSelectedYoyo,
	setSelectedYoyos,
	selectedTile,
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

	const left = [
		['Model', model],
		['Brand', brand],
		['Colorway', colorway],
		['Category', category],
		['Released', releaseYear],
		['Response', responseType],
		['Bearing', bearing],
	];
	const right = [
		['Original owner', originalOwner],
		['Purchased', purchaseYear],
		['Purchase price', purchasePrice],
		['Approximate value', value],
	];

	const handleSelect = () => {
		console.log(yoyoData);
		console.log(selectedTile);
		selectedTile ? setSelectedYoyo(null) : setSelectedYoyo(id);
	};

	return (
		<>
			{!selectedTile ? (
				<div
					className={`${styles.tile} ${selectedTile && styles.selected}`}
					onClick={handleSelect}
				>
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
			) : (
				<div
					className={`${styles.tile} ${selectedTile && styles.selected}`}
					onClick={handleSelect}
				>
					<div className={styles['image-box']}>
						<div className={styles.image}>
							<BlankYoyoPhoto />
						</div>
						<div className={styles.likes}>
							<Heart size='small' likes={likes} />
							{likes > 0 && (
								<>
									{likes} {likes && likes === 1 ? 'like' : 'likes'}
								</>
							)}
						</div>
					</div>
					<div className={styles['content-box']}>
						<div className={styles.details}>
							<div className={styles.left}>
								{left.map((item, index) => {
									return (
										<div key={index} className={styles.attribute}>
											<label className={styles.label} htmlFor={item[1]}>
												{item[0]}:
											</label>
											<p>{item[1]}</p>
										</div>
									);
								})}
							</div>
							<div className={styles.right}>
								{right.map((item, index) => {
									return (
										<div key={index} className={styles.attribute}>
											<label className={styles.label} htmlFor={item[1]}>
												{item[0]}:
											</label>
											<p>
												{item[0] === 'Original owner'
													? item[1] === 0
														? 'No'
														: 'Yes'
													: item[1]}
											</p>
										</div>
									);
								})}
							</div>
						</div>
						<div className={styles.about}>
							<div className={styles.attribute}>
								<label className={styles.label} htmlFor='condition'>
									About the yoyo:
								</label>
								<p>{condition}</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default YoyoTile;
