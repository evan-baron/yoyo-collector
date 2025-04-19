'use client';

// Libraries
import React from 'react';

// Utils
import axiosInstance from '@/utils/axios';

// Styles
import styles from './dirty.module.scss';

// Context
import { useAppContext } from '@/app/context/AppContext';

function Dirty() {
	const {
		profileSettingsFormData,
		setProfileSettingsFormData,
		setLoading,
		setUser,
		setCurrentlyEditing,
		setDirty,
		setModalOpen,
		user,
	} = useAppContext();

	const { id } = user;

	const handleSubmit = async (e) => {
		e.preventDefault();
		const submitData = profileSettingsFormData;
		submitData.id = id;

		try {
			setLoading(true);
			setModalOpen(false);
			const response = await axiosInstance.post(
				'api/user/updateSettings',
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
			setCurrentlyEditing(null);
			setDirty((prev) => !prev);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log(
				'There was an error submitting profileSettings in components/settingsConsole/profileSettings.jsx: ',
				error.message
			);
			return;
		}
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.h2}>Save Changes</h2>
			<div className={styles.buttons}>
				<button className={styles.button} onClick={() => setModalOpen(false)}>
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
