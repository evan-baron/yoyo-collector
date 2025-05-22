'use client';

// Libraries
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

// Styles
import styles from './collectionTile.module.scss';

// MUI
import { Edit, Share, ZoomIn, DeleteOutline } from '@mui/icons-material';

// Components
import BlankCoverPhoto from '@/app/components/blankCoverPhoto/BlankCoverPhoto';
import Heart from '@/app/components/icons/heart/Heart';

// Context
import { useAppContext } from '@/app/context/AppContext';

function CollectionTile({
	collectionData, // The object of collection data passed into the component
	size, // small or not small
	collectionType, // user or visitor
	privacy, // the privacy of the collection owner's profile ('public', 'anonymous', 'private')
}) {
	const [hover, setHover] = useState(false);

	const {
		id: collectionId,
		collection_name: name,
		likes,
		created_at,
		secure_url: cover,
	} = collectionData;
	const created = dayjs(created_at).format('MMMM, D, YYYY');
	const link =
		collectionType === 'user'
			? `/mycollections/${collectionId}`
			: `/collections/${collectionId}`;

	const [currentLikes, setCurrentLikes] = useState(likes);
	const router = useRouter();

	const {
		setCollectionToDelete,
		setEditing,
		setErrorMessage,
		setModalOpen,
		setModalType,
		setShareLink,
	} = useAppContext();

	const iconSize = size === 'small' ? '3rem' : '5rem';
	const borderSize = size === 'small' ? '0.3rem' : '0.5rem';
	const menuWidth = size === 'small' ? '9rem' : '16rem';
	const menuGap = size === 'small' ? '.125rem' : '.5rem';

	const iconActions = [
		{
			icon: ZoomIn, // USED TO BE SEARCH CHANGE BACK IF YOU DONT LIKE THE +
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
				setModalOpen(true);
				if (privacy === 'private') {
					setModalType('error');
					setErrorMessage(
						"Your account privacy is currently set to 'private'. Please change your privacy to 'anonymous' or 'public' if you would like to share your collections with others."
					);
					return;
				}
				setShareLink(
					`${process.env.NEXT_PUBLIC_BASE_URL}/collections/${collectionId}`
				);
				setModalType('share');
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
			className={`${styles.tile} ${hover && styles.hover} ${
				size === 'small' && styles.small
			}`}
			// style={{ width: size === 'small' ? '15rem' : 'auto' }}
		>
			<div
				className={styles['cover-photo']}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
			>
				{cover ? (
					collectionType === 'user' ? (
						<img className={styles.image} src={cover} />
					) : (
						<Link href={link} className={styles.link}>
							<img className={styles.image} src={cover} />
						</Link>
					)
				) : (
					<Link href={link} className={styles.link}>
						<div
							className={styles.image}
							style={{ boxShadow: '0.25rem 0.25rem 1rem black' }}
						>
							<BlankCoverPhoto />
						</div>
					</Link>
				)}
				{collectionType === 'user' && (
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
						{collectionType === 'visitor' && privacy === 'anonymous'
							? 'Anonymous'
							: name}
					</Link>

					<div
						className={styles.likes}
						style={{ fontSize: size === 'small' ? '1.25rem' : '1.5rem' }}
					>
						<Heart
							size={size}
							likes={currentLikes}
							itemId={collectionId}
							likeType={'collections'}
							setLikes={setCurrentLikes}
						/>{' '}
						{currentLikes || ''}{' '}
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
