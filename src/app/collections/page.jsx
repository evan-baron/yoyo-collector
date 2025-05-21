// Libraries
import React from 'react';
import { cookies } from 'next/headers';
import userService from '@/services/userService';
import collectionsService from '@/services/collectionsService';
import sessionService from '@/services/sessionService';
import dayjs from 'dayjs';

// Styles
import styles from './collections.module.scss';

// Components
import CollectionCarousel from '../components/collectionCarousel/CollectionCarousel';
import TopOrNew from '../components/pageSpecificComponents/allCollectionsPageComponents/topOrNew/TopOrNew';
import AllCollectionsPages from '../components/pageSpecificComponents/allCollectionsPageComponents/allCollectionsPages/AllCollectionsPages';

async function Collections() {
	let user;
	let favorites = [];
	let topCollections = [];
	let newCollections = [];

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

	const { topTenCollections } = await collectionsService.getTopTenCollections();
	topCollections = topTenCollections;

	const { tenNewestCollections } =
		await collectionsService.getTenNewestCollections();
	newCollections = tenNewestCollections;

	return (
		<div className={styles['collections-container']}>
			<div className={styles.collections}>
				{user && (
					<>
						<h2 className={styles.h2}>My Favorites</h2>
						<CollectionCarousel collections={favorites} />
					</>
				)}
				<TopOrNew top={topCollections} newest={newCollections} />
				<AllCollectionsPages />
			</div>
		</div>
	);
}

export default Collections;
