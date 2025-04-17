'use client';

// Libraries
import React from 'react';

// Styles
import styles from './profileSettings.module.scss';

// MUI
import { East } from '@mui/icons-material';

// Context
import { useAppContext } from '@/app/context/AppContext';

function ProfileSettings({ setViewSettings }) {
	const { user } = useAppContext();
	const { first_name, last_name, handle, email } = user;
	console.log(user);

	return (
		<div className={styles.profile}>
			<h2 className={styles.h2}>Profile Settings</h2>
			<form className={styles['profile-form']}>
				<div className={`${styles['form-item']} ${styles['profile-data']}`}>
					<label htmlFor='first' className={styles.label}>
						First Name
						<input type='text' placeholder='First' className={styles.input} />
					</label>
					<label htmlFor='last' className={styles.label}>
						Last Name
						<input type='text' placeholder='Last' className={styles.input} />
					</label>
					<label htmlFor='handle' className={styles.label}>
						Handle
						<input
							type='text'
							placeholder='Nickname'
							className={styles.input}
						/>
					</label>
					<label htmlFor='favorite' className={styles.label}>
						Favorite Yoyo
						<input
							type='text'
							placeholder='Mt Fuji Draupnir'
							className={styles.input}
						/>
					</label>
					<label htmlFor='location' className={styles.label}>
						Location
						<input type='text' placeholder='Earth' className={styles.input} />
					</label>
				</div>
				<div
					className={`${styles['form-item']} ${styles['profile-picture']}`}
				></div>
				<div
					className={`${styles['form-item']} ${styles['profile-summary']}`}
				></div>
			</form>
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
