'use client';

// Libraries
import React, { useState, useEffect } from 'react';

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
		first: { editing: false, value: first_name || '' },
		last: { editing: false, value: last_name || '' },
		handle: { editing: false, value: handle || '' },
		yoyo: { editing: false, value: favorite_yoyo || '' },
		brand: { editing: false, value: favorite_brand || '' },
		city: { editing: false, value: city || '' },
		state: { editing: false, value: state || '' },
		country: { editing: false, value: country || '' },
		description: { editing: false, value: description || '' },
		privacy: { editing: false, value: privacy || '' },
	});

	const [dirty, setDirty] = useState(false);

	useEffect(() => {
		setDirty(
			formData.first !== first_name ||
				formData.last !== last_name ||
				formData.handle !== handle ||
				formData.yoyo !== favorite_yoyo ||
				formData.brand !== favorite_brand ||
				formData.city !== city ||
				formData.state !== state ||
				formData.country !== country ||
				formData.description !== description ||
				formData.privacy !== privacy
		);
	}, [
		formData,
		first_name,
		last_name,
		handle,
		favorite_yoyo,
		favorite_brand,
		city,
		state,
		country,
		description,
		privacy,
	]);

	const location = () => {
		return (
			[formData.city.value, formData.state.value, formData.country.value]
				.filter(Boolean)
				.join(', ') || ''
		);
	};

	console.log(user);
	console.log(formData);

	const handleChange = (e) => {
		const { name, value } = e.target;
		console.log(name, value);
		setFormData((prev) => ({
			...prev,
			[name]: { value: value },
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
								value={formData.first.value}
								handleChange={handleChange}
							/>

							<FormInput
								type='text'
								name='last'
								value={formData.last.value}
								handleChange={handleChange}
							/>
						</div>
						<FormInput
							type='text'
							name='handle'
							value={formData.handle.value}
							handleChange={handleChange}
						/>

						<FormInput
							type='text'
							name='yoyo'
							value={formData.yoyo.value}
							handleChange={handleChange}
						/>

						<FormInput
							type='text'
							name='brand'
							value={formData.brand.value}
							handleChange={handleChange}
						/>

						<FormInput
							type='text'
							name='location'
							value={location()}
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
								value={formData.description.value || ''}
							></textarea>
							<div className={styles['max-length']}>
								{300 - (formData.description?.length || 0)}
							</div>
						</div>
					</div>
				</div>
				{dirty && (
					<button className={styles.button} type='button'>
						Save Changes
					</button>
				)}
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
