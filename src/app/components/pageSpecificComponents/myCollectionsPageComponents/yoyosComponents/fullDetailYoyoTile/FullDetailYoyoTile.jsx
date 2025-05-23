'use client';

// Libraries
import React, { useState, useEffect } from 'react';

// Utils
import axiosInstance from '@/lib/utils/axios';

// Styles
import styles from './fullDetailYoyoTile.module.scss';

// MUI
import { Edit, Close, Star } from '@mui/icons-material';

// Components
import BlankYoyoPhoto from '@/app/components/blankYoyoPhoto/BlankYoyoPhoto';
import Heart from '@/app/components/icons/heart/Heart';
import YoyoPhotoScroller from '../yoyoPhotoScroller/YoyoPhotoScroller';

// Context
import { useAppContext } from '@/app/context/AppContext';

const FullDetailYoyoTile = ({
	yoyoData,
	selectedTile,
	handleSelect,
	validLeftItems = [],
	validRightItems = [],
	setYoyos,
	collectionType,
}) => {
	const {
		user,
		setSelectedYoyo,
		yoyoModalOpen,
		setYoyoModalOpen,
		setEditingYoyos,
		editingYoyos,
		yoyoDisplayType,
		userFavorites,
		setUserFavorites,
	} = useAppContext();

	const { id: yoyoId, photos, yoyo_condition: condition, likes } = yoyoData;

	const [currentLikes, setCurrentLikes] = useState(likes);
	const [hover, setHover] = useState(false);

	useEffect(() => {
		if (!user) return;
		setYoyos((prev) =>
			prev.map((yoyo) =>
				yoyo.id === yoyoId ? { ...yoyo, likes: currentLikes } : yoyo
			)
		);
	}, [currentLikes]);

	const handleFavorite = async () => {
		if (!user) return;

		if (!userFavorites.yoyos[yoyoId]) {
			setUserFavorites((prev) => ({
				...prev,
				yoyos: {
					...prev.yoyos,
					[yoyoId]: true,
				},
			}));
			try {
				await axiosInstance.post(
					'/api/favorites',
					{
						favorited_id: yoyoId,
						favorited_type: 'yoyos',
					},
					{
						withCredentials: true,
					}
				);
			} catch (error) {
				console.error(
					'Error occurred with favoriting the yoyo:',
					error.message
				);
			}
		} else {
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
		}
	};

	return (
		<div
			className={`${styles.tile} ${selectedTile ? styles.selected : ''}`}
			onClick={handleSelect}
		>
			<div className={styles['image-box']}>
				{photos?.length > 0 ? (
					<YoyoPhotoScroller
						optionsSize={yoyoModalOpen ? 'medium' : 'small'}
						photos={photos}
					/>
				) : (
					<div
						className={`${styles.image} ${
							yoyoModalOpen && styles['yoyo-modal']
						}`}
					>
						<BlankYoyoPhoto />
					</div>
				)}
				<div
					className={`${styles.likes} ${photos?.length > 1 && styles.indented}`}
				>
					<Heart
						size='small'
						likes={currentLikes}
						likeType={'yoyos'}
						itemId={yoyoId}
						setLikes={setCurrentLikes}
					/>
					{currentLikes > 0 && <>{currentLikes}</>}
				</div>
			</div>

			<div className={styles['content-box']}>
				<div className={styles.details}>
					{validLeftItems.length > 0 && (
						<div className={styles.left}>
							{validLeftItems.map(([label, value], index) => (
								<div key={index} className={styles.attribute}>
									<label className={styles.label} htmlFor={value}>
										{label}:
									</label>
									<p>{value}</p>
								</div>
							))}
						</div>
					)}

					{validRightItems.length > 0 && (
						<div className={styles.right}>
							{validRightItems.map(([label, value], index) => {
								let displayValue = value;
								if (label === 'Original owner') {
									displayValue =
										String(value) === '0'
											? 'No'
											: String(value) === '1'
											? 'Yes'
											: '';
								}

								return (
									<div key={index} className={styles.attribute}>
										<label className={styles.label} htmlFor={value}>
											{label}:
										</label>
										<p>{displayValue}</p>
									</div>
								);
							})}
							{user && collectionType === 'visitor' && (
								<div
									className={`${styles.button} ${
										userFavorites.yoyos[yoyoId] && styles.favorited
									}`}
									onClick={handleFavorite}
									onMouseEnter={() => setHover(true)}
									onMouseLeave={() => setHover(false)}
								>
									<Star
										className={`${styles.star} ${
											userFavorites.yoyos[yoyoId] && styles.favorited
										} ${hover && styles.hover}`}
									/>
									{userFavorites.yoyos[yoyoId]
										? 'Favorited!'
										: 'Add to Favorites'}
								</div>
							)}
						</div>
					)}
				</div>

				{condition && (
					<div className={styles.about}>
						<div className={styles.attribute}>
							<label className={styles.label} htmlFor='condition'>
								About the yoyo:
							</label>
							<p className={styles.p}>{condition}</p>
						</div>
					</div>
				)}

				{yoyoModalOpen ? (
					<div
						className={`${styles['close-tile']} ${styles['yoyo-modal']}`}
						onClick={() => {
							setSelectedYoyo(null);
							yoyoModalOpen && setYoyoModalOpen(false);
						}}
						style={{
							right: yoyoModalOpen && '-0.5rem',
							top: yoyoModalOpen && '-0.5rem',
						}}
					>
						<Close className={styles.close} /> Close
					</div>
				) : editingYoyos ? (
					<Edit
						className={styles.edit}
						onClick={(e) => {
							e.stopPropagation();
							setEditingYoyos(true);
							!selectedTile && setSelectedYoyo(yoyoId);
						}}
					/>
				) : (
					yoyoDisplayType !== 'full' && (
						<div
							className={styles['close-tile']}
							onClick={(e) => {
								e.stopPropagation();
								setSelectedYoyo(null);
							}}
						>
							<Close className={styles.close} />
						</div>
					)
				)}
				{/* Optional: Only show edit if current user owns this yoyo */}
			</div>
		</div>
	);
};

export default FullDetailYoyoTile;
