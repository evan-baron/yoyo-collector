'use client';

// Libraries
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Styles
import styles from './profile.module.scss';

// MUI
import { Settings } from '@mui/icons-material';

// Context
import { useAppContext } from '../context/AppContext';

// Components
import SettingsConsole from '../components/settingsConsole/SettingsConsole';

function Profile() {
	const { user, authChecked } = useAppContext();

	const [viewSettings, setViewSettings] = useState(true); // DONT FORGET TO CHANGE THIS BACK TO FALSE

	const router = useRouter();

	// Reroutes if not logged in
	useEffect(() => {
		if (!authChecked) return;
		if (!user) {
			router.push('/');
		}
	}, [authChecked]);

	if (!user) return null;

	return (
		<div className={styles.profile}>
			{viewSettings ? (
				<SettingsConsole setViewSettings={setViewSettings} />
			) : (
				<div className={styles.overview}>
					Profile Overview
					<Settings
						onClick={() => setViewSettings((prev) => !prev)}
						sx={{ cursor: 'pointer' }}
					/>
				</div>
			)}
		</div>
	);
}

export default Profile;
