'use client';

// Libraries
import React, { useState } from 'react';

// Styles
import styles from './profileSettings.module.scss';

// MUI
import { East } from '@mui/icons-material';

// Context
import { useAppContext } from '@/app/context/AppContext';

function ProfileSettings({ setViewSettings }) {
	const { user } = useAppContext();
	const {
		first_name,
		last_name,
		handle,
		favorite_yoyo,
		favorite_brand,
		country,
		state,
		city,
		description,
		privacy,
	} = user;

	const location = () => {
		return [city, state, country].filter(Boolean).join(', ');
	};

	const [formData, setFormData] = useState({
		first: first_name,
		last: last_name,
		handle: handle,
		yoyo: favorite_yoyo,
		brand: favorite_brand,
		location: location(),
		description: description,
		privacy: privacy,
	});
	const [maxLength, setMaxLength] = useState(300);

	console.log(user);
	console.log(formData);

	const handleChange = (e) => {
		const { name, value } = e.target;
		console.log(name);
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (name === 'description') {
			setMaxLength(300 - e.target.value.length);
		}
	};

	return (
		<div className={styles.profile}>
			<h2 className={styles.h2}>Profile Settings</h2>
			<form className={styles['profile-form']}>
				<div className={styles.top}>
					<fieldset className={styles.item}>
						<h3 htmlFor='privacy' className={styles.h3}>
							{`Privacy (How you want to appear to others)`}
						</h3>
						<div className={styles.options}>
							<div className={styles['radio-item']}>
								<input
									className={styles.radio}
									type='radio'
									name='privacy'
									value='public'
									checked={formData.privacy === 'public'}
									onChange={handleChange}
								/>
								<label htmlFor='public' className={styles['radio-label']}>
									Public
								</label>
							</div>
							<div className={styles['radio-item']}>
								<input
									className={styles.radio}
									type='radio'
									name='privacy'
									value='anonymous'
									checked={formData.privacy === 'anonymous'}
									onChange={handleChange}
								/>

								<label htmlFor='anonymous' className={styles['radio-label']}>
									Anonymous
								</label>
							</div>
							<div className={styles['radio-item']}>
								<input
									className={styles.radio}
									type='radio'
									name='privacy'
									value='private'
									checked={formData.privacy === 'private'}
									onChange={handleChange}
								/>

								<label htmlFor='private' className={styles['radio-label']}>
									Private
								</label>
							</div>
						</div>
					</fieldset>
				</div>
				<div className={styles.middle}>
					<div className={`${styles['form-item']} ${styles['profile-data']}`}>
						<div className={styles.names}>
							<div className={styles.item}>
								<label htmlFor='first' className={styles.label}>
									First Name
								</label>
								<input
									type='text'
									name='first'
									placeholder='First'
									className={styles.input}
									value={formData.first}
									onChange={handleChange}
								/>
							</div>
							<div className={styles.item}>
								<label htmlFor='last' className={styles.label}>
									Last Name
								</label>
								<input
									type='text'
									name='last'
									placeholder='Last'
									className={styles.input}
									value={formData.last}
									onChange={handleChange}
								/>
							</div>
						</div>
						<div className={styles.item}>
							<label htmlFor='handle' className={styles.label}>
								Handle
							</label>
							<input
								type='text'
								name='handle'
								placeholder='Nickname'
								className={styles.input}
								value={formData.handle}
								onChange={handleChange}
							/>
						</div>
						<div className={styles.item}>
							<label htmlFor='yoyo' className={styles.label}>
								Favorite Yoyo
							</label>
							<input
								type='text'
								name='yoyo'
								placeholder='Duncan Imperial'
								className={styles.input}
								value={formData.yoyo}
								onChange={handleChange}
							/>
						</div>
						<div className={styles.item}>
							<label htmlFor='brand' className={styles.label}>
								Favorite Brand
							</label>
							<input
								type='text'
								name='brand'
								placeholder='Duncan'
								className={styles.input}
								value={formData.brand}
								onChange={handleChange}
							/>
						</div>
						<div className={styles.item}>
							<label htmlFor='location' className={styles.label}>
								Location
							</label>
							<input
								type='text'
								name='location'
								placeholder='Earth'
								className={styles.input}
								value={formData.location}
								onChange={handleChange}
							/>
						</div>
					</div>
					<div
						className={`${styles['form-item']} ${styles['profile-picture']}`}
					></div>
				</div>
				<div className={styles.bottom}>
					<div
						className={`${styles['form-item']} ${styles['profile-summary']}`}
					>
						<div className={styles.item}>
							<label htmlFor='description' className={styles.label}>
								Tell us about yourself
							</label>
							<textarea
								className={styles.textarea}
								name='description'
								id='description'
								maxLength={300}
								rows='3'
								placeholder='I like long walks on the beach, throwing yoyos in the rain, and walking the dog with expensive yoyos.'
								onChange={handleChange}
								value={formData.description}
							></textarea>
							<div className={styles['max-length']}>{maxLength}</div>
						</div>
					</div>
				</div>
				<button className={styles.button} type='button'>
					Save Changes
				</button>
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
