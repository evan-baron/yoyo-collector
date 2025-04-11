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
import { useAppContext } from '../../context/AppContext';

// Assets
import logo from '@/app/assets/red-yoyo-logo.png';

const Header = () => {
	const { user, setUser } = useAppContext();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await axiosInstance.post('/logout', user);
			setUser(null);
		} catch (error) {
			console.error('Logout failed: ', error.response?.data || error.message);
		}
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setUser(null);
	};

	const handleNavigate = (path) => {
		router.push(path);
	};

	return (
		<header className={styles.header}>
			<nav className={styles.nav}>
				<div className={styles.menu}>
					<div className={styles.logo}>
						<Image
							src={logo}
							alt='Yoyo Collector Logo'
							className={styles.yoyo}
						/>
						<Link href='/' onClick={() => navigateWithHistory('home')}>
							Yoyo Collector
						</Link>
					</div>
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
								onClick={() => handleNavigate('/login')}
							>
								Login
							</li>
							<li
								className={styles.li}
								onClick={() => handleNavigate('/register')}
							>
								Register
							</li>
						</>
					)}
				</ul>
			</nav>
		</header>
	);
};

export default Header;
