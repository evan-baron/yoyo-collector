// External Libraries
import { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// Utilities
import axiosInstance from '../utils/axios';

// Create context
const AppContext = createContext(null);

// Create provider component
export const ContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [component, setComponent] = useState('home');
	const [searchParams] = useSearchParams();
	const [emailVerified, setEmailVerified] = useState(null);
	const [screenHeight, setScreenHeight] = useState(window.innerHeight);
	const [screenWidth, setScreenWidth] = useState(window.innerWidth);

	const urlToken = searchParams.get('token');

	//Verification Token Validation
	useEffect(() => {
		const verifyEmail = async () => {
			if (!urlToken) {
				console.log('No token found. Redirecting to home.');
				return;
			} else {
				try {
					console.log('Trying to authenticate verify token...');
					const response = await axiosInstance.get('/authenticateVerifyToken', {
						params: { token: urlToken },
					});
					const { userId, tokenType, emailVerified } = response.data;

					if (tokenType === 'email_verification') {
						if (emailVerified === 0) {
							try {
								await axiosInstance.post('/updateVerified', {
									user_id: userId,
									token: urlToken,
								});
								setEmailVerified(true);
								setComponent('home');

								const newUrl =
									window.location.origin + window.location.pathname;
								window.history.replaceState({}, document.title, newUrl);
							} catch (error) {
								console.log('There was an error.', error);
							}
						} else if (emailVerified === 1) {
							setEmailVerified(true);
						} else {
							console.error('Unrecognized emailVerified response.');
						}
					}
				} catch (error) {
					console.error('Error authenticating token: ', error);
				}
			}
		};
		verifyEmail();
	}, [urlToken]);

	useEffect(() => {
		const fetchUserData = async () => {
			const token = localStorage.getItem('token');

			if (token) {
				try {
					const response = await axiosInstance.get('/authenticate', {
						headers: { Authorization: `Bearer ${token}` },
					});
					setUser(response.data);
					setEmailVerified(response.data.email_verified);
				} catch (error) {
					console.error('Error authenticating: ', error);
				}
			} else {
				try {
					const response = await axiosInstance.get('/authenticate', {
						withCredentials: true,
					});
					setUser(response.data);
					setEmailVerified(response.data.email_verified);
				} catch (error) {
					console.error('Error authenticating: ', error);
				}
			}

			setLoading(false);
		};

		fetchUserData();
	}, []);

	//Screenwidth Tracking
	useEffect(() => {
		const handleResize = () => {
			setScreenHeight(window.innerHeight);
			setScreenWidth(window.innerWidth);
		};

		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<AppContext.Provider
			value={{
				component,
				setComponent,
				emailVerified,
				user,
				setUser,
				loading,
				screenHeight,
				screenWidth,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => useContext(AppContext);
