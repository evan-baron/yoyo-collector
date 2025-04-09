// External Libraries
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import '../../reset.css';
import styles from './app.module.scss';

// Context
import { useAppContext } from '../context/AppContext.jsx';

// Pages
import Home from '../pages/Home/Home.jsx';
import PasswordReset from '../pages/PasswordReset/PasswordReset.jsx';

// Components
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';
import HorizontalDivider from '../components/Dividers/HorizontalDivider.jsx';

const App = () => {
	const { user } = useAppContext();

	return (
		<div className={styles.app}>
			<Header />
			<main>
				<Routes>
					<Route path='/' element={<Home to='/' />} />
					<Route
						path='/reset-password'
						element={user ? <Navigate to='/' /> : <PasswordReset />}
					/>
				</Routes>
			</main>
			<HorizontalDivider />
			<Footer />
		</div>
	);
};

export default App;
