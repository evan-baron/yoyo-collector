'use client';

// Libraries
import React, { useState } from 'react';

// Styles
import styles from './yoyoTile.module.scss';

// MUI
import { Edit } from '@mui/icons-material';

// Components
import BlankYoyoPhoto from '@/app/components/blankYoyoPhoto/BlankYoyoPhoto';
import Heart from '@/app/components/icons/heart/Heart';
import EditableYoyoTile from '../editableYoyoTile/EditableYoyoTile';

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
		setSelectedYoyo(id);
		// selectedTile ? setSelectedYoyo(null) : setSelectedYoyo(id);
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
			) : editing ? (
				<EditableYoyoTile
					editing={editing}
					yoyoData={yoyoData}
					setSelectedYoyo={setSelectedYoyo}
					setSelectedYoyos={setSelectedYoyos}
					selectedTile={selectedTile}
				/>
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
							{validLeftItems.length > 0 && (
								<div className={styles.left}>
									{validLeftItems.map((item, index) => {
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
							)}
							{validRightItems.length > 0 && (
								<div className={styles.right}>
									{validRightItems.map((item, index) => {
										console.log(
											'Original owner value:',
											item[1],
											typeof item[1]
										);

										return (
											<div key={index} className={styles.attribute}>
												<label className={styles.label} htmlFor={item[1]}>
													{item[0]}:
												</label>
												<p>
													{item[0] === 'Original owner'
														? String(item[1]) === '0'
															? 'No'
															: String(item[1]) === '1'
															? 'Yes'
															: ''
														: item[1]}
												</p>{' '}
											</div>
										);
									})}
								</div>
							)}
						</div>
						{condition && (
							<div className={styles.about}>
								<div className={styles.attribute}>
									<label className={styles.label} htmlFor='condition'>
										About the yoyo:
									</label>
									<p>{condition}</p>
								</div>
							</div>
						)}
						<Edit className={styles.edit} onClick={() => setEditing(true)} />
						{/* MAKE THIS CONDITIONAL SO ONLY COLLECTION OWNER CAN SEE THIS */}
					</div>
				</div>
			)}
		</>
	);
}

export default YoyoTile;
