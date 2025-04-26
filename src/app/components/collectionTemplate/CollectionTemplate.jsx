// Libraries
import React from 'react';
import Link from 'next/link';

// Styles
import styles from './collectionTemplate.module.scss';

// MUI
import { Edit } from '@mui/icons-material';

// Components
import PictureUploader from '../pictureUploader/PictureUploader';

function CollectionTemplate({ collection }) {
	const {
		id,
		collection_name,
		collection_description,
		likes,
		created_at,
		handle,
		first_name,
		privacy,
	} = collection;

	const settingsLink = `/mycollections/${id}/settings`;

	return (
		<div className={styles['collection-container']}>
			<div className={styles.title}>
				<h1 className={styles.h1}>{collection_name}</h1>
				<p className={styles.description}>
					{collection_description
						? collection_description
						: 'This is a sample description. This collection only contains solid gold and platinum yoyos. All of which are worth millions.'}
				</p>
			</div>
			<div className={styles.collection}>
				<section className={styles['photos-container']}>
					<div className={styles.left}>
						<h2 className={styles.h2}>Cover Photo</h2>
						<div className={styles.cover}>
							<PictureUploader uploadType='cover' />
						</div>
					</div>
					<div className={styles.right}>
						<h2 className={styles.h2}>Collection Photos</h2>
						<div className={styles.photos}>
							(If more than 4 photos, carousel)
							<div className={styles.grid}>
								<div className={styles.photo}></div>
								<div className={styles.photo}></div>
								<div className={styles.photo}></div>
								<div className={styles.photo}></div>
							</div>
						</div>
					</div>
				</section>
				<section className={styles['yoyos-container']}>
					<h2 className={styles.h2}>Yoyos</h2>
					<div className={styles.sort}>
						<div className={styles.style}>Photos Only</div>
						<div className={styles.style}>Details Only</div>
						<div className={styles.style}>Photos and Details</div>
					</div>
					<div className={styles.yoyos}>
						<div className={styles.tile}>
							(This will be its own component called YoyoTile)
						</div>
						<div className={styles.tile}>
							(This will be its own component called YoyoTile)
						</div>
						<div className={styles.tile}>
							(This will be its own component called YoyoTile)
						</div>
						<div className={styles.tile}>
							(This will be its own component called YoyoTile)
						</div>
					</div>
				</section>
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
