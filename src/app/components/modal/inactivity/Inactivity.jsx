'use client';

// Libraries
import React from 'react';
import Link from 'next/link';

// Styles
import styles from './inactivity.module.scss';

// Context
import { useAppContext } from '@/app/context/AppContext';

function Inactivity() {
	const { setModalOpen, setModalType } = useAppContext();

	return (
		<div className={styles.container}>
			<h2 className={styles.h2}>You have been logged out due to inactivity.</h2>
			<div className={styles.buttons}>
				<Link
					href='/'
					className={styles.button}
					onClick={() => {
						setModalOpen(false);
					}}
				>
					Ok
				</Link>
				<button
					className={styles.button}
					onClick={() => {
						setModalType('login');
					}}
				>
					Login
				</button>
			</div>
		</div>
	);
}

export default Inactivity;
