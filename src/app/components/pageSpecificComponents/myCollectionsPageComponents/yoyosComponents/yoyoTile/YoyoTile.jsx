'use client';

// Libraries
import React from 'react';

// Components
import EditableYoyoTile from '../editableYoyoTile/EditableYoyoTile';
import SummaryYoyoTile from '../summaryYoyoTile/SummaryYoyoTile';
import FullDetailYoyoTile from '../fullDetailYoyoTile/FullDetailYoyoTile';

// Context
import { useAppContext } from '@/app/context/AppContext';

function YoyoTile({ yoyoData, selectedTile, collectionType, setYoyos }) {
	const {
		editingYoyos,
		setModalOpen,
		setModalType,
		dirty,
		yoyoDisplayType,
		setCurrentlyEditing,
		setSelectedYoyo,
	} = useAppContext();

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

	const handleSelect = () => {
		if (dirty) {
			setModalOpen(true);
			setModalType('dirty');
			return;
		}
		setSelectedYoyo(id);
		// selectedTile ? setSelectedYoyo(null) : setSelectedYoyo(id);
		setCurrentlyEditing(null);
	};

	return (
		<>
			{yoyoDisplayType === 'small' && (
				<>
					{!selectedTile && (
						<SummaryYoyoTile
							model={model}
							colorway={colorway}
							brand={brand}
							releaseYear={releaseYear}
							editing={editingYoyos}
							handleSelect={handleSelect}
							selectedTile={selectedTile}
							yoyoId={id}
							collectionType={collectionType}
						/>
					)}

					{selectedTile && editingYoyos && (
						<EditableYoyoTile yoyoData={yoyoData} />
					)}

					{selectedTile && !editingYoyos && (
						<FullDetailYoyoTile
							selectedTile={selectedTile}
							handleSelect={handleSelect}
							validLeftItems={validLeftItems}
							validRightItems={validRightItems}
							yoyoData={yoyoData}
							setYoyos={setYoyos}
							collectionType={collectionType}
						/>
					)}
				</>
			)}

			{yoyoDisplayType === 'full' && (
				<>
					{!selectedTile && (
						<FullDetailYoyoTile
							selectedTile={selectedTile}
							handleSelect={null}
							validLeftItems={validLeftItems}
							validRightItems={validRightItems}
							yoyoData={yoyoData}
							setYoyos={setYoyos}
							collectionType={collectionType}
						/>
					)}

					{selectedTile && editingYoyos && (
						<EditableYoyoTile yoyoData={yoyoData} />
					)}

					{selectedTile && !editingYoyos && (
						<FullDetailYoyoTile
							selectedTile={selectedTile}
							handleSelect={null}
							validLeftItems={validLeftItems}
							validRightItems={validRightItems}
							yoyoData={yoyoData}
							setYoyos={setYoyos}
							collectionType={collectionType}
						/>
					)}
				</>
			)}
		</>
	);
}

export default YoyoTile;
