import React, { useState } from 'react';

//Utilities
import axiosInstance from '../../utils/axios';

// Libraries
import { Link } from 'react-router-dom';
import { Menu } from '@mui/icons-material';

// Styles
import styles from './header.module.scss';

// Components
import VerticalDivider from '../Dividers/VerticalDivider';

// Context
import { useAppContext } from '../../context/AppContext';

// Assets
import logo from '../../assets/site/Logo/red-yoyo-logo.png';

const Header = () => {
	const { user, setComponent, setUser } = useAppContext();

	const [active, setActive] = useState(false);
	const [animate, setAnimate] = useState(false);

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

	return (
		<header>
			<nav className={styles.nav}>
				<div className={styles.menu}>
					{/* {user && (
						<> */}
					<div className={styles.icon}>
						<Menu
							sx={{
								fontSize: '2rem',
							}}
							onClick={() => {
								if (active) {
									setAnimate((prev) => !prev);
									setTimeout(() => {
										setActive((prev) => !prev);
									}, 500);
								} else {
									setAnimate((prev) => !prev);
									setActive((prev) => !prev);
								}
							}}
						/>
					</div>
					<VerticalDivider />
					{/* </>
					)} */}
					<div className={styles.logo}>
						<img src={logo} className={styles.yoyo} />
						<Link to='/' onClick={() => setComponent('home')}>
							Yoyo Collector
						</Link>
					</div>
				</div>
				<ul>
					<li>About</li>
					<li onClick={() => setComponent('contact')}>Contact</li>
					{user ? (
						<>
							<li>Profile</li>
							<li>
								<Link to='/' onClick={handleLogout}>
									Logout
								</Link>
							</li>
						</>
					) : (
						<>
							<li onClick={() => setComponent('login')}>Login</li>
							<li onClick={() => setComponent('register')}>Register</li>
						</>
					)}
				</ul>
			</nav>
			{active && (
				<div
					className={`${styles.hamburger} ${
						animate ? styles.active : styles.inactive
					}`}
				>
					<ul>
						<li>My Collection</li>
						<li>All Collections</li>
						<li>All Manufacturers</li>
						<li>All Yoyos</li>
						<li>Search</li> {/* Users, Yoyos, Manufacturers, etc. */}
					</ul>
				</div>
			)}
		</header>
	);
};

export default Header;
