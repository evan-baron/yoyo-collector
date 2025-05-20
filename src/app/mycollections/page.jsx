// Libraries
import React from 'react';
import { validateAndExtendSession } from '@/lib/auth/validateAndExtend';

// Styles
import styles from './myCollectionsPage.module.scss';

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
		</div>
	);
}

export default MyCollections;
