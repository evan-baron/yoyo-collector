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

function YoyoTiles({ setSelectedYoyo, collectionId, editing }) {
	const [sort, setSort] = useState({
		name: {
			selected: true,
			direction: 'ascending',
		},
		manufacturer: {
			selected: false,
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

	const handleSort = (e) => {
		const { name } = e.target.dataset;

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
			{editing && (
				<NewYoyoForm yoyoData={yoyoFormData} setYoyoData={setYoyoFormData} />
			)}
			<div className={styles.list}>
				<div className={styles.legend}>
					<ul className={`${styles.ul} ${editing && styles.editing}`}>
						<li className={styles.checkbox}>
							<input type='checkbox' className={styles.input} />
						</li>
						<li
							data-name='name'
							className={`${styles.sort} ${styles.name} ${
								sort.name.selected && styles.selected
							}`}
							onClick={handleSort}
						>
							Name
							<North
								className={styles.icon}
								style={{
									transform:
										sort.name.direction === 'descending' && 'rotate(180deg)',
								}}
							/>
						</li>
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
							Year
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
				<YoyoTile editing={editing} />
				<YoyoTile editing={editing} />
				<YoyoTile editing={editing} />
			</div>
		</div>
	);
}

export default YoyoTiles;
