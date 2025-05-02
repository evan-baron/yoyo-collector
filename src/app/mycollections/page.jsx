// Libraries
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import axiosInstance from '@/lib/utils/axios';
import Link from 'next/link';
import dayjs from 'dayjs';

// Styles
import styles from './myCollectionsPage.module.scss';

// MUI
import { West } from '@mui/icons-material';

// Components
import CollectionsTiles from '../components/collectionsTiles/CollectionsTiles';

async function MyCollections() {
	const cookieStore = await cookies();
	const token = cookieStore.get('session_token')?.value;
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

	if (!token) {
		redirect('/');
	}

	try {
		await axiosInstance.get(`${baseUrl}/api/token/authenticate/`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	} catch (error) {
		console.error('Error fetching user data:', error);
		redirect('/');
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
