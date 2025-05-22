'use client';

// Libraries
import React, { useState } from 'react';

// Styles
import styles from './heart.module.scss';

// Context
import { useAppContext } from '@/app/context/AppContext';

function Heart({
	itemId, // id of the item this component belongs to
	likeType, // type of the item this component belongs to: 'collection', 'upload', or 'yoyo'
	size, // 'small' or no value
	likes, // the likes passed in from the parent component
	setLikes, // the update likes function passed in from the parent component
}) {
	const { userLikes, setUserLikes, user } = useAppContext();

	const [hover, setHover] = useState(false);
	const [liked, setLiked] = useState(userLikes?.[likeType]?.[itemId]);

	const handleLike = () => {
		if (!liked) {
			setLikes((prev) => prev + 1);
			setLiked(true);
			setUserLikes((prev) => ({
				...prev,
				[likeType]: {
					...prev[likeType],
					[itemId]: true,
				},
			}));
		} else {
			setLikes((prev) => prev - 1);
			setLiked(false);
			setUserLikes((prev) => {
				const updatedType = { ...prev[likeType] };
				delete updatedType[itemId];

				return {
					...prev,
					[likeType]: updatedType,
				};
			});
		}
	};

	return (
		<svg
			viewBox='0 0 24 24'
			className={styles.heart}
			style={{
				height: size === 'small' ? '1.5rem' : '2rem',
				width: size === 'small' ? '1.5rem' : '2rem',
			}}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			onClick={handleLike}
		>
			<defs>
				<linearGradient id='quoteGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
					<stop offset='0%' stopColor='#ff00ff' />
					<stop offset='90%' stopColor='#00e1ff' />
				</linearGradient>
			</defs>

			{/* Gray base heart */}
			<path
				d='m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z'
				fill='#404040'
			/>

			{/* Gradient heart overlay */}
			<path
				d='m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z'
				fill='url(#quoteGradient)'
				style={{
					opacity: user && (liked || hover) ? 1 : likes ? 1 : 0,
					transition: 'opacity 0.1s ease-in-out',
				}}
			/>
		</svg>
	);
}

export default Heart;
