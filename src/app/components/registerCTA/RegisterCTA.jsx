'use client';

// Libraries
import React from 'react';
import Link from 'next/link';

// Styles
import styles from './registerCTA.module.scss';

// Context
import { useAppContext } from '@/app/context/AppContext';

function RegisterCTA() {
	const { user, setModalOpen, setModalType } = useAppContext();

	return (
		<>
			<h2 className={styles.h2}>
				{!user && 'Register an account and start collecting today!'}
			</h2>
			{!user ? (
				<button
					className={styles.button}
					onClick={() => {
						setModalOpen(true);
						setModalType('register');
					}}
				>
					Register
				</button>
			) : (
				<Link className={styles.button} href='/collections'>
					Checkout the Collections page!
				</Link>
			)}
		</>
	);
}

export default RegisterCTA;
