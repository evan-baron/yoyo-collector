'use client';

// Libraries
import React, { useState } from 'react';
import dayjs from 'dayjs';

// Utils
import axiosInstance from '@/utils/axios';

// Styles
import styles from './collectionTile.module.scss';

// MUI
import { Search, Edit, Share, DeleteOutline } from '@mui/icons-material';

// Components
import BlankCoverPhoto from '../blankCoverPhoto/BlankCoverPhoto';
import Heart from '../icons/heart/Heart';

// Context
import { useAppContext } from '@/app/context/AppContext';

function CollectionTile({ collectionData }) {
	const {
		id: collectionId,
		collection_name: name,
		likes,
		created_at,
		updated_at,
		secure_url: cover,
	} = collectionData;
	const created = dayjs(created_at).format('MMMM, D, YYYY');

	const { setCollectionToDelete, setModalOpen, setModalType } = useAppContext();

	const [hover, setHover] = useState(false);

	function handleDelete() {
		setCollectionToDelete(collectionId);
		setModalOpen(true);
		setModalType('delete-collection');
	}

	return (
		<div className={`${styles.tile} ${hover && styles.hover}`}>
			<div
				className={styles['cover-photo']}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
			>
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
						<div className={styles.option} onClick={handleDelete}>
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
