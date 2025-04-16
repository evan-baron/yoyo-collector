import React from 'react';

import styles from './profileSettings.module.scss';

import { East } from '@mui/icons-material';

function ProfileSettings({ setViewSettings }) {
	return (
		<div className={styles.profile}>
			Profile Settings
			<div
				className={styles['view-profile']}
				onClick={() => setViewSettings((prev) => !prev)}
			>
				<p className={styles.p}>How others see my profile</p>
				<East className={styles.east} sx={{ color: 'rgb(0, 200, 225)' }} />
			</div>
		</div>
	);
}

export default ProfileSettings;
