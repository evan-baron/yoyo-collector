// Libraries
import React from 'react';
import { cookies } from 'next/headers';
import userService from '@/services/userService';
import sessionService from '@/services/sessionService';
import dayjs from 'dayjs';

// Styles
import styles from './collections.module.scss';

// Components
import CollectionCarousel from '../components/collectionCarousel/CollectionCarousel';

async function Collections() {
	let user;
	let favorites = [];

	const cookieStore = await cookies();
	const tokenFromCookie = cookieStore.get('session_token')?.value;

	const token = tokenFromCookie;

	if (token) {
		const response = await sessionService.getSessionByToken(token);

		const { user_id, expires_at, remember_me } = response;

		const tokenValid = dayjs(expires_at).isAfter(dayjs());

		if (!tokenValid) {
			console.log('From layout.jsx: token expired');
		}

		if (token && tokenValid) {
			await sessionService.extendSession(user_id, token, remember_me);
		}

		try {
			const userResponse = await userService.getUserById(user_id);

			if (userResponse.password) {
				delete userResponse.password;
			}

			user = userResponse;
		} catch (err) {
			// Handling this silently, but this means there's no active user or token in the browser
		}
	}

	return (
		<div className={styles['collections-container']}>
			<div className={styles.collections}>
				<h1 className={styles.h1}>All Collections</h1>
				{user && (
					<CollectionCarousel title={'My Favorites'} collections={favorites} />
				)}
			</div>
		</div>
	);
}

export default Collections;
