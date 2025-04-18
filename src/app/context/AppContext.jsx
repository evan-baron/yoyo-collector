'use client';

// Libraries
import { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Utils
import axiosInstance from '@/utils/axios';

// Create Context
const AppContext = createContext(null);

// Create the context provider component
export const ContextProvider = ({ children }) => {
	const [emailVerified, setEmailVerified] = useState(false);
	const [loading, setLoading] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [modalType, setModalType] = useState(null);
	const [resendEmail, setResendEmail] = useState(null);
	const [timeRemaining, setTimeRemaining] = useState(null);
	const [tokenValid, setTokenValid] = useState(null);
	const [user, setUser] = useState(null);

	const router = useRouter();

	// URL & Query Parameters
	const searchParams = useSearchParams();
	const urlToken = searchParams.get('token');

	// Helper function to fetch user data
	const fetchUserData = async () => {
		setLoading(true);
		const token = localStorage.getItem('token');

		try {
			const config = token
				? { headers: { Authorization: `Bearer ${token}` } }
				: { withCredentials: true };

			const response = await axiosInstance.get(
				'/api/token/authenticate',
				config
			);

			if (response.data?.id) {
				return response.data;
			}

			setUser(null);
		} catch (error) {
			console.error('Error authenticating: ', error);
		} finally {
			setLoading(false);
		}

		// ORIGINAL CODE BELOW

		// if (token) {
		// 	try {
		// 		const response = await axiosInstance.get('/api/token/authenticate', {
		// 			headers: { Authorization: `Bearer ${token}` },
		// 		});
		// 		if (response.data && response.data.id) {
		// 			return response.data;
		// 		} else {
		// 			// If the response does not contain user data, reset the user
		// 			setUser(null);
		// 		}
		// 	} catch (error) {
		// 		console.error('Error authenticating: ', error);
		// 	}
		// } else {
		// 	try {
		// 		const response = await axiosInstance.get('/api/token/authenticate', {
		// 			withCredentials: true,
		// 		});

		// 		if (response.data && response.data.id) {
		// 			return response.data;
		// 		} else {
		// 			// If the response does not contain user data, reset the user
		// 			setUser(null);
		// 		}
		// 	} catch (error) {
		// 		console.error('Error authenticating: ', error);
		// 	}
		// setLoading(false)
		// }
	};

	// Helper function to fetch token data
	const getTokenData = async (param) => {
		try {
			const response = await axiosInstance.get('/api/token/getTokenData', {
				params: { token: param },
			});

			return response.data;
		} catch (error) {
			console.error('Error in helper function getTokenData in AppContext.jsx');
		}
	};

	useEffect(() => {
		const fetchAndValidate = async () => {
			// First we're going to check if there's NOT a token in the url
			if (!urlToken) {
				// There isn't a token in the url, so hydrate the page with the user data if there is any
				const user = await fetchUserData();
				setUser(user);
			} else {
				// There is a token! Find the token data
				const { tokenData } = await getTokenData(urlToken);

				// Has the token been used? Return
				if (tokenData.token_used) {
					router.push(window.location.pathname);
					return;
				}

				// If the token is a verify token
				if (tokenData.token_name === 'email_verification') {
					// Updating verify token from not used to used
					const response = await axiosInstance.put(
						'/api/token/authenticateVerifyToken',
						{
							token: urlToken,
							id: tokenData.user_id,
						}
					);

					const { userData } = response.data;
					setUser(userData);
					router.push(window.location.pathname);
					setModalOpen(true);
					setModalType('thank-you');

					// If the token is a password recovery token
				} else if (tokenData.token_name === 'email_recovery') {
					try {
						const response = await axiosInstance.get(
							'/api/token/authenticateRecoveryToken',
							{
								params: { token: urlToken },
							}
						);
						const { tokenValid, timeRemaining, email } = response.data;

						setResendEmail(email);
						setTokenValid(tokenValid);
						setTimeRemaining(tokenValid ? timeRemaining : 0);
						setModalType('reset-password');
						setModalOpen(true);
					} catch (error) {
						console.error('Error authenticating token:', error);
					}

					// If the token is unknown
				} else {
					console.error('unknown token');
				}
			}
		};
		fetchAndValidate();
	}, []);

	return (
		<AppContext.Provider
			value={{
				emailVerified,
				loading,
				modalOpen,
				modalType,
				resendEmail,
				timeRemaining,
				tokenValid,
				user,
				setEmailVerified,
				setLoading,
				setModalOpen,
				setModalType,
				setResendEmail,
				setTimeRemaining,
				setTokenValid,
				setUser,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

// Custom hook to access context
export const useAppContext = () => useContext(AppContext);
