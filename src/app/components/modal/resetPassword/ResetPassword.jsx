'use client';

// External Libraries
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// Utilities
import axiosInstance from '@/lib/utils/axios';

// MUI Icons
import { Check, Close, Visibility, VisibilityOff } from '@mui/icons-material';

// Styles
import styles from './resetPassword.module.scss';

// Components
import PasswordValidation from '../../passwordValidation/PasswordValidation';

// Context
import { useAppContext } from '@/app/context/AppContext';

const ResetPassword = () => {
	// Context & Navigation
	const {
		resendEmail,
		setResendEmail,
		token,
		tokenValid,
		setTokenValid,
		timeRemaining,
		setTimeRemaining,
		setModalOpen,
		setModalType,
		screenHeight,
		screenWidth,
	} = useAppContext();
	const router = useRouter();

	// Form Data
	const [formData, setFormData] = useState({ password: '', confirm: '' });

	// Validation States
	const [passwordMatch, setPasswordMatch] = useState(null);
	const [passwordValid, setPasswordValid] = useState(null);
	const [passwordReqs, setPasswordReqs] = useState({
		length: false,
		uppercase: false,
		number: false,
		character: false,
	});

	// Process States
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [formComplete, setFormComplete] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const [passwordReset, setPasswordReset] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);

	// Extend Day.js with plugins
	dayjs.extend(utc);
	dayjs.extend(timezone);

	// Countdown Timer
	useEffect(() => {
		if (!tokenValid || timeRemaining <= 0) {
			setTokenValid(false);
			return;
		}

		const timer = setInterval(() => {
			setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);

		return () => clearInterval(timer);
	}, [tokenValid, timeRemaining]);

	// Password Match & Validation
	useEffect(() => {
		const passwordsMatch =
			formData.password && formData.password === formData.confirm;
		setPasswordMatch(passwordsMatch);
		setFormComplete(passwordsMatch && passwordValid);
	}, [formData.password, formData.confirm]);

	// Handle Input Change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setErrorMessage(null);

		if (name === 'password') {
			const lengthValid = value.length >= 8;
			const uppercaseValid = /[A-Z]/.test(value);
			const numberValid = /\d/.test(value);
			const specialCharValid = /[@$!%*?&]/.test(value);

			setPasswordReqs({
				length: lengthValid,
				uppercase: uppercaseValid,
				number: numberValid,
				character: specialCharValid,
			});
			setPasswordValid(lengthValid && numberValid && specialCharValid);
		}
	};

	// Handle Form Submission
	const handleSubmit = async () => {
		if (!tokenValid) {
			try {
				setEmailSent(true);
				const data = await axiosInstance.post('/api/user/recoverPassword', {
					email: resendEmail,
					tokenName: 'email_recovery',
				});

				if (data) setResendEmail(null);
			} catch (error) {
				setErrorMessage(
					'There was an issue sending the reset email. Please try again.'
				);
				console.error('Error:', error.response?.data);
			}
			return;
		}

		try {
			const response = await axiosInstance.post('/api/user/resetPassword', {
				token,
				password: formData.password.trim(),
			});

			const { success, message } = response.data;

			if (success) {
				setFormData({ password: '', confirm: '' });
				setEmailSent(null);
				setPasswordReset((prev) => !prev);
				setPasswordValid(null);
				setPasswordVisible(false);
				setPasswordMatch(null);
				setTokenValid(false);
			} else {
				setErrorMessage(message);
			}
		} catch (error) {
			console.error('Registration error:', error.response?.data);
			setErrorMessage(
				error.response ? error.response.data.message : 'An error occurred'
			);
			setFormComplete(false);
		}
	};

	const screenSmall = screenWidth < 720 || screenHeight < 720;

	return (
		<>
			<section
				className={styles.section}
				aria-labelledby='password-recovery-form'
			>
				<form className={styles.form} role='form'>
					{tokenValid ? (
						<>
							<h1 className={styles.h1}>Reset Password</h1>
							<h2 className={styles.h2}>Please enter a new password.</h2>

							<p className={styles.alert}>
								Time remaining: {Math.floor(timeRemaining / 60)}:
								{(timeRemaining % 60).toString().padStart(2, '0')}
							</p>

							<div className={styles['password-field']}>
								<div className={styles['password-input']}>
									<label className={styles.label} htmlFor='password'>
										New Password:
									</label>
									<div className={styles['input-container']}>
										<input
											className={styles.input}
											id='password'
											type={passwordVisible ? 'text' : 'password'}
											name='password'
											placeholder=''
											onChange={handleChange}
											required
											aria-label='Enter your password'
										/>
										{formData.password ? (
											passwordVisible ? (
												<Visibility
													className={styles.visible}
													role='button'
													tabIndex='0'
													aria-label='Toggle password visibility'
													onClick={() => {
														setPasswordVisible((prev) => !prev);
													}}
													sx={{
														fontSize: '1.75rem',
														color: '#777777',
														outline: 'none',
													}}
												/>
											) : (
												<VisibilityOff
													className={styles.visible}
													role='button'
													tabIndex='0'
													aria-label='Toggle password visibility'
													onClick={() => {
														setPasswordVisible((prev) => !prev);
													}}
													sx={{
														fontSize: '1.75rem',
														color: '#777777',
														outline: 'none',
													}}
												/>
											)
										) : null}
									</div>
								</div>
								<div className={styles['password-input']}>
									<label className={styles.label} htmlFor='confirm'>
										Confirm Password:
									</label>
									<div className={styles['input-container']}>
										<input
											className={styles.input}
											id='confirm'
											type='password'
											name='confirm'
											placeholder=''
											onChange={handleChange}
											required
											aria-label='Confirm your password'
										/>

										{passwordMatch !== null && formData.confirm ? (
											passwordMatch ? (
												<Check
													className='validatePw'
													role='img'
													aria-label='Passwords match'
													sx={{ color: 'rgb(0, 200, 0)', fontSize: '2rem' }}
												/>
											) : (
												<Close
													className='validatePw'
													role='img'
													aria-label='Passwords do not match'
													sx={{ color: 'rgb(255, 0, 0)', fontSize: '2rem' }}
												/>
											)
										) : null}
									</div>
									<PasswordValidation passwordReqs={passwordReqs} />
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

							{errorMessage && (
								<p className={styles.alert} aria-live='polite' role='alert'>
									{errorMessage}
								</p>
							)}
						</>
					) : !passwordReset ? (
						!emailSent ? (
							<>
								<h2 className={styles.h2}>
									Sorry, this recovery link is no longer active.
								</h2>
								<button
									className={styles.button}
									type='button'
									role='button'
									aria-label='Resend password'
									onClick={handleSubmit}
									disabled={formComplete}
									style={{
										opacity: !formComplete ? null : '.5',
										cursor: !formComplete ? 'pointer' : null,
									}}
								>
									Send New Link
								</button>
							</>
						) : (
							<>
								<h2 className={styles.h2}>
									A password reset link has been sent to your email.
									<br />
									<br />
									Please check your inbox shortly. If you don't see it, please
									check your spam or junk folder.
								</h2>
								<h2
									className={styles.h2}
									onClick={() => {
										router.push(window.location.pathname);
										setModalType('login');
									}}
								>
									<Link
										className={styles.link}
										href='/'
										role='link'
										aria-label='Go to login page'
									>
										Return to Login
									</Link>
								</h2>
							</>
						)
					) : (
						<>
							<h2 className={styles.h2}>
								Your password has been reset. Please return to the login page.
							</h2>
							<h2
								className={styles.h2}
								onClick={() => {
									router.push(window.location.pathname);
									setModalType('login');
								}}
							>
								<Link
									className={styles.link}
									href='/'
									role='link'
									aria-label='Go to login page'
								>
									Return to Login
								</Link>
							</h2>
						</>
					)}

					{!passwordReset && !emailSent && (
						<span className={styles.span}>
							Return to Login?
							<br />
							<Link
								className={styles.link}
								href='/'
								role='link'
								aria-label='Go to login page'
								onClick={() => {
									router.push(window.location.pathname);
									setModalType('login');
								}}
							>
								Login
							</Link>
						</span>
					)}
					<div
						className={styles.close}
						onClick={() => {
							router.push(window.location.pathname);
							setModalOpen(false);
						}}
					>
						<Close sx={{ fontSize: '2rem' }} />
					</div>
				</form>
			</section>
		</>
	);
};

export default ResetPassword;
