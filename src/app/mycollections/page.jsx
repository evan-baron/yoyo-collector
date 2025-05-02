// Libraries
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import sessionService from '@/services/sessionService';
import userService from '@/services/userService';
import Link from 'next/link';

// Styles
import styles from './myCollectionsPage.module.scss';

// MUI
import { West } from '@mui/icons-material';

// Components
import CollectionsTiles from '../components/collectionsTiles/CollectionsTiles';

async function MyCollections() {
	const cookieStore = await cookies();
	const tokenFromCookie = cookieStore.get('session_token')?.value;

	const token = tokenFromCookie || tokenFromHeader;

	if (!token) {
		console.error('Token missing');
	}

	try {
		const response = await sessionService.getSessionByToken(token);

		const { expires_at } = response;

		const tokenValid = expires_at > Date.now();

		if (!tokenValid) {
			console.error('token invalid or expired @ mycollections/page.jsx');
			redirect('/');
		}
	} catch (err) {
		console.error('Token validation failed:', err);
	}

	return (
		<div className={styles['my-collections-container']}>
			<div className={styles['my-collections']}>
				<h1 className={styles.h1}>My Collections</h1>
				<CollectionsTiles collectionType={'user'} />
			</div>
			<Link href='/profile' className={styles['settings-box']}>
				<West className={styles['settings-icon']} sx={{ fontSize: 30 }} />
				<p className={styles.settings}>Profile</p>
			</Link>
		</div>
	);
}

export default MyCollections;
