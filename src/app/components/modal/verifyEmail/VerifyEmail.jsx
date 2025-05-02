// Libraries
import React, { useState } from 'react';
import axiosInstance from '@/lib/utils/axios';

// Styles
import styles from './verifyEmail.module.scss';

// MUI Icons
import { Close } from '@mui/icons-material';

// Context
import { useAppContext } from '@/app/context/AppContext';

// Components
import LoadingSpinner from '../../loading/LoadingSpinner';

function VerifyEmail() {
	const [clicked, setClicked] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const [loading, setLoading] = useState(false);

	const { user, setModalOpen } = useAppContext();
	const resendEmail = user.email;

	const handleClick = async () => {
		setClicked((prev) => !prev);
		setLoading((prev) => !prev);

		try {
			await axiosInstance.post('/api/token/verifyEmail', {
				email: resendEmail,
				tokenName: 'email_verification',
			});
			setEmailSent((prev) => !prev);
			setLoading((prev) => !prev);
		} catch (error) {
			console.log(
				'There was an error at modal/verifyEmail/VerifyEmail.jsx handleClick',
				error.message
			);
		}
	};

	return (
		<>
			<div className={styles.verify}>
				{!emailSent && (
					<>
						<h2 className={styles.h2}>Please Verify Your Email</h2>
						<p className={styles.p}>
							You must verify your email in order to use certain features on
							Yoyo Collector:
						</p>
						<ul className={styles.ul}>
							<li className={styles.li}>Update profile information</li>
							<li className={styles.li}>View other profiles</li>
							<li className={styles.li}>Add collections</li>
							<li className={styles.li}>Like collections</li>
							<li className={styles.li}>And more</li>
						</ul>
						<p className={styles.p}>
							Please check your email for the verification link.
						</p>
					</>
				)}
				{!emailSent ? (
					<>
						<button
							className={styles.button}
							onClick={handleClick}
							disabled={clicked}
						>
							Resend Link
						</button>
					</>
				) : (
					<>
						<p className={`${styles.p} ${styles.sent}`}>
							A new link has been sent
						</p>
						<button
							className={styles.button}
							onClick={() => setModalOpen(false)}
						>
							Close
						</button>
					</>
				)}
				<div className={styles.close} onClick={() => setModalOpen(false)}>
					<Close sx={{ fontSize: '2rem' }} />
				</div>
			</div>
			{loading && <LoadingSpinner message='sending' />}
		</>
	);
}

export default VerifyEmail;
