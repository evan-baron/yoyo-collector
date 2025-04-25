// Libraries
import React from 'react';
import Link from 'next/link';

// Styles
import styles from './collectionTemplate.module.scss';

// MUI
import { Edit } from '@mui/icons-material';

// Components
import BlankCoverPhoto from '../blankCoverPhoto/BlankCoverPhoto';

function CollectionTemplate({ collection }) {
	const {
		id,
		collection_name,
		likes,
		created_at,
		handle,
		first_name,
		privacy,
	} = collection;

	const settingsLink = `/mycollections/${id}/settings`;

	return (
		<div className={styles['collection-container']}>
			<div className={styles.collection}>
				<div className={styles.cover}>
					<BlankCoverPhoto />
				</div>
			</div>
			<Link href={settingsLink} className={styles['settings-box']}>
				<Edit className={styles['settings-icon']} />
				<p className={styles.settings}>Edit Collection</p>
			</Link>
			{/* <Link href='/profile/settings' className={styles['settings-box']}>
		<Settings className={styles['settings-icon']} />
		<p className={styles.settings}>Profile Settings</p>
	</Link> */}
		</div>
	);
}

export default CollectionTemplate;
