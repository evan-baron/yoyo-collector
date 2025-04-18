'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axios';
import { useRouter } from 'next/navigation';
import {
	CheckBox,
	CheckBoxOutlineBlank,
	Close,
	Visibility,
	VisibilityOff,
} from '@mui/icons-material';
import { useAppContext } from '@/app/context/AppContext';
import styles from './login.module.scss';
import LoadingSpinner from '../../loading/LoadingSpinner';

const Login = () => {
	const { setModalOpen, setModalType, setUser } = useAppContext();

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [checked, setChecked] = useState(false);
	const [formComplete, setFormComplete] = useState(false);
	const [loginError, setLoginError] = useState(null);
	const [loadingScreen, setLoadingScreen] = useState(false);

	const router = useRouter();

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		setLoginError(null);
	};

	useEffect(() => {
		setFormComplete(formData.email !== '' && formData.password !== '');
	}, [formData.email, formData.password]);

	const handleSubmit = async () => {
		if (formComplete) {
			try {
				setLoadingScreen(true);
				const response = await axiosInstance.post('/api/auth/login', {
					email: formData.email,
					password: formData.password,
					checked: checked,
				});
				setLoadingScreen(false);
				const { token } = response.data;

				// Store token in localstorage if remember me checked
				if (checked) {
					localStorage.setItem('token', token);
				} else {
					sessionStorage.setItem('token', token);
				}

				// Reset the form and related states
				setFormData({
					email: '',
					password: '',
				});

				// Sets current user
				setUser(response.data.user);

				// Redirects to home
				router.push('/');

				// Closes modal
				setModalOpen(false);
			} catch (error) {
				console.error('Login error: ', error.response?.message);
				setLoginError(
					error.response ? error.response.data.message : 'An error occurred'
				);
				setLoadingScreen(false);
				setFormComplete(false);
			}
		}
	};

	return (
		<section aria-labelledby='login-form' className={styles['login-content']}>
			{!loadingScreen ? (
				<>
					<form className={styles['login-form']} role='form'>
						<h1 className={styles.h1}>Login</h1>
						<div className={styles['login-field']}>
							<div className={styles['login-input']}>
								<label htmlFor='email' className={styles.label}>
									Email:
								</label>
								<div className={styles['input-container']}>
									<input
										id='email'
										type='email'
										name='email'
										onChange={handleChange}
										required
										aria-label='Enter your email address'
										className={styles.input}
									/>
								</div>
							</div>
							<div className={styles['login-input']}>
								<label htmlFor='password' className={styles.label}>
									Password:
								</label>
								<div className={styles['input-container']}>
									<input
										id='password'
										type={passwordVisible ? 'text' : 'password'}
										name='password'
										onChange={handleChange}
										required
										aria-label='Enter your password'
										className={styles.input}
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
								<div className={styles['remember-me']}>
									{checked ? (
										<CheckBox
											onClick={() => setChecked((prev) => !prev)}
											sx={{ color: 'var(--lightestGray)' }}
										/>
									) : (
										<CheckBoxOutlineBlank
											sx={{ color: 'var(--lightestGray)' }}
											onClick={() => setChecked((prev) => !prev)}
										/>
									)}
									<span className={styles.span}>Remember me</span>
									<a
										role='link'
										aria-label='Go to recover password page'
										className={styles.link}
										onClick={() => setModalType('forgot-password')}
									>
										Forgot password?
									</a>
								</div>
							</div>
						</div>
						{!loginError && (
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
								Login
							</button>
						)}
						{loginError && (
							<p aria-live='polite' role='alert' className={styles.alert}>
								{loginError}
							</p>
						)}
						<span className={styles.span}>
							Don't have an account?
							<br />
							<a
								className={styles.link}
								role='link'
								aria-label='Go to sign up page'
								onClick={() => setModalType('register')}
							>
								Register
							</a>
						</span>
					</form>
					<div className={styles.close} onClick={() => setModalOpen(false)}>
						<Close sx={{ fontSize: '2rem' }} />
					</div>
				</>
			) : (
				<LoadingSpinner message='Logging in' />
			)}
		</section>
	);
};

export default Login;
