'use client';

// External Libraries
import React, { useState, useEffect } from 'react';

// Utilities
import axiosInstance from '@/utils/axios';

// MUI Icons
import {
	Check,
	Close,
	East,
	Visibility,
	VisibilityOff,
	West,
} from '@mui/icons-material';

// Assets & Styles
import styles from './register.module.scss';

// Context
import { useAppContext } from '../../../context/AppContext';

// Components
import LoadingSpinner from '../../loading/LoadingSpinner';
import PasswordValidation from '../../passwordValidation/PasswordValidation';

const Register = () => {
	// CONTEXT
	const { setModalOpen, setModalType } = useAppContext();

	//SIGNUP LOGIC
	const [formData, setFormData] = useState({
		first: '',
		last: '',
		email: '',
		password: '',
		confirm: '',
	});
	const [passwordMatch, setPasswordMatch] = useState(null);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [formComplete, setFormComplete] = useState(false);
	const [emailValid, setEmailValid] = useState(null);
	const [nameEmailComplete, setNameEmailComplete] = useState(false);
	const [nameEmailSubmitted, setNameEmailSubmitted] = useState(false);
	const [passwordValid, setPasswordValid] = useState(null);
	const [passwordReqs, setPasswordReqs] = useState({
		length: false,
		uppercase: false,
		number: false,
		character: false,
	});
	const [formSubmitted, setFormSubmitted] = useState(null);
	const [registrationError, setRegistrationError] = useState(null);
	const [registrationComplete, setRegistrationComplete] = useState(false);
	const [loadingScreen, setLoadingScreen] = useState(false);

	useEffect(() => {
		const formCompleted = formData.first && formData.last && formData.email;
		setNameEmailComplete(formCompleted);
	}, [formData.first, formData.last, formData.email]);

	useEffect(() => {
		const passwordsMatch =
			formData.password !== '' && formData.password === formData.confirm;
		setPasswordMatch(passwordsMatch);

		setFormComplete(formData.email && passwordMatch && passwordValid);
	}, [
		formData.password,
		formData.confirm,
		formData.email,
		passwordMatch,
		passwordValid,
	]);

	// Regex for email validation
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (name === 'email') {
			setEmailValid(emailRegex.test(value));
		}

		if (name === 'password') {
			// Check individual password requirements
			const lengthValid = value.length >= 8;
			const uppercaseValid = /[A-Z]/.test(value); // Checks for uppercase
			const numberValid = /\d/.test(value); // Checks for at least one number
			const specialCharValid = /[@$!%*?&]/.test(value); // Checks for special characters

			// Update password requirements state
			setPasswordReqs({
				length: lengthValid,
				uppercase: uppercaseValid,
				number: numberValid,
				character: specialCharValid,
			});

			// Update overall password validity
			setPasswordValid(lengthValid && numberValid && specialCharValid);
		}

		setFormSubmitted(false);
		setRegistrationError(null);
	};

	const handleNext = async () => {
		const { email } = formData;

		if (!nameEmailSubmitted) {
			try {
				const response = await axiosInstance.post('/api/user/checkEmail', {
					email: email.trim(),
				});

				const { available } = response.data;

				if (available) {
					setNameEmailSubmitted((prev) => !prev);
				} else {
					setRegistrationError(response.data.message);
					setNameEmailComplete(false);
				}
			} catch (error) {
				console.error('Registration error: ', error.response?.data);
				setRegistrationError(
					error.response ? error.response.data.message : 'An error occurred'
				);
				setNameEmailComplete(false);
			}
		} else {
			setNameEmailSubmitted((prev) => !prev);
		}
	};

	const handleSubmit = async () => {
		setFormSubmitted(true);

		if (!emailValid || !passwordValid) {
			setFormComplete(false);
			return;
		} else {
			try {
				setLoadingScreen(true);
				await axiosInstance.post('/api/auth/register', {
					first: formData.first.trim(),
					last: formData.last.trim(),
					email: formData.email.trim(),
					password: formData.password.trim(),
				});

				await axiosInstance.post('/api/token/verifyEmail', {
					email: formData.email,
					tokenName: 'email_verification',
				});
				setLoadingScreen(false);

				// Changes page to registration complete
				setRegistrationComplete(true);

				// Reset the form and related states
				setFormData({
					firstname: '',
					lastname: '',
					email: '',
					password: '',
					confirm: '',
				});

				setPasswordReqs({
					length: false,
					uppercase: false,
					number: false,
					character: false,
				});

				// Reset other relevant states
				setPasswordMatch(null);
				setPasswordVisible(false);
				setFormComplete(false);
				setEmailValid(null);
				setPasswordValid(null);
				setFormSubmitted(false);
				setNameEmailSubmitted(false);
			} catch (error) {
				console.error('Registration error: ', error.response?.data);
				setRegistrationError(
					error.response ? error.response.data.message : 'An error occurred'
				);
				setFormComplete(false);
			}
		}
	};

	return (
		<section
			aria-labelledby='sign-up-form'
			className={styles['signup-content']}
		>
			{!registrationComplete ? (
				<form className={styles['signup-form']}>
					<h3 className={styles['signup-title']}>Register</h3>

					{loadingScreen ? (
						<LoadingSpinner />
					) : (
						<>
							{!nameEmailSubmitted ? (
								<fieldset
									className={`${styles.fieldset} ${styles['name-email']}`}
									aria-labelledby='name-email-fields'
								>
									<div className={styles['registrant-name']}>
										<div className={styles['input-field']}>
											<label htmlFor='email' className={styles.label}>
												First Name:
											</label>
											<div className={styles['input-container']}>
												<input
													className={styles.input}
													id='first'
													type='text'
													name='first'
													placeholder=''
													value={formData.first || ''}
													onChange={handleChange}
													required
													aria-label='First Name'
												/>
											</div>
										</div>
										<div className={styles['input-field']}>
											<label htmlFor='email' className={styles.label}>
												Last Name:
											</label>
											<div className={styles['input-container']}>
												<input
													className={styles.input}
													id='last'
													type='text'
													name='last'
													placeholder=''
													value={formData.last || ''}
													onChange={handleChange}
													required
													aria-label='Last Name'
												/>
											</div>
										</div>
									</div>
									<div className={styles['input-field']}>
										<label htmlFor='email' className={styles.label}>
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
												value={formData.email || ''}
												required
												aria-label='Enter your email address'
											/>
										</div>
										{formSubmitted && !emailValid ? (
											<p
												className={styles['validation-error']}
												role='alert'
												aria-live='polite'
											>
												Please enter a valid email address
											</p>
										) : null}
									</div>
								</fieldset>
							) : (
								<fieldset
									className={`${styles.fieldset} ${styles['password-section']}`}
								>
									<div className={styles['input-field']}>
										<label htmlFor='password' className={styles.label}>
											Password:
										</label>
										<div className={styles['input-container']}>
											<input
												className={styles.input}
												id='password'
												type={passwordVisible ? 'text' : 'password'}
												name='password'
												placeholder=''
												value={formData.password || ''}
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
									<div className={styles['input-field']}>
										<label htmlFor='confirm' className={styles.label}>
											Confirm Password:
										</label>
										<div className={styles['input-container']}>
											<input
												className={styles.input}
												id='confirm'
												type='password'
												name='confirm'
												value={formData.confirm || ''}
												placeholder=''
												onChange={handleChange}
												required
												aria-label='Confirm your password'
											/>

											{passwordMatch !== null && formData.confirm ? (
												passwordMatch ? (
													<Check
														className={styles.validatePw}
														role='img'
														aria-label='Passwords match'
														sx={{ color: 'rgb(0, 200, 0)', fontSize: '2rem' }}
													/>
												) : (
													<Close
														className={styles.validatePw}
														role='img'
														aria-label='Passwords do not match'
														sx={{ color: 'rgb(255, 0, 0)', fontSize: '2rem' }}
													/>
												)
											) : null}
										</div>
										<PasswordValidation passwordReqs={passwordReqs} />
									</div>
								</fieldset>
							)}

							{!nameEmailSubmitted ? (
								<button
									className={styles.button}
									type='button'
									role='button'
									aria-label='Confirm names and email'
									onClick={handleNext}
									disabled={!nameEmailComplete}
									style={{
										opacity: nameEmailComplete ? '1' : '.5',
										cursor: nameEmailComplete ? 'pointer' : null,
									}}
								>
									Next
									<East />
								</button>
							) : (
								<div className={styles['back-submit']}>
									<button
										className={`${styles.button} ${styles.back}`}
										type='button'
										role='button'
										aria-label='Confirm names and email'
										onClick={handleNext}
									>
										<West />
										Back
									</button>
									<button
										className={`${styles.button} ${styles.submit}`}
										type='button'
										role='button'
										aria-label='Submit registration form'
										onClick={handleSubmit}
										disabled={!formComplete}
										style={{
											opacity: formComplete ? '1' : '.5',
											cursor: formComplete ? 'pointer' : null,
										}}
									>
										Create Account
									</button>
								</div>
							)}

							{registrationError && (
								<p aria-live='polite' role='alert' className={styles.alert}>
									{registrationError}
								</p>
							)}
						</>
					)}

					<span className={styles.span}>
						Already have an account?
						<br />
						<a
							className={styles.link}
							role='link'
							aria-label='Go to login page'
							onClick={() => {
								setModalType('login');
							}}
						>
							Login
						</a>
					</span>
				</form>
			) : (
				<form className={styles['completed-form']}>
					<h2 className={styles.h2}>Welcome to Yoyo Collector!</h2>
					<p className={styles.p}>
						Your one-stop-shop for keeping track of your collection and sharing
						with others!
					</p>
					<p className={styles.p}>
						<span className={styles.span}>
							Please check your email for a link to verify your account.
						</span>{' '}
						If it doesn't show up after a few minutes, check your spam or junk
						folders.
					</p>
					<p className={styles.p}>- Yoyo Collector Team</p>
				</form>
			)}

			<div className={styles.close} onClick={() => setModalOpen(false)}>
				<Close sx={{ fontSize: '2rem' }} />
			</div>
		</section>
	);
};

export default Register;
