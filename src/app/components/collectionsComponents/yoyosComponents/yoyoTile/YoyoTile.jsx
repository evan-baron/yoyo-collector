'use client';

// Libraries
import React from 'react';

// Components
import EditableYoyoTile from '../editableYoyoTile/EditableYoyoTile';
import SummaryYoyoTile from '../summaryYoyoTile/SummaryYoyoTile';
import FullDetailYoyoTile from '../fullDetailYoyoTile/FullDetailYoyoTile';

// Context
import { useAppContext } from '@/app/context/AppContext';

function YoyoTile({
	viewingId, // ADD IN LATER TO PROTECT PRIVATE FIELDS FROM PUBLIC YOYOTILE
	ownerId, // ADD IN LATER TO PROTECT PRIVATE FIELDS FROM PUBLIC YOYOTILE
	displayType, // 'small' = SMALL DETAILS (DEFAULT), 'photos' = PHOTOS ONLY WITH NAME AND COLORWAY, 'full' = BIG TILE WITH PICTURES AND ALL INFO
	yoyoData,
	setSelectedYoyo,
	setSelectedYoyos,
	selectedTile,
}) {
	const { editing, setEditing, setModalOpen, setModalType, dirty, setDirty } =
		useAppContext();

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

	const validLeftItems = left.filter(
		(item) => item && item[1] !== null && item[1] !== ''
	);

	const right = [
		['Original owner', originalOwner],
		['Purchased', purchaseYear],
		['Purchase price', purchasePrice],
		['Approximate value', value],
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
		// setSelectedYoyo(id);
		selectedTile ? setSelectedYoyo(null) : setSelectedYoyo(id);
	};

	return (
		<>
			{!selectedTile && (
				<SummaryYoyoTile
					model={model}
					colorway={colorway}
					brand={brand}
					releaseYear={releaseYear}
					editing={editing}
					handleSelect={handleSelect}
					selectedTile={selectedTile}
				/>
			)}

			{selectedTile && editing && (
				<EditableYoyoTile
					editing={editing}
					yoyoData={yoyoData}
					setSelectedYoyo={setSelectedYoyo}
					setSelectedYoyos={setSelectedYoyos}
					selectedTile={selectedTile}
				/>
			)}

			{selectedTile && !editing && (
				<FullDetailYoyoTile
					selectedTile={selectedTile}
					handleSelect={handleSelect}
					likes={likes}
					validLeftItems={validLeftItems}
					validRightItems={validRightItems}
					condition={condition}
					setEditing={setEditing}
				/>
			)}
		</>
	);
}

export default YoyoTile;
