'use client';

// Libraries
import React from 'react';

// Styles
import styles from './error.module.scss';

// Context
import { useAppContext } from '@/app/context/AppContext';

function ErrorModal() {
	const { setModalOpen, setPendingRoute, errorMessage } = useAppContext();

	return (
		<div className={styles.container}>
			{errorMessage ? (
				<>
					<h2 className={styles.h2} style={{ color: 'red' }}>
						Warning
					</h2>
					<p className={styles.p}>{errorMessage}</p>
				</>
			) : (
				<h2 className={styles.h2}>Please address the errors before saving.</h2>
			)}
			<div className={styles.buttons}>
				<button
					className={styles.button}
					onClick={() => {
						setModalOpen(false);
						setPendingRoute(null);
					}}
				>
					Ok
				</button>
			</div>
		</div>
	);
}

export default ErrorModal;
