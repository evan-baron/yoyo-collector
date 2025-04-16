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
import ProfileSettings from '../components/profileSettings/ProfileSettings';

function Profile() {
	const { user } = useAppContext();

	const [viewSettings, setViewSettings] = useState(true); // DONT FORGET TO CHANGE THIS BACK TO FALSE

	const router = useRouter();

	useEffect(() => {
		if (!user) router.push('/');
	}, [user]);

	if (!user) return null;

	return (
		<div className={styles.profile}>
			{viewSettings ? (
				<ProfileSettings setViewSettings={setViewSettings} />
			) : (
				<div className={styles.overview}>
					Profile Overview
					<Settings
						onClick={() => setViewSettings((prev) => !prev)}
						sx={{ cursor: 'pointer' }}
					/>
				</div>
			)}

			{/* <form className={styles['profile-form']}>
				<div className={styles['profile-field']}>
					<h2 className={styles.h2}>Privacy</h2>
					<div className={styles['radio-container']}>
						<label htmlFor='public'>
							<input
								type='radio'
								name='public'
								id='public'
								value='public'
								className={styles.radio}
							/>
							Public
						</label>
						<label htmlFor='anonymous'>
							<input
								type='radio'
								name='anonymous'
								id='anonymous'
								value='anonymous'
								className={styles.radio}
							/>
							Anonymous
						</label>
						<label htmlFor='private'>
							<input
								type='radio'
								name='private'
								id='private'
								value='private'
								className={styles.radio}
							/>
							Private
						</label>
					</div>
				</div>
				<div className={styles['profile-field']}>
					<h2 className={styles.h2}>Name</h2>
					<label htmlFor='first'>
						First
						<input className={styles['form-data']} type='text' />
					</label>
					<label htmlFor='last'>
						Last
						<input className={styles['form-data']} type='text' />
					</label>
				</div>
				<div className={styles['profile-field']}>
					<h2 className={styles.h2}>Handle</h2>
					<label htmlFor='handle'>
						<input className={styles['form-data']} type='text' />
					</label>
				</div>
				<div className={styles['profile-field']}>
					<h2 className={styles.h2}>Email</h2>
					<label htmlFor='email'>
						<input className={styles['form-data']} type='text' />
					</label>
				</div>
				<div className={styles['profile-field']}>
					<h2 className={styles.h2}>Location</h2>
					<label htmlFor='location'>
						<label htmlFor='Country'>
							Country
							<input className={styles['form-data']} type='text' />
						</label>

						<label htmlFor='State'>
							Country
							<input className={styles['form-data']} type='text' />
						</label>

						<label htmlFor='City'>
							Country
							<input className={styles['form-data']} type='text' />
						</label>
					</label>
				</div>
				<div className={styles['profile-field']}>
					<h2 className={styles.h2}>Profile Picture</h2>
					<div className={styles.picture}></div>
					<button className={styles.upload}>Upload</button>
					<button className={styles.change}>Change</button>
				</div>
			</form> */}
		</div>
	);
}

export default Profile;
