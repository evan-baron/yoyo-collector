'use client';

// Libraries
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

// Styles
import styles from './collectionTile.module.scss';

// MUI
import { Search, Edit, Share, DeleteOutline } from '@mui/icons-material';

// Components
import BlankCoverPhoto from '../blankCoverPhoto/BlankCoverPhoto';
import Heart from '../icons/heart/Heart';

// Context
import { useAppContext } from '@/app/context/AppContext';

function CollectionTile({ collectionData, currentUser, size, collectionType }) {
	const {
		id: collectionId,
		collection_name: name,
		likes,
		created_at,
		updated_at,
		secure_url: cover,
	} = collectionData;
	const created = dayjs(created_at).format('MMMM, D, YYYY');
	const link =
		collectionType === 'user'
			? `/mycollections/${collectionId}`
			: `/collections/${collectionId}`;

	const router = useRouter();

	const { setCollectionToDelete, setModalOpen, setModalType, setEditing } =
		useAppContext();

	const [hover, setHover] = useState(false);

	const iconSize = size === 'small' ? '3rem' : '5rem';
	const borderSize = size === 'small' ? '0.3rem' : '0.5rem';
	const menuWidth = size === 'small' ? '9rem' : '16rem';
	const menuGap = size === 'small' ? '.125rem' : '.5rem';

	const iconActions = [
		{
			icon: Search,
			onClick: () => {
				router.push(link);
			},
		},
		{
			icon: Edit,
			onClick: () => {
				setEditing(true);
				router.push(link);
			},
		},
		{
			icon: Share,
			onClick: () => {
				console.log('add share link later');
			},
		},
		{ icon: DeleteOutline, onClick: handleDelete },
	];

	function handleDelete() {
		setCollectionToDelete(collectionId);
		setModalOpen(true);
		setModalType('delete-collection');
	}

	return (
		<div
			className={`${styles.tile} ${hover && styles.hover}`}
			style={{ width: size === 'small' ? '15rem' : 'auto' }}
		>
			<div
				className={styles['cover-photo']}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
			>
				{cover ? (
					currentUser ? (
						<img className={styles.image} src={cover} />
					) : (
						<Link href={link}>
							<img className={styles.image} src={cover} />
						</Link>
					)
				) : (
					<Link href={link}>
						<div style={{ boxShadow: '0.25rem 0.25rem 1rem black' }}>
							<BlankCoverPhoto />
						</div>
					</Link>
				)}
				{currentUser && (
					<div className={styles.options}>
						<div
							className={styles.menu}
							style={{
								width: menuWidth,
								gap: menuGap,
							}}
						>
							{iconActions.map(({ icon: Icon, onClick }, index) => (
								<div
									key={index}
									className={styles.option}
									style={{ border: `${borderSize} solid var(--lightestGray)` }}
									onClick={onClick}
								>
									<Icon
										className={styles.icon}
										style={{ width: iconSize, height: iconSize }}
									/>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
			<div className={styles.details}>
				<div className={styles['name-likes']}>
					<Link
						href={link}
						className={styles.name}
						style={{ fontSize: size === 'small' ? '1.25rem' : '1.75rem' }}
					>
						{name}
					</Link>

					<div
						className={styles.likes}
						style={{ fontSize: size === 'small' ? '1.25rem' : '1.5rem' }}
					>
						<Heart size={size} /> {likes} {size === 'small' ? '' : 'likes'}
					</div>
				</div>
				{size !== 'small' && (
					<div className={styles.created}>Uploaded on {created}</div>
				)}
			</div>
		</div>
	);
}

export default CollectionTile;
