import React from 'react';

import styles from './heart.module.scss';

function Heart({ size, likes }) {
	return (
		<svg
			viewBox='0 0 24 24'
			className={styles.heart}
			style={{
				height: size === 'small' ? '1.5rem' : '2rem',
				width: size === 'small' ? '1.5rem' : '2rem',
			}}
		>
			{likes && (
				<defs>
					<linearGradient
						id='quoteGradient'
						x1='0%'
						y1='0%'
						x2='100%'
						y2='100%'
					>
						<stop offset='0%' stopColor='#ff00ff' />
						<stop offset='90%' stopColor='#00e1ff' />
					</linearGradient>
				</defs>
			)}
			<path
				d='m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z'
				fill={likes ? 'url(#quoteGradient)' : '#404040'}
			/>
		</svg>
	);
}

export default Heart;
