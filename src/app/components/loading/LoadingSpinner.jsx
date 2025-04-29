'use client';

import React, { useState, useEffect } from 'react';
import styles from './loadingSpinner.module.scss';

function LoadingSpinner({ message }) {
	const [loadingText, setLoadingText] = useState('');

	useEffect(() => {
		const loadingStates = ['', '.', '..', '...'];
		let index = 0;

		const interval = setInterval(() => {
			setLoadingText(loadingStates[index]);
			index = (index + 1) % loadingStates.length; // Loop back to start
		}, 500);

		return () => clearInterval(interval); // Cleanup on unmount
	}, []);

	return (
		<div className={styles.loadingcontainer}>
			<div className={styles.container}>
				<h2 className={styles.h2}>
					{message}
					<div className={styles.elipses}>{loadingText}</div>
				</h2>
				<div className={styles.spinner}>
					<div className={styles['loading-spinner']}></div>
				</div>
			</div>
		</div>
	);
}

export default LoadingSpinner;
