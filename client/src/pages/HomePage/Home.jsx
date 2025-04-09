// External Libraries
import React, { useEffect } from 'react';

// Assets & Styles
import styles from './home.module.scss';

// MUI Icons
import { Login, Mail } from '@mui/icons-material';

// Context
import { useAppContext } from '../../context/AppContext';

const Home = () => {
	const {
		user,
		// screenHeight,
		// screenWidth,
		// sideActive,
		// setSideActive,
		// component,
		// setComponent,
	} = useAppContext();

	useEffect(() => {}, [user]);

	return <main className={styles.home}>Home</main>;
};

export default Home;
