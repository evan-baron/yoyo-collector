'use client';

// Libraries
import React, { useState, useEffect } from 'react';

// Utils
import axiosInstance from '@/utils/axios';

// Styles
import styles from './profileSettings.module.scss';

// MUI
import { Check, East, Edit } from '@mui/icons-material';

// Components
import FormInput from '../../formInput/FormInput';

// Context
import { useAppContext } from '@/app/context/AppContext';

function ProfileSettings({ setViewSettings }) {
	const {
		user,
		profileSettingsFormData,
		setProfileSettingsFormData,
		setLoading,
	} = useAppContext();

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
		id,
	} = user;

	const initialData = {
		first: first_name || '',
		last: last_name || '',
		handle: handle || '',
		yoyo: favorite_yoyo || '',
		brand: favorite_brand || '',
		city: city || '',
		state: state || '',
		country: country || '',
		description: description || '',
		privacy: privacy || '',
	};

	const [currentlyEditing, setCurrentlyEditing] = useState(null);
	const [dirty, setDirty] = useState(false);

	useEffect(() => {
		setDirty(
			profileSettingsFormData.first !== initialData.first ||
				profileSettingsFormData.last !== initialData.last ||
				profileSettingsFormData.handle !== initialData.handle ||
				profileSettingsFormData.yoyo !== initialData.yoyo ||
				profileSettingsFormData.brand !== initialData.brand ||
				profileSettingsFormData.city !== initialData.city ||
				profileSettingsFormData.state !== initialData.state ||
				profileSettingsFormData.country !== initialData.country ||
				profileSettingsFormData.description !== initialData.description ||
				profileSettingsFormData.privacy !== initialData.privacy
		);
	}, [
		profileSettingsFormData,
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
			[
				profileSettingsFormData.city,
				profileSettingsFormData.state,
				profileSettingsFormData.country,
			]
				.filter(Boolean)
				.join(', ') || ''
		);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setProfileSettingsFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const submitData = Object.fromEntries(
			Object.entries(profileSettingsFormData).map(([key, value]) => [
				key,
				value === '' ? null : value,
			])
		);
		console.log(submitData);
		submitData.id = id;

		try {
			setLoading(true);
			await axiosInstance.post('api/user/updateSettings', submitData);
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
		<div className={styles.profile}>
			<h2 className={styles.h2}>Profile Settings</h2>
			<form className={styles['profile-form']} onSubmit={handleSubmit}>
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
									checked={profileSettingsFormData.privacy === 'public'}
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
									checked={profileSettingsFormData.privacy === 'anonymous'}
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
									checked={profileSettingsFormData.privacy === 'private'}
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
								value={profileSettingsFormData.first}
								currentlyEditing={currentlyEditing}
								setCurrentlyEditing={setCurrentlyEditing}
								handleChange={handleChange}
							/>

							<FormInput
								type='text'
								name='last'
								value={profileSettingsFormData.last}
								currentlyEditing={currentlyEditing}
								setCurrentlyEditing={setCurrentlyEditing}
								handleChange={handleChange}
							/>
						</div>
						<FormInput
							type='text'
							name='handle'
							value={profileSettingsFormData.handle}
							currentlyEditing={currentlyEditing}
							setCurrentlyEditing={setCurrentlyEditing}
							handleChange={handleChange}
						/>

						<FormInput
							type='text'
							name='yoyo'
							value={profileSettingsFormData.yoyo}
							currentlyEditing={currentlyEditing}
							setCurrentlyEditing={setCurrentlyEditing}
							handleChange={handleChange}
						/>

						<FormInput
							type='text'
							name='brand'
							value={profileSettingsFormData.brand}
							currentlyEditing={currentlyEditing}
							setCurrentlyEditing={setCurrentlyEditing}
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
								Short description:
							</label>
							{currentlyEditing === 'description' ? (
								<div className={styles['textarea-box']}>
									<textarea
										className={styles.textarea}
										name='description'
										id='description'
										maxLength={300}
										rows='3'
										placeholder='I like long walks on the beach, throwing yoyos in the rain, and walking the dog with expensive yoyos.'
										value={profileSettingsFormData.description}
										onChange={handleChange}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												!profileSettingsFormData.description.length &&
													setCurrentlyEditing(null);
											}
										}}
									></textarea>
									<Check
										sx={{ fontSize: '1.75rem', cursor: 'pointer' }}
										onClick={() => setCurrentlyEditing(null)}
									/>
									<div className={styles['max-length']}>
										{300 - (profileSettingsFormData.description?.length || 0)}
									</div>
								</div>
							) : (
								<>
									<p className={styles.p}>
										<span style={{ whiteSpace: 'pre-wrap' }}>
											{profileSettingsFormData.description}
										</span>
										<Edit
											sx={{
												position: 'relative',
												top: profileSettingsFormData.description.length
													? '.125rem'
													: '',
												fontSize: profileSettingsFormData.description.length
													? '1rem'
													: '1.5rem',
												cursor: 'pointer',
											}}
											onClick={() => setCurrentlyEditing('description')}
										/>
									</p>
								</>
							)}
						</div>
					</div>
				</div>
				{dirty && (
					<button className={styles.button} type='submit'>
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
