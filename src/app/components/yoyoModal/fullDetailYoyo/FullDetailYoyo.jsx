'use client';

// Libraries
import React from 'react';

// Styles
import styles from './fullDetailYoyo.module.scss';

// Components
import FullDetailYoyoTile from '../../pageSpecificComponents/myCollectionsPageComponents/yoyosComponents/fullDetailYoyoTile/FullDetailYoyoTile';

// Context
import { useAppContext } from '@/app/context/AppContext';

function FullDetailYoyo({ collectionType }) {
	const { viewingYoyoData } = useAppContext();

	const {
		id,
		bearing,
		brand,
		category,
		colorway,
		model,
		original_owner: originalOwner,
		purchase_price: purchasePrice,
		purchase_year: purchaseYear,
		release_year: releaseYear,
		response_type: responseType,
		yoyo_value: value,
	} = viewingYoyoData;

	const left = [
		['Model', model],
		['Brand', brand],
		['Colorway', colorway],
		['Category', category],
		['Released', releaseYear],
		['Response', responseType],
		['Bearing', bearing],
	];

	const validLeftItems = left.filter(
		(item) => item && item[1] !== null && item[1] !== ''
	);

	const right = [
		['Original owner', originalOwner],
		...(collectionType !== 'visitor'
			? [
					['Purchased', purchaseYear],
					['Purchase price', purchasePrice],
					['Approximate value', value],
			  ]
			: []),
	];

	const validRightItems = right.filter(
		(item) => item && item[1] !== null && item[1] !== ''
	);

	return (
		<div className={styles.container}>
			<FullDetailYoyoTile
				selectedTile={true}
				handleSelect={null}
				validLeftItems={validLeftItems}
				validRightItems={validRightItems}
				yoyoData={viewingYoyoData}
			/>
		</div>
	);
}

export default FullDetailYoyo;
