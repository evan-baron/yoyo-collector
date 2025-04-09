import React from 'react';
import axiosInstance from '../../utils/axios';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import styles from './header.module.scss';

const Header = () => {
	const { user, setUser } = useAppContext();

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
				<Link to='/' className={styles.logo}>
					Yoyo Collector
				</Link>
				<ul>
					<li>About</li>
					<li>Contact</li>
					<li>
						<Link to='/register'>Register</Link>
					</li>
					<li>Login</li>
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
