// Libraries
import React from 'react';

// Styles
import styles from './thankYou.module.scss';

// MUI Icons
import { Close } from '@mui/icons-material';

// Context
import { useAppContext } from '@/app/context/AppContext';

function ThankYou() {
	const { setModalType, setModalOpen } = useAppContext();

	return (
		<div className={styles.thanks}>
			<h2 className={styles.h2}>
				Thank you for verifying your email. Please login.
			</h2>

			<button
				className={styles.button}
				onClick={() => {
					setModalType('login');
				}}
			>
				Login
			</button>

			<div className={styles.close} onClick={() => setModalOpen(false)}>
				<Close sx={{ fontSize: '2rem' }} />
			</div>
		</div>
	);
}

export default ThankYou;
