'use client';

import React, { useEffect } from 'react';

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
import logo from '@/app/assets/uip5-yoyo-logo.png';

// Components
import Modal from '@/app/components/modal/modal';

const Header = () => {
	const {
		modalOpen,
		setModalOpen,
		setModalType,
		user,
		setUser,
		setProfileSettingsFormData,
		setCurrentlyEditing,
		setDirty,
		setLoading,
	} = useAppContext();

	const router = useRouter();

	useEffect(() => {
		if (!user) return;

		if (user && !user.email_verified) {
			setModalOpen(true);
			setModalType('verify-email');
		}
	}, [user]);

	const handleLogout = async () => {
		try {
			await axiosInstance.post('/api/auth/logout', user);
			setUser(null);
		} catch (error) {
			console.error('Logout failed: ', error.response?.data || error.message);
		}
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setUser(null);
		setProfileSettingsFormData(null);
		setCurrentlyEditing(null);
		setDirty(false);
		setLoading(false);
		setModalOpen(false);
		setModalType(null);
		router.push('/');
	};

	return (
		<header className={styles.header}>
			<nav className={styles.nav}>
				<div className={styles.menu}>
					<Link
						href='/'
						className={styles.logo}
						onClick={() => {
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
								<Link href='/collections' className={styles.li}>
									Collections
								</Link>
							</li>
							<li className={styles.li}>
								<Link href='/profile' className={styles.li}>
									Profile
								</Link>
							</li>
							<li className={styles.li}>
								<Link href='/' onClick={handleLogout} className={styles.li}>
									Logout
								</Link>
							</li>
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
		</header>
	);
};

export default Header;
