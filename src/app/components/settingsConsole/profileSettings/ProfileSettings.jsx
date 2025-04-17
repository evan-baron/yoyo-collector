'use client';

// Libraries
import React, { useState } from 'react';

// Styles
import styles from './profileSettings.module.scss';

// MUI
import { East } from '@mui/icons-material';

// Components
import FormInput from '../../formInput/FormInput';

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

	const [formData, setFormData] = useState({
		first: first_name,
		last: last_name,
		handle: handle,
		yoyo: favorite_yoyo,
		brand: favorite_brand,
		city: city,
		state: state,
		country: country,
		description: description,
		privacy: privacy,
	});

	const location = () => {
		return [formData.city, formData.state, formData.country]
			.filter(Boolean)
			.join(', ');
	};

	console.log(user);
	console.log(formData);

	const handleChange = (e) => {
		const { name, value } = e.target;
		console.log(name);
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
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
									id='public'
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
									id='anonymous'
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
									id='private'
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
							<FormInput
								type='text'
								name='first'
								value={formData.first}
								handleChange={handleChange}
							/>

							<FormInput
								type='text'
								name='last'
								value={formData.last}
								handleChange={handleChange}
							/>
						</div>
						<FormInput
							type='text'
							name='handle'
							value={formData.handle}
							handleChange={handleChange}
						/>

						<FormInput
							type='text'
							name='yoyo'
							value={formData.yoyo}
							handleChange={handleChange}
						/>

						<FormInput
							type='text'
							name='brand'
							value={formData.brand}
							handleChange={handleChange}
						/>

						<FormInput
							type='text'
							name='location'
							value={formData.location}
							handleChange={handleChange}
						/>
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
								value={formData.description || ''}
							></textarea>
							<div className={styles['max-length']}>
								{300 - (formData.description?.length || 0)}
							</div>
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
