'use client';

import React, { useState, useEffect } from 'react';

// Utilities
import axiosInstance from '@/utils/axios';

// Libraries
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Styles
import styles from './header.module.scss';

// Context
import { useAppContext } from '@/app/context/AppContext';

// Assets
import logo from '@/app/assets/site/logo/uip5-yoyo-logo.png';

// Components
import Modal from '@/app/components/modal/modal';

const Header = () => {
	const {
		dirty,
		modalOpen,
		setModalOpen,
		setModalType,
		setPendingRoute,
		user,
		setUser,
		setProfileSettingsFormData,
		setCurrentlyEditing,
		setDirty,
		setLoading,
	} = useAppContext();

	const [active, setActive] = useState(false);
	const [animate, setAnimate] = useState(false);

	useEffect(() => {
		let timeout;
		if (!animate && active) {
			timeout = setTimeout(() => {
				setActive(false);
			}, 300);
		}
		return () => clearTimeout(timeout);
	}, [animate]);

	const router = useRouter();

	useEffect(() => {
		if (!user) return;

		if (user && !user.email_verified) {
			setModalOpen(true);
			setModalType('verify-email');
		}
	}, [user?.email_verified]);

	const handleLogout = async () => {
		setActive((prev) => !prev);
		setAnimate((prev) => !prev);
		try {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			setUser(null);
			await axiosInstance.post('/api/auth/logout', user);
		} catch (error) {
			console.error('Logout failed: ', error.response?.data || error.message);
		} finally {
			setProfileSettingsFormData(null);
			setCurrentlyEditing(null);
			setDirty(false);
			setLoading(false);
			setModalOpen(false);
			setModalType(null);
			router.push('/');
		}
	};

	return (
		<header className={styles.header}>
			<nav className={styles.nav}>
				<div className={styles.menu}>
					<Link
						href={dirty ? '' : '/'}
						className={styles.logo}
						onClick={() => {
							if (dirty) {
								setPendingRoute('/');
								setModalOpen(true);
								setModalType('dirty');
								return;
							}
							router.push(window.location.pathname);
							setModalOpen(false);
						}}
					>
						<Image
							src={logo}
							alt='Yoyo Collector Logo'
							className={styles.yoyo}
						/>
						<h1 className={styles.h1}>Yoyo Collector</h1>
					</Link>
				</div>
				<ul className={styles.ul}>
					{user ? (
						<>
							<li className={styles.li}>
								<Link
									href={dirty ? '' : '/collections'}
									className={styles.li}
									onClick={() => {
										if (dirty) {
											setPendingRoute('/collections');
											setModalOpen(true);
											setModalType('dirty');
											return;
										}
									}}
								>
									Collections
								</Link>
							</li>
							{user.secure_url ? (
								<>
									<img
										className={styles['profile-image']}
										src={user.secure_url}
										onClick={() => {
											if (dirty) {
												setModalOpen(true);
												setModalType('dirty');
												return;
											} else {
												if (active) {
													setAnimate(false);
												} else {
													setActive(true);
													setAnimate(true);
												}
											}
										}}
									/>
								</>
							) : (
								<>
									<li className={styles.li}>
										<Link
											href='/profile'
											className={styles.li}
											onClick={() => {
												if (dirty) {
													setPendingRoute('/profile');
													setModalOpen(true);
													setModalType('dirty');
													return;
												}
											}}
										>
											Profile
										</Link>
									</li>
									<li className={styles.li}>
										<Link
											href='/'
											onClick={() => {
												if (dirty) {
													setPendingRoute('logout');
													setModalOpen(true);
													setModalType('dirty');
													return;
												} else {
													handleLogout();
												}
											}}
											className={styles.li}
										>
											Logout
										</Link>
									</li>
								</>
							)}
						</>
					) : (
						<>
							<li
								className={styles.li}
								onClick={() => {
									setModalOpen(true);
									router.push(window.location.pathname);
									setModalType('login');
								}}
							>
								Login
							</li>
							<li
								className={styles.li}
								onClick={() => {
									setModalOpen(true);
									router.push(window.location.pathname);
									setModalType('register');
								}}
							>
								Register
							</li>
						</>
					)}
				</ul>
			</nav>
			{modalOpen && <Modal />}
			{active && (
				<div
					className={`${styles.hamburger} ${
						animate ? styles.active : styles.inactive
					}`}
				>
					<ul>
						<Link
							href={dirty ? '' : '/profile'}
							className={styles.li}
							onClick={() => {
								if (dirty) {
									setPendingRoute('/profile');
									setModalOpen(true);
									setModalType('dirty');
									if (active) {
										setAnimate(false);
									} else {
										setActive(true);
										setAnimate(true);
									}
									return;
								}
								if (active) {
									setAnimate(false);
								} else {
									setActive(true);
									setAnimate(true);
								}
							}}
						>
							Profile
						</Link>
						<Link
							href={dirty ? '' : '/profile/settings'}
							className={styles.li}
							onClick={() => {
								if (dirty) {
									setPendingRoute('/profile/settings');
									setModalOpen(true);
									setModalType('dirty');
									if (active) {
										setAnimate(false);
									} else {
										setActive(true);
										setAnimate(true);
									}
									return;
								}
								if (active) {
									setAnimate(false);
								} else {
									setActive(true);
									setAnimate(true);
								}
							}}
						>
							Settings
						</Link>
						<li className={styles.li}>Search</li>
						<Link
							href={dirty ? '' : '/'}
							onClick={() => {
								if (dirty) {
									setPendingRoute('logout');
									setModalOpen(true);
									setModalType('dirty');
									if (active) {
										setAnimate(false);
									} else {
										setActive(true);
										setAnimate(true);
									}
									return;
								} else {
									handleLogout();
									if (active) {
										setAnimate(false);
									} else {
										setActive(true);
										setAnimate(true);
									}
								}
							}}
							className={styles.li}
						>
							Logout
						</Link>
					</ul>
					<div
						className={styles['arrow-box']}
						onClick={() => {
							if (active) {
								setAnimate(false);
							} else {
								setActive(true);
								setAnimate(true);
							}
						}}
					>
						<div className={styles.arrow}></div>
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
