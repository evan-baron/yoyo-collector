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
	const [profileSettingsFormData, setProfileSettingsFormData] = useState({
		first: '',
		last: '',
		handle: '',
		yoyo: '',
		brand: '',
		city: '',
		state: '',
		country: '',
		description: '',
		privacy: '',
	});
	const [dirty, setDirty] = useState(false);
	const [currentlyEditing, setCurrentlyEditing] = useState(null);
	const [profilePicture, setProfilePicture] = useState(null);

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
			} else {
				setUser(null);
			}
		} catch (error) {
			console.error('Error authenticating: ', error);
		} finally {
			setLoading(false);
		}
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
				if (!user) return;
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
					if (!userData) return;
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

	useEffect(() => {
		if (!user) return;

		setProfileSettingsFormData({
			first: user.first_name || '',
			last: user.last_name || '',
			handle: user.handle || '',
			yoyo: user.favorite_yoyo || '',
			brand: user.favorite_brand || '',
			city: user.city || '',
			state: user.state || '',
			country: user.country || '',
			description: user.description || '',
			privacy: user.privacy || '',
		});
	}, [user]);

	// Gets current profile picture if exists
	useEffect(() => {
		if (!user) return;

		const getProfilePicture = async () => {
			const response = await axiosInstance.get(
				`/api/user/profilePictures?type=profile`
			);
			const { secure_url } = response.data;
			setProfilePicture(secure_url);
		};
		getProfilePicture();
	}, [user]);

	return (
		<AppContext.Provider
			value={{
				currentlyEditing,
				dirty,
				emailVerified,
				profileSettingsFormData,
				loading,
				modalOpen,
				modalType,
				profilePicture,
				resendEmail,
				timeRemaining,
				tokenValid,
				user,
				setCurrentlyEditing,
				setDirty,
				setEmailVerified,
				setProfileSettingsFormData,
				setLoading,
				setModalOpen,
				setModalType,
				setProfilePicture,
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
