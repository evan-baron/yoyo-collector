'use client';

// Libraries
import React from 'react';

// Utils
import axiosInstance from '@/lib/utils/axios';

// MUI
import { Star } from '@mui/icons-material';

// Styles
import styles from './summaryYoyoTile.module.scss'; // or use your existing styles file

// Context
import { useAppContext } from '@/app/context/AppContext';

const SummaryYoyoTile = ({
	model,
	colorway,
	brand,
	releaseYear,
	editing,
	handleSelect,
	selectedTile,
	yoyoId,
}) => {
	const { user, userFavorites, setUserFavorites } = useAppContext();

	const handleFavorite = async (e) => {
		e.stopPropagation();
		if (!user) return;

		setUserFavorites((prev) => {
			const updatedType = { ...prev.yoyos };
			delete updatedType[yoyoId];

			return {
				...prev,
				yoyos: updatedType,
			};
		});
		try {
			await axiosInstance.delete('/api/favorites', {
				data: {
					favorited_id: yoyoId,
					favorited_type: 'yoyos',
				},
				withCredentials: true,
			});
		} catch (error) {
			console.error('Error occurred with liking the photo:', error.message);
		}
	};

	return (
		<div
			className={`${styles.tile} ${selectedTile ? styles.selected : ''} ${
				editing ? styles.editing : ''
			}`}
			onClick={handleSelect}
		>
			<div className={styles.legend}>
				<ul className={`${styles.ul} ${editing ? styles.editing : ''}`}>
					<li className={styles.name}>
						{model}{' '}
						{userFavorites.yoyos[yoyoId] && (
							<Star
								className={`${styles.star} ${
									userFavorites.yoyos[yoyoId] && styles.favorited
								}`}
								onClick={(e) => handleFavorite(e)}
							/>
						)}
					</li>
					<li className={styles.colorway}>{colorway}</li>
					<li className={styles.manufacturer}>{brand}</li>
					<li className={styles.year}>{releaseYear}</li>
				</ul>
			</div>
		</div>
	);
};

export default SummaryYoyoTile;
