import React from 'react';

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

const Header = () => {
	const { user, setComponent, setUser } = useAppContext();

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
					<div className={styles.hamburger}>
						<Menu
							sx={{
								fontSize: '2rem',
							}}
						/>
					</div>
					<VerticalDivider />
					<Link
						to='/'
						className={styles.logo}
						onClick={() => setComponent('home')}
					>
						Yoyo Collector
					</Link>
				</div>
				<ul>
					<li>About</li>
					<li onClick={() => setComponent('contact')}>Contact</li>
					<li onClick={() => setComponent('register')}>Register</li>
					<li onClick={() => setComponent('login')}>Login</li>
					<li>
						<Link to='/' onClick={handleLogout}>
							Logout
						</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
