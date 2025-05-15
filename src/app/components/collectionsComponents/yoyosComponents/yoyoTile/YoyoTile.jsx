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
	setSelectedYoyos,
	selectedTile,
}) {
	const {
		editingYoyos,
		setEditingYoyos,
		setModalOpen,
		setModalType,
		dirty,
		setDirty,
		setCurrentlyEditing,
		selectedYoyo,
		setSelectedYoyo,
	} = useAppContext();

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
		setCurrentlyEditing(null);
	};

	return (
		<>
			{displayType === 'small' && (
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
						/>
					)}

					{selectedTile && editingYoyos && (
						<EditableYoyoTile
							editing={editingYoyos}
							yoyoData={yoyoData}
							setSelectedYoyos={setSelectedYoyos}
							selectedTile={selectedTile}
							handleSelect={handleSelect}
						/>
					)}

					{selectedTile && !editingYoyos && (
						<FullDetailYoyoTile
							selectedTile={selectedTile}
							handleSelect={handleSelect}
							likes={likes}
							validLeftItems={validLeftItems}
							validRightItems={validRightItems}
							condition={condition}
							setEditingYoyos={setEditingYoyos}
							editingYoyos={editingYoyos}
							yoyoId={id}
						/>
					)}
				</>
			)}

			{displayType === 'photos' && (
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
						/>
					)}

					{selectedTile && editingYoyos && (
						<EditableYoyoTile
							editing={editingYoyos}
							yoyoData={yoyoData}
							setSelectedYoyos={setSelectedYoyos}
							selectedTile={selectedTile}
							handleSelect={handleSelect}
						/>
					)}

					{selectedTile && !editingYoyos && (
						<FullDetailYoyoTile
							selectedTile={selectedTile}
							handleSelect={handleSelect}
							likes={likes}
							validLeftItems={validLeftItems}
							validRightItems={validRightItems}
							condition={condition}
							setEditingYoyos={setEditingYoyos}
							editingYoyos={editingYoyos}
							yoyoId={id}
						/>
					)}
				</>
			)}

			{displayType === 'full' && (
				<>
					{!selectedTile && (
						<FullDetailYoyoTile
							selectedTile={selectedTile}
							handleSelect={handleSelect}
							likes={likes}
							validLeftItems={validLeftItems}
							validRightItems={validRightItems}
							condition={condition}
							setEditingYoyos={setEditingYoyos}
							editingYoyos={editingYoyos}
							yoyoId={id}
						/>
					)}

					{selectedTile && editingYoyos && (
						<EditableYoyoTile
							editing={editingYoyos}
							yoyoData={yoyoData}
							setSelectedYoyos={setSelectedYoyos}
							selectedTile={selectedTile}
							handleSelect={handleSelect}
						/>
					)}

					{selectedTile && !editingYoyos && (
						<>
							<FullDetailYoyoTile
								selectedTile={selectedTile}
								handleSelect={handleSelect}
								likes={likes}
								validLeftItems={validLeftItems}
								validRightItems={validRightItems}
								condition={condition}
								setEditingYoyos={setEditingYoyos}
								editingYoyos={editingYoyos}
								yoyoId={id}
							/>
						</>
					)}
				</>
			)}
		</>
	);
}

export default YoyoTile;
