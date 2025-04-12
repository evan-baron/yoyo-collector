'use client';

// Libraries
import React, { useState, useEffect } from 'react';
import { Close } from '@mui/icons-material';

// Utils
import axiosInstance from '@/utils/axios';

// Styles
import styles from './forgotPassword.module.scss';

// Context
import { useAppContext } from '@/app/context/AppContext';

const ForgotPassword = () => {
	const { setModalOpen, setModalType } = useAppContext();
	const [formData, setFormData] = useState({
		email: '',
	});
	const [formComplete, setFormComplete] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	useEffect(() => {
		const emailIsValid =
			formData.email.includes('@') && formData.email.includes('.');
		setFormComplete(emailIsValid);
	}, [formData.email]);

	const handleSubmit = async () => {
		if (formComplete) {
			try {
				setFormComplete(false);
				setEmailSent(true);
				const data = await axiosInstance.post('/api/user/recoverPassword', {
					email: formData.email,
					tokenName: 'email_recovery',
				});

				if (data) {
					// Reset the form and related states
					setFormData({
						email: '',
					});
				}
			} catch (error) {
				setErrorMessage(
					'There was an issue sending the reset email. Please try again.'
				);
				console.error('Error: ', error.response?.data);
			}
		}
	};

	return (
		<section
			aria-labelledby='password-recovery-form'
			className={styles['recovery-content']}
		>
			{!emailSent ? (
				<form className={styles['recovery-form']} role='form'>
					<h1 className={styles.h1} id='password-recovery-form'>
						Recover Password
					</h1>
					<div className={styles['input-field']}>
						<h2 className={styles.h2}>
							Please enter the email you registered with below to receive a
							password reset link.
						</h2>
						<div className={styles['recovery-input']}>
							<label className={styles.label} htmlFor='email'>
								Email:
							</label>
							<div className={styles['input-container']}>
								<input
									className={styles.input}
									id='email'
									type='email'
									name='email'
									placeholder=''
									onChange={handleChange}
									required
									aria-label='Enter your email address'
								/>
							</div>
						</div>
					</div>
					<button
						className={styles.button}
						type='button'
						role='button'
						aria-label='Submit registration form'
						onClick={handleSubmit}
						disabled={!formComplete}
						style={{
							opacity: formComplete ? null : '.5',
							cursor: formComplete ? 'pointer' : null,
						}}
					>
						Reset Password
					</button>

					{errorMessage && <div className='error-message'>{errorMessage}</div>}

					<span className={styles.span}>
						Return to Login?
						<br />
						<a
							className={styles.link}
							role='link'
							aria-label='Go to login page'
							onClick={() => setModalType('login')}
						>
							Login
						</a>
					</span>
				</form>
			) : (
				<div className={styles['recovery-sent']}>
					<h2 className={styles.h2}>
						A password reset link has been sent to your email.
						<br />
						<br />
						Please check your inbox shortly. If you don't see it, please check
						your spam or junk folder.
					</h2>
					<h2 className={styles.h2}>
						<a
							className={styles.link}
							role='link'
							aria-label='Go to login page'
							onClick={() => setModalType('login')}
						>
							Return to Login
						</a>
					</h2>
				</div>
			)}
			<div className={styles.close} onClick={() => setModalOpen(false)}>
				<Close sx={{ fontSize: '2rem' }} />
			</div>
		</section>
	);
};

export default ForgotPassword;
