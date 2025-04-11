'use client';

// Libraries
import { createContext, useContext, useState, useEffect } from 'react';

// Utils
import axiosInstance from '@/utils/axios';

// Create Context
const AppContext = createContext(null);

// Create the context provider component
export const ContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [emailVerified, setEmailVerified] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchUserData = async () => {
			const token = localStorage.getItem('token');

			if (token) {
				try {
					const response = await axiosInstance.get('/api/token/authenticate', {
						headers: { Authorization: `Bearer ${token}` },
					});
					setUser(response.data);
					setEmailVerified(response.data.email_verified);
				} catch (error) {
					console.error('Error authenticating: ', error);
				}
			} else {
				try {
					const response = await axiosInstance.get('/api/token/authenticate', {
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

	// Returning the context provider with the values
	return (
		<AppContext.Provider
			value={{
				emailVerified,
				setEmailVerified,
				loading,
				setLoading,
				user,
				setUser,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

// Custom hook to access context
export const useAppContext = () => useContext(AppContext);
