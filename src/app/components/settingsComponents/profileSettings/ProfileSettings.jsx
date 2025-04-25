'use client';

// Libraries
import React, { useState, useEffect } from 'react';

// Utils
import axiosInstance from '@/utils/axios';

// Styles
import styles from './profileSettings.module.scss';

// MUI
import { Check, East, Edit, Undo } from '@mui/icons-material';

// Components
import FormInput from '../../formInput/FormInput';
import PictureUploader from '../../pictureUploader/PictureUploader';

// Context
import { useAppContext } from '@/app/context/AppContext';

function ProfileSettings() {
	// Definitions
	const {
		currentlyEditing,
		dirty,
		user,
		profileSettingsFormData,
		setCurrentlyEditing,
		setDirty,
		setProfileSettingsFormData,
		setLoading,
		setUser,
	} = useAppContext();

	// States
	const [errMessage, setErrMessage] = useState(null);

	// Effects
	useEffect(() => {}, [errMessage]);
	useEffect(() => {
		if (!user) return;

		setDirty(
			profileSettingsFormData.first !== first_name ||
				profileSettingsFormData.last !== last_name ||
				profileSettingsFormData.handle !== handle ||
				profileSettingsFormData.yoyo !== favorite_yoyo ||
				profileSettingsFormData.brand !== favorite_brand ||
				profileSettingsFormData.city !== city ||
				profileSettingsFormData.state !== state ||
				profileSettingsFormData.country !== country ||
				profileSettingsFormData.description !== description ||
				profileSettingsFormData.privacy !== privacy
		);
	}, [profileSettingsFormData, user]);

	// User Checked
	if (!user || !profileSettingsFormData) return null;

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

	const inputsArr = ['first', 'last', 'handle', 'yoyo', 'brand'];

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

	const originalLocation = () => {
		return [city, state, country].filter(Boolean).join(', ') || '';
	};

	// Functions
	const handleChange = (e) => {
		// console.log(e);
		const key = e.currentTarget.dataset.value;
		if (key && e.currentTarget.dataset.name === 'undo') {
			console.log(key);
			console.log(errMessage);
			setErrMessage((prev) => prev?.filter(([attribute]) => attribute !== key));
			setCurrentlyEditing(null);
			if (key === 'first') {
				setProfileSettingsFormData((prev) => ({
					...prev,
					[key]: user.first_name,
				}));
			} else if (key === 'last') {
				setProfileSettingsFormData((prev) => ({
					...prev,
					[key]: user.last_name,
				}));
			} else if (key === 'yoyo') {
				setProfileSettingsFormData((prev) => ({
					...prev,
					[key]: user.favorite_yoyo,
				}));
			} else if (key === 'brand') {
				setProfileSettingsFormData((prev) => ({
					...prev,
					[key]: user.favorite_brand,
				}));
			} else if (key === 'location') {
				setProfileSettingsFormData((prev) => ({
					...prev,
					city: user.city,
					state: user.state,
					country: user.country,
				}));
			} else {
				setProfileSettingsFormData((prev) => ({
					...prev,
					[key]: user[key],
				}));
			}
			return;
		}
		const { name, value } = e.target;
		// console.log('Setting:', name, 'with value:', value);
		setProfileSettingsFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Validation

	// Rule Checks Setup
	const names = ['first', 'last'];

	const handleYoyoBrandKeys = ['handle', 'yoyo', 'brand'];

	const locationKeys = ['country', 'state', 'city'];

	const privacyValues = ['public', 'anonymous', 'private'];

	const nullAllowed = [
		'handle',
		'yoyo',
		'brand',
		'city',
		'state',
		'country',
		'description',
	];

	// Regex Rule Checks
	const onlyLetters = (param) => /^\p{L}+$/u.test(param);
	const namesTest = (param) => /^[a-zA-Z \-']+$/.test(param);
	const lettersNumbers = (param) => /^[a-zA-Z0-9 \-']+$/.test(param);

	const validation = (name, value) => {
		if (
			nullAllowed.includes(name) &&
			(value === null || value === undefined || value === '')
		) {
			return true;
		}

		if (name === 'id' && typeof value !== 'number') {
			return false;
		}

		if (names.includes(name)) {
			return namesTest(value);
		}

		if (handleYoyoBrandKeys.includes(name)) {
			return lettersNumbers(value);
		}

		if (locationKeys.includes(name)) {
			return onlyLetters(value);
		}

		if (name === 'privacy') {
			return privacyValues.includes(value);
		}

		return true;
	};

	// Warning Message
	const warningMessage = {
		first: 'No special characters or numbers allowed',
		last: 'No special characters or numbers allowed',
		handle: 'No special characters allowed',
		yoyo: 'No special characters allowed',
		brand: 'No special characters allowed',
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setCurrentlyEditing(false);
		const trimmedData = Object.fromEntries(
			Object.entries(profileSettingsFormData).map(([key, value]) => [
				key,
				value?.trim() === '' ? null : value?.trim(),
			])
		);

		const values = Object.entries(trimmedData);

		const failed = values.filter(([key, val]) => !validation(key, val));

		if (failed.length) {
			setErrMessage(
				failed.map(([name, value]) => [name, warningMessage[name]])
			);
			return;
		}

		const submitData = trimmedData;

		try {
			setLoading(true);

			const response = await axiosInstance.post(
				'/api/user/updateSettings',
				submitData
			);
			const user = Object.fromEntries(
				Object.entries(response.data.user).map(([key, value]) => [
					key,
					value === null ? '' : value,
				])
			);
			console.log('logging user from profileSettings.jsx line 243:', user);
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
			setDirty(false);
			setLoading(false);
		} catch (error) {
			console.log(
				'There was an error submitting profileSettings in components/settingsConsole/profileSettings.jsx: ',
				error.message
			);
			return;
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.profile}>
			<h2 className={styles.h2}>Profile Settings</h2>
			<form className={styles['profile-form']} onSubmit={handleSubmit}>
				<div className={styles.top}>
					<fieldset className={styles.item}>
						<h3 htmlFor='privacy' className={styles.h3}>
							Profile Visibility:
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
						{inputsArr.map((input, index) => {
							return (
								<FormInput
									key={index}
									type='text'
									name={input}
									value={profileSettingsFormData[input]}
									currentlyEditing={currentlyEditing}
									setCurrentlyEditing={setCurrentlyEditing}
									handleChange={handleChange}
									errMessage={errMessage}
									setErrMessage={setErrMessage}
								/>
							);
						})}

						<FormInput
							type='text'
							name='location'
							value={location()}
							handleChange={handleChange}
							originalLocation={originalLocation()}
						/>
					</div>
					<div
						className={`${styles['form-item']} ${styles['profile-picture']}`}
					>
						<PictureUploader
							uploadType='profile'
							defaultUrl={user.secure_url}
						/>
					</div>
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
										<span onClick={() => setCurrentlyEditing('description')}>
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
												marginLeft: '.25rem',
											}}
											onClick={() => setCurrentlyEditing('description')}
										/>
										{profileSettingsFormData.description !== description && (
											<Undo
												className={styles.undo}
												sx={{
													position: 'relative',
													top: profileSettingsFormData.description.length
														? '.25rem'
														: '.25rem',
													fontSize: profileSettingsFormData.description.length
														? '1.25rem'
														: '1.75rem',
													cursor: 'pointer',
													height: profileSettingsFormData.description.length
														? '1rem'
														: '1.25rem',
													marginLeft: '.25rem',
												}}
												viewBox='2 4 18 18'
												onClick={() =>
													setProfileSettingsFormData({
														...profileSettingsFormData,
														description: description,
													})
												}
											/>
										)}
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
		</div>
	);
}

export default ProfileSettings;
