// External Libraries
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Assets & Styles
import styles from './home.module.scss';

// MUI Icons
import {} from '@mui/icons-material';

// Context
import { useAppContext } from '../../context/AppContext';

// Components
import Register from '../Register/Register';
import LoginForm from '../Login/LoginForm';
import ContactForm from '../../components/ContactForm/ContactForm';

// Utils
import axiosInstance from '../../utils/axios';

const Home = () => {
	const {
		user,
		// screenHeight,
		// screenWidth,
		component,
		emailVerified,
		// setComponent,
	} = useAppContext();

	const [resend, setResend] = useState(false);
	const [linkSent, setLinkSent] = useState(false);

	useEffect(() => {}, [user]);

	const handleResend = async () => {
		setResend((prev) => !prev);
		try {
			await axiosInstance.post('/verify-email', {
				email: user.email,
				tokenName: 'email_verification',
			});
			setLinkSent((prev) => !prev);
			setResend((prev) => !prev);
		} catch (err) {
			console.log(
				'There was an error at handleResend in client/pages/Home/Home.jsx',
				err
			);
			setResend((prev) => !prev);
		}
	};

	return (
		<>
			{component === 'home' && (
				<section className={styles.home}>
					{user ? (
						emailVerified ? (
							<div className={styles.verified}>
								<p>Hello {user.first_name}</p>
							</div>
						) : (
							<div className={styles.verify}>
								<div>
									{linkSent
										? 'A new link has been sent to your email.'
										: 'Please verify your email'}
								</div>
								{!linkSent && (
									<button disabled={resend} onClick={handleResend}>
										Resend Link
									</button>
								)}
							</div>
						)
					) : (
						<div>Hello</div>
					)}
				</section>
			)}
			{component === 'register' && <Register />}
			{component === 'login' && <LoginForm />}
			{component === 'contact' && <ContactForm />}
		</>
	);
};

export default Home;
