'use client';

import React from 'react';

//Utilities
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
import logo from '@/app/assets/red-yoyo-logo.png';

// Components
import Modal from '@/app/components/modal/Modal';

const Header = () => {
	const { modalOpen, setModalOpen, setModalType, user, setUser } =
		useAppContext();

	const router = useRouter();

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
						<h1>Yoyo Collector</h1>
					</Link>
				</div>
				<ul className={styles.ul}>
					{user ? (
						<>
							<li className={styles.li}>Profile</li>
							<li className={styles.li}>
								<Link href='/' onClick={handleLogout}>
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
