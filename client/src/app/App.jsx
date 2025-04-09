// External Libraries
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import '../../reset.css';
import './app.scss';

// Context
import { useAppContext } from '../context/AppContext.jsx';

// Pages
import Home from '../pages/HomePage/Home.jsx';
import Register from '../pages/Register/Register.jsx';
import PasswordReset from '../pages/PasswordResetPage/PasswordReset.jsx';

// Components
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';

const App = () => {
	const { user } = useAppContext();

	return (
		<div className='app'>
			<div className='container'>
				<Header />
				<main>
					<Routes>
						<Route path='/' element={<Home to='/' />} />
						<Route path='/register' element={<Register to='/register' />} />
						<Route
							path='/reset-password'
							element={user ? <Navigate to='/' /> : <PasswordReset />}
						/>
					</Routes>
				</main>
				<Footer />
			</div>
		</div>
	);
};

export default App;
