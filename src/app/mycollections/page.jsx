// Libraries
import React from 'react';

// Utils
import { validateAndExtendSession } from '@/lib/auth/validateAndExtend';
import userService from '@/services/userService';

// Styles
import styles from './myCollectionsPage.module.scss';

// Components
import CollectionsTiles from '../components/pageSpecificComponents/myCollectionsPageComponents/collectionComponents/collectionsTiles/CollectionsTiles';

async function MyCollections() {
	const { user_id } = await validateAndExtendSession('mycollections/page.jsx');

	const user = await userService.getUserById(user_id);

	const { privacy } = user;

	return (
		<div className={styles['my-collections-container']}>
			<div className={styles['my-collections']}>
				<h1 className={styles.h1}>My Collections</h1>
				<CollectionsTiles collectionType={'user'} privacy={privacy} />
			</div>
		</div>
	);
}

export default MyCollections;
