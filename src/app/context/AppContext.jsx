'use client';

// Libraries
import { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

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
	const [token, setToken] = useState(null);
	const [tokenValid, setTokenValid] = useState(null);
	const [user, setUser] = useState(null);

	// URL & Query Parameters
	const searchParams = useSearchParams();
	const urlToken = searchParams.get('token');

	useEffect(() => {
		const validateUrlToken = async () => {
			const token = urlToken;

			if (!token) {
				return;
			}

			setToken(token);
			setModalOpen(true);
			setModalType('reset-password');

			try {
				const response = await axiosInstance.get(
					'/api/token/authenticateRecoveryToken',
					{
						params: { token },
					}
				);
				const { tokenValid, timeRemaining, email } = response.data;

				setResendEmail(email);
				setTokenValid(tokenValid);
				setTimeRemaining(tokenValid ? timeRemaining : 0);
			} catch (error) {
				console.error('Error authenticating token:', error);
			}
		};
		validateUrlToken();
	}, [urlToken]);

	useEffect(() => {
		const fetchUserData = async () => {
			setLoading(true);
			const token = localStorage.getItem('token');

			if (token) {
				try {
					const response = await axiosInstance.get('/api/token/authenticate', {
						headers: { Authorization: `Bearer ${token}` },
					});
					if (response.data && response.data.id) {
						setUser(response.data);
						setEmailVerified(response.data.email_verified);
					} else {
						// If the response does not contain user data, reset the user
						setUser(null);
					}
				} catch (error) {
					console.error('Error authenticating: ', error);
				}
			} else {
				try {
					const response = await axiosInstance.get('/api/token/authenticate', {
						withCredentials: true,
					});

					if (response.data && response.data.id) {
						setUser({ ...response.data });
						setEmailVerified(response.data.email_verified);
					} else {
						// If the response does not contain user data, reset the user
						setUser(null);
					}
				} catch (error) {
					console.error('Error authenticating: ', error);
				}
			}

			setLoading(false);
		};

		fetchUserData();
	}, []);

	// Returning the context provider with the values
	return (
		<AppContext.Provider
			value={{
				emailVerified,
				loading,
				modalOpen,
				modalType,
				resendEmail,
				timeRemaining,
				token,
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
