// External Libraries
import React, { useEffect } from 'react';

// Assets & Styles
import styles from './home.module.scss';

// MUI Icons
import { Login, Mail } from '@mui/icons-material';

// Context
import { useAppContext } from '../../context/AppContext';

// Components
import Register from '../Register/Register';
import LoginForm from '../Login/LoginForm';
import ContactForm from '../../components/ContactForm/ContactForm';

const Home = () => {
	const {
		user,
		// screenHeight,
		// screenWidth,
		component,
		// setComponent,
	} = useAppContext();

	useEffect(() => {}, [user]);

	return (
		<>
			{component === 'home' && <section className={styles.home}>Home</section>}
			{component === 'register' && <Register />}
			{component === 'login' && <LoginForm />}
			{component === 'contact' && <ContactForm />}
		</>
	);
};

export default Home;
