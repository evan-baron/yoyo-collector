'use client';

// Libraries
import React from 'react';
import dayjs from 'dayjs';

// Styles
import styles from './collectionTile.module.scss';

// MUI
import { Search, Edit, Share, DeleteOutline } from '@mui/icons-material';

// Components
import BlankCoverPhoto from '../blankCoverPhoto/BlankCoverPhoto';
import Heart from '../icons/heart/Heart';

function CollectionTile({ collectionData }) {
	const {
		collection_name: name,
		likes,
		created_at,
		updated_at,
		secure_url: cover,
	} = collectionData;
	const created = dayjs(created_at).format('MMMM, D, YYYY');
	return (
		<div className={styles.tile}>
			<div className={styles['cover-photo']}>
				{cover ? (
					<img className={styles.image} src={cover} />
				) : (
					<BlankCoverPhoto />
				)}
				<div className={styles.options}>
					<div className={styles.menu}>
						<div className={styles.option}>
							<Search className={styles.icon} />
						</div>
						<div className={styles.option}>
							<Edit className={styles.icon} />
						</div>
						<div className={styles.option}>
							<Share className={styles.icon} />
						</div>
						<div className={styles.option}>
							<DeleteOutline className={styles.icon} />
						</div>
					</div>
				</div>
			</div>
			<div className={styles.details}>
				<div className={styles['name-likes']}>
					<div className={styles.name}>{name}</div>

					<div className={styles.likes}>
						<Heart /> {likes || '69'} likes
					</div>
				</div>
				<div className={styles.created}>Uploaded on {created}</div>
			</div>
		</div>
	);
}

export default CollectionTile;
