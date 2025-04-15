'use client';

// Libraries
import React from 'react';

// Styles
import styles from './profile.module.scss';

// Context
import { useAppContext } from '../context/AppContext';

function Profile() {
	const { user } = useAppContext();

	return (
		<div className={styles.profile}>
			<form className={styles['profile-form']}>
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

						{/* State will be dependent on Country */}
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
			</form>
		</div>
	);
}

export default Profile;
