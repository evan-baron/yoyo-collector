// Libraries
import React from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';

// Styles
import styles from './collectionTemplate.module.scss';

// MUI
import { Edit, FavoriteOutlined } from '@mui/icons-material';

// Components
import BlankCoverPhoto from '../blankCoverPhoto/BlankCoverPhoto';

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
	const created = dayjs(created_at).format('MMMM, D, YYYY');

	return (
		<div className={styles['collection-container']}>
			<div className={styles.title}>
				<h1 className={styles.h1}>{collection_name}</h1>
				<div className={styles.details}>
					<h3 className={styles.h3}>Created {created}</h3>
					<p className={styles.likes}>
						<svg viewBox='0 0 24 24' className={styles.heart}>
							<defs>
								<linearGradient
									id='quoteGradient'
									x1='0%'
									y1='0%'
									x2='100%'
									y2='100%'
								>
									<stop offset='0%' stopColor='#ff00ff' />
									<stop offset='90%' stopColor='#00e1ff' />
								</linearGradient>
							</defs>
							<path
								d='m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z'
								fill='url(#quoteGradient)'
							/>
						</svg>
						{likes ? likes : '69'} likes
					</p>
				</div>
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
							{/* Collection photo or default photo */}
							<BlankCoverPhoto />
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
