// Libraries
import React from 'react';
import Link from 'next/link';

// Styles
import styles from './thankYou.module.scss';

// MUI Icons
import { Close } from '@mui/icons-material';

// Context
import { useAppContext } from '@/app/context/AppContext';

function ThankYou() {
	const { setModalOpen } = useAppContext();

	return (
		<div className={styles.thanks}>
			<h2 className={styles.h2}>Thank you for verifying your email.</h2>

			<Link
				href='/profile'
				className={styles.button}
				onClick={() => setModalOpen(false)}
			>
				Continue to Profile
			</Link>

			<div className={styles.close} onClick={() => setModalOpen(false)}>
				<Close sx={{ fontSize: '2rem' }} />
			</div>
		</div>
	);
}

export default ThankYou;
