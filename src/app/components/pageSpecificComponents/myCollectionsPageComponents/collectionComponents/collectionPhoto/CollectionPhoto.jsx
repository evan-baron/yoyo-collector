'use client';

// Libraries
import React, { useState } from 'react';

// Styles
import styles from './collectionPhoto.module.scss';

// MUI
import { Share, ZoomIn } from '@mui/icons-material';

// Components
import Heart from '@/app/components/icons/heart/Heart';

// Context
import { useAppContext } from '@/app/context/AppContext';
import axiosInstance from '@/lib/utils/axios';

function CollectionPhoto({
	photoData,
	currentUser,
	setCoverPhoto,
	editing,
	collectionType,
}) {
	const {
		id: photoId,
		collection_name: name,
		collection_id: collectionId,
		likes,
		secure_url: photoUrl,
	} = photoData;

	const {
		setModalOpen,
		setModalType,
		setShareLink,
		setViewPhoto,
		setNewCollectionCounter,
	} = useAppContext();

	const [hover, setHover] = useState(false);
	const [changeModal, setChangeModal] = useState(false);
	const [changeModalType, setChangeModalType] = useState(false);
	const [currentLikes, setCurrentLikes] = useState(likes);

	async function handleSave() {
		if (changeModalType === 'cover') {
			try {
				await axiosInstance.patch('/api/user/collectionPictures', {
					collectionId,
					newCover: photoId,
				});
				setCoverPhoto(photoUrl);
			} catch (error) {
				console.error(
					'There was an error changing the cover photo at components/collectionPhoto:',
					error.message
				);
			} finally {
				setChangeModal(false);
			}
		} else if (changeModalType === 'delete') {
			try {
				await axiosInstance.delete('/api/user/collectionPictures', {
					data: {
						collection: collectionId,
						photoId,
					},
				});
			} catch (error) {
				console.error(
					'There was an error deleting the photo at components/collectionPhoto:',
					error.message
				);
			} finally {
				setNewCollectionCounter((prev) => prev + 1);
				setChangeModal(false);
			}
		}
	}

	return (
		<div className={`${styles.tile} ${hover && styles.hover}`}>
			<div
				className={styles['cover-photo']}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => {
					setHover(false);
					changeModal && setChangeModal(false);
					changeModal && setChangeModalType('null');
				}}
			>
				<img className={styles.image} src={photoUrl} />
				{changeModal ? (
					<div className={styles.change}>
						<h3 className={styles.h3}>
							{changeModalType === 'cover'
								? 'Set as cover photo?'
								: 'Delete photo?'}
						</h3>
						<div className={styles.buttons}>
							<button className={styles.button} onClick={handleSave}>
								Yes
							</button>
							<button
								className={styles.button}
								onClick={() => {
									setChangeModal((prev) => !prev);
									setChangeModalType(null);
								}}
							>
								No
							</button>
						</div>
					</div>
				) : (
					<div className={styles.options}>
						<div className={styles.menu}>
							{currentUser && !editing && (
								<>
									<div
										className={`${styles.option} ${
											!editing && styles['not-editing']
										}`}
										onClick={() => {
											setModalOpen(true);
											setModalType('view-photo');
											setViewPhoto(photoUrl);
										}}
									>
										<ZoomIn
											className={`${styles.icon} ${
												!editing && styles['not-editing']
											}`}
										/>
									</div>
									<div
										className={`${styles.option} ${
											!editing && styles['not-editing']
										}`}
										onClick={() => {
											setModalOpen(true);
											setModalType('share');
											setShareLink(photoUrl);
										}}
									>
										<Share
											className={`${styles.icon} ${
												!editing && styles['not-editing']
											}`}
										/>
									</div>
								</>
							)}
						</div>
						{currentUser && editing && (
							<>
								<div
									className={styles.cover}
									onClick={() => {
										setChangeModal((prev) => !prev);
										setChangeModalType('cover');
									}}
								>
									Set Cover Photo
								</div>
								<div
									className={styles.cover}
									onClick={() => {
										setChangeModal((prev) => !prev);
										setChangeModalType('delete');
									}}
								>
									Delete Photo
								</div>
							</>
						)}
					</div>
				)}
			</div>
			<div className={styles.details}>
				<div className={styles['name-likes']}>
					<div className={styles.likes}>
						<Heart
							size={'small'}
							likes={currentLikes}
							likeType={'upload'}
							itemId={photoId}
							setLikes={setCurrentLikes}
						/>{' '}
						{currentLikes ? `${currentLikes} likes` : ''}
					</div>
				</div>
			</div>
		</div>
	);
}

export default CollectionPhoto;
