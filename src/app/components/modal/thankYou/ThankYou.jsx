// Libraries
import React from 'react';

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

			<button className={styles.button} onClick={() => setModalOpen(false)}>
				Continue to Profile
			</button>

			<div className={styles.close} onClick={() => setModalOpen(false)}>
				<Close sx={{ fontSize: '2rem' }} />
			</div>
		</div>
	);
}

export default ThankYou;
