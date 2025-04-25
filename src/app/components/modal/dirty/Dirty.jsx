'use client';

// Libraries
import React from 'react';
import { useRouter } from 'next/navigation';

// Utils
import axiosInstance from '@/utils/axios';

// Styles
import styles from './dirty.module.scss';

// Context
import { useAppContext } from '@/app/context/AppContext';

function Dirty() {
	const {
		pendingRoute,
		profileSettingsFormData,
		user,
		setProfileSettingsFormData,
		setLoading,
		setPendingRoute,
		setUser,
		setCurrentlyEditing,
		setDirty,
		setModalOpen,
		setModalType,
	} = useAppContext();

	const router = useRouter();

	const handleLogout = async () => {
		try {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			setUser(null);
			await axiosInstance.post('/api/auth/logout', user);
		} catch (error) {
			console.error('Logout failed: ', error.response?.data || error.message);
		} finally {
			setProfileSettingsFormData(null);
			setCurrentlyEditing(null);
			setDirty(false);
			setLoading(false);
			setModalOpen(false);
			setModalType(null);
			router.push('/');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const submitData = profileSettingsFormData;

		try {
			setLoading(true);
			setModalOpen(false);
			const response = await axiosInstance.post(
				'/api/user/updateSettings',
				submitData
			);
			const user = response.data.user;
			setUser(user);
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
		} catch (error) {
			setLoading(false);
			console.log(
				'There was an error submitting profileSettings in components/modal/dirty/Dirty.jsx: ',
				error.message
			);
			return;
		} finally {
			if (pendingRoute) {
				if (pendingRoute === 'logout') {
					handleLogout();
				} else {
					router.push(pendingRoute);
				}
				setPendingRoute(null);
			}
			setCurrentlyEditing(null);
			setDirty(false);
			setLoading(false);
		}
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.h2}>Save Changes</h2>
			<div className={styles.buttons}>
				<button
					className={styles.button}
					onClick={() => {
						setModalOpen(false);
						setPendingRoute(null);
					}}
				>
					Cancel
				</button>
				<button className={styles.button} onClick={handleSubmit}>
					Save
				</button>
			</div>
		</div>
	);
}

export default Dirty;
