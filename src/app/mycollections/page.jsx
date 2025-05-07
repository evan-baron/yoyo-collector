// Libraries
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import sessionService from '@/services/sessionService';
import Link from 'next/link';
import dayjs from 'dayjs';
import { validateAndExtendSession } from '@/lib/auth/validateAndExtend';

// Styles
import styles from './myCollectionsPage.module.scss';

// MUI
import { West } from '@mui/icons-material';

// Components
import CollectionsTiles from '../components/collectionsComponents/myCollectionsComponents/collectionsTiles/CollectionsTiles';

async function MyCollections() {
	await validateAndExtendSession('mycollections/page.jsx');

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
