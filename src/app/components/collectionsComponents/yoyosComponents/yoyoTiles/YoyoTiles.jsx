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
import PhotoYoyoTile from '../photoYoyoTile/PhotoYoyoTile';
import PhotoOptions from '@/app/components/photoOptions/PhotoOptions';

// Context
import { useAppContext } from '@/app/context/AppContext';

function YoyoTiles({
	yoyos,
	setSelectedYoyos,
	selectedYoyos,
	editingYoyos,
	addYoyo,
	setAddYoyo,
	added,
	setAdded,
}) {
	const {
		dirty,
		setModalOpen,
		setModalType,
		selectedYoyo,
		setSelectedYoyo,
		viewingCollectionId,
		yoyoDisplayType,
		setYoyoDisplayType,
	} = useAppContext();

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
		collectionId: viewingCollectionId,
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
		if (editingYoyos && selectedYoyo) {
			return;
		}
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

	const handleChange = (e, yoyoId) => {
		const isChecked = e.target.checked;

		setSelectedYoyos((prev) => {
			if (isChecked) {
				return [...prev, yoyoId];
			} else {
				return prev.filter((id) => id !== yoyoId);
			}
		});
	};

	const handleSelectAll = (e) => {
		const isChecked = e.target.checked;

		if (isChecked) {
			setSelectedYoyos(yoyos.map((yoyo) => yoyo.id));
		} else {
			setSelectedYoyos([]);
		}
	};

	return (
		<div className={styles['yoyos-container']}>
			{addYoyo && (
				<NewYoyoForm
					yoyoData={yoyoFormData}
					setYoyoData={setYoyoFormData}
					setAddYoyo={setAddYoyo}
					added={added}
					setAdded={setAdded}
				/>
			)}
			{!addYoyo && (
				<div className={styles.buttons}>
					<div
						className={`${styles.button} ${
							yoyoDisplayType === 'small' && styles['selected-view']
						}`}
						onClick={() => {
							if (yoyoDisplayType === 'small') {
								return;
							}
							if (dirty) {
								setModalOpen(true);
								setModalType('dirty');
								return;
							}
							setYoyoDisplayType('small');
							setSelectedYoyo(null);
						}}
					>
						Small Details
					</div>
					<div
						className={`${styles.button} ${
							yoyoDisplayType === 'full' && styles['selected-view']
						}`}
						onClick={() => {
							if (yoyoDisplayType === 'full') {
								return;
							}
							if (dirty) {
								setModalOpen(true);
								setModalType('dirty');
								return;
							}
							setYoyoDisplayType('full');
							setSelectedYoyo(null);
						}}
					>
						Full Details
					</div>
					<div
						className={`${styles.button} ${
							yoyoDisplayType === 'photos' && styles['selected-view']
						}`}
						onClick={() => {
							if (yoyoDisplayType === 'photos') {
								return;
							}
							if (dirty) {
								setModalOpen(true);
								setModalType('dirty');
								return;
							}
							setYoyoDisplayType('photos');
							setSelectedYoyo(null);
						}}
					>
						Photos Only
					</div>
				</div>
			)}
			<div
				className={`${styles.list} ${
					yoyoDisplayType === 'photos' && styles['photos-list']
				}`}
			>
				<div
					className={`${styles.legend} ${
						yoyoDisplayType === 'photos' && styles['photos-legend']
					}`}
				>
					<ul
						className={`${styles.ul} ${editingYoyos && styles.editing} ${
							yoyoDisplayType === 'photos' && styles['photos-ul']
						}`}
					>
						{editingYoyos && yoyoDisplayType !== 'photos' && (
							<li className={styles.checkbox}>
								<input
									type='checkbox'
									className={styles.input}
									onClick={(e) => handleSelectAll(e)}
								/>
							</li>
						)}
						<li
							data-name='name'
							className={`${styles.sort} ${styles.name} ${
								sort.name.selected && styles.selected
							} ${yoyoDisplayType === 'photos' && styles['photos-li']}`}
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
						{yoyoDisplayType !== 'photos' && (
							<li className={`${styles.sort} ${styles.colorway}`}>Colorway</li>
						)}
						<li
							data-name='manufacturer'
							className={`${styles.sort} ${styles.manufacturer} ${
								sort.manufacturer.selected && styles.selected
							} ${yoyoDisplayType === 'photos' && styles['photos-li']}`}
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
						{yoyoDisplayType !== 'photos' && (
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
						)}
					</ul>
				</div>
				{yoyoDisplayType !== 'photos' ? (
					sortedYoyos.map((yoyo, index) => {
						return (
							<div className={styles.tile} key={index}>
								{editingYoyos && (
									<input
										name='checkbox'
										type='checkbox'
										className={styles.checkbox}
										onChange={(e) => handleChange(e, yoyo.id)}
										checked={selectedYoyos.includes(yoyo.id)}
									/>
								)}

								<YoyoTile
									yoyoData={yoyo}
									setSelectedYoyos={setSelectedYoyos}
									selectedTile={selectedYoyo === yoyo.id}
									added={added}
									setAdded={setAdded}
								/>
							</div>
						);
					})
				) : (
					<div className={styles['photos-container']}>
						{sortedYoyos.map((yoyo, index) => {
							return (
								<PhotoYoyoTile
									editingYoyos={editingYoyos}
									yoyoData={yoyo}
									key={index}
								/>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

export default YoyoTiles;
