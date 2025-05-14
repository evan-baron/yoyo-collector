'use client';

// Libraries
import React, { useState } from 'react';

// Styles
import styles from './yoyoTiles.module.scss';

// MUI
import { North } from '@mui/icons-material';

// Components
import YoyoTile from '../yoyoTile/YoyoTile';
import NewYoyoForm from '../newYoyoForm/NewYoyoForm';

function YoyoTiles({
	yoyos,
	selectedYoyo,
	setSelectedYoyo,
	setSelectedYoyos,
	collectionId,
	editingYoyos,
	addYoyo,
	setAddYoyo,
}) {
	const [sort, setSort] = useState({
		name: {
			selected: false,
			direction: 'ascending',
		},
		manufacturer: {
			selected: true,
			direction: 'ascending',
		},
		year: {
			selected: false,
			direction: 'ascending',
		},
	});
	const [yoyoFormData, setYoyoFormData] = useState({
		collectionId: collectionId,
		model: '',
		brand: '',
		bearing: '',
		color: '',
		year: '',
		originalOwner: '',
		purchased: '',
		price: '',
		category: '',
		responseType: '',
		condition: '',
		value: '',
	});
	const [displayType, setDisplayType] = useState('small');

	const sortKeyMap = {
		name: 'model',
		manufacturer: 'brand',
		year: 'release_year',
	};

	const activeSortKey = Object.keys(sort).find((key) => sort[key].selected);
	const sortDirection = activeSortKey
		? sort[activeSortKey].direction
		: 'ascending';

	const sortPriority = [
		{ key: activeSortKey, direction: sortDirection }, // 1st: user-selected
		{ key: 'name', direction: 'ascending' }, // 2nd: always model name A-Z
		{ key: 'colorway', direction: 'ascending' }, // 3rd: always colorway A-Z
	];

	const sortedYoyos = [...yoyos].sort((a, b) => {
		for (const { key, direction } of sortPriority) {
			const objectKey = sortKeyMap[key] || key;

			let valueA = a[objectKey] ?? '';
			let valueB = b[objectKey] ?? '';

			if (typeof valueA === 'string') valueA = valueA.toLowerCase();
			if (typeof valueB === 'string') valueB = valueB.toLowerCase();

			if (valueA < valueB) return direction === 'ascending' ? -1 : 1;
			if (valueA > valueB) return direction === 'ascending' ? 1 : -1;
		}
		return 0;
	});

	const handleSort = (e) => {
		const { name } = e.target.dataset;
		setSelectedYoyo(null);

		setSort((prev) => {
			const newSort = {};

			for (const key in prev) {
				if (key === name) {
					newSort[key] = {
						selected: true,
						direction:
							prev[key].selected && prev[key].direction === 'ascending'
								? 'descending'
								: 'ascending',
					};
				} else {
					newSort[key] = {
						selected: false,
						direction: 'ascending',
					};
				}
			}

			return newSort;
		});
	};

	return (
		<div className={styles['yoyos-container']}>
			{addYoyo && (
				<NewYoyoForm
					collectionId={collectionId}
					yoyoData={yoyoFormData}
					setYoyoData={setYoyoFormData}
					setAddYoyo={setAddYoyo}
				/>
			)}
			{!addYoyo && (
				<div className={styles.buttons}>
					<div
						className={styles.button}
						onClick={() => {
							setDisplayType('full');
							setSelectedYoyo(null);
						}}
					>
						Photos and Details
					</div>
					<div
						className={styles.button}
						onClick={() => {
							setDisplayType('photos');
							setSelectedYoyo(null);
						}}
					>
						Photos Only
					</div>
					<div
						className={styles.button}
						onClick={() => {
							setDisplayType('small');
							setSelectedYoyo(null);
						}}
					>
						Small Details
					</div>
				</div>
			)}
			<div className={styles.list}>
				<div className={styles.legend}>
					<ul className={`${styles.ul} ${editingYoyos && styles.editing}`}>
						{editingYoyos && (
							<li className={styles.checkbox}>
								<input type='checkbox' className={styles.input} />
							</li>
						)}
						<li
							data-name='name'
							className={`${styles.sort} ${styles.name} ${
								sort.name.selected && styles.selected
							}`}
							onClick={handleSort}
						>
							Model Name
							<North
								className={styles.icon}
								style={{
									transform:
										sort.name.direction === 'descending' && 'rotate(180deg)',
								}}
							/>
						</li>
						<li className={`${styles.sort} ${styles.colorway}`}>Colorway</li>
						<li
							data-name='manufacturer'
							className={`${styles.sort} ${styles.manufacturer} ${
								sort.manufacturer.selected && styles.selected
							}`}
							onClick={handleSort}
						>
							Manufacturer
							<North
								className={styles.icon}
								style={{
									transform:
										sort.manufacturer.direction === 'descending' &&
										'rotate(180deg)',
								}}
							/>
						</li>
						<li
							data-name='year'
							className={`${styles.sort} ${styles.year} ${
								sort.year.selected && styles.selected
							}`}
							onClick={handleSort}
						>
							Released
							<North
								className={styles.icon}
								style={{
									transform:
										sort.year.direction === 'descending' && 'rotate(180deg)',
								}}
							/>
						</li>
					</ul>
				</div>
				{sortedYoyos.map((yoyo, index) => {
					return (
						<div
							className={`${styles.tile} ${
								displayType === 'small' && styles.summary
							}`}
							key={index}
						>
							{editingYoyos && (
								<input type='checkbox' className={styles.checkbox} />
							)}

							<YoyoTile
								yoyoData={yoyo}
								setSelectedYoyo={setSelectedYoyo}
								setSelectedYoyos={setSelectedYoyos}
								displayType={displayType}
								selectedTile={selectedYoyo === yoyo.id}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default YoyoTiles;
