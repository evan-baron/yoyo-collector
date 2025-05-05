'use client';

// Libraries
import React, { useState } from 'react';

// Styles
import styles from './collectionPhoto.module.scss';

// MUI
import { Share, ZoomIn, DeleteOutline } from '@mui/icons-material';

// Components
import Heart from '../icons/heart/Heart';

// Context
import { useAppContext } from '@/app/context/AppContext';
import axiosInstance from '@/lib/utils/axios';

function CollectionPhoto({
	photoData,
	currentUser,
	collectionType,
	setCoverPhoto,
}) {
	const {
		id: photoId,
		collection_name: name,
		collection_id: collectionId,
		likes,
		secure_url: photoUrl,
	} = photoData;

	const { setModalOpen, setModalType, setEditing } = useAppContext();

	const [hover, setHover] = useState(false);
	const [changeCover, setChangeCover] = useState(false);

	function handleDelete() {
		setPhotoToDelete(photoId);
		setModalOpen(true);
		setModalType('delete-collection');
	}

	function handleChangeCover() {
		setChangeCover((prev) => !prev);
	}

	async function handleSaveCover() {
		try {
			await axiosInstance.patch('/api/user/collectionPictures', {
				collectionId,
				newCover: photoId,
			});
			setCoverPhoto(photoUrl);
		} catch (error) {
			console.error(
				'There was an error changing the cover phoot at components/collectionPhoto:',
				error.message
			);
			setChangeCover(false);
		} finally {
			setChangeCover(false);
		}
	}

	return (
		<div className={`${styles.tile} ${hover && styles.hover}`}>
			<div
				className={styles['cover-photo']}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
			>
				<img className={styles.image} src={photoUrl} />
				{changeCover ? (
					<div className={styles.change}>
						<h3 className={styles.h3}>Set as cover photo?</h3>
						<div className={styles.buttons}>
							<button className={styles.button} onClick={handleSaveCover}>
								Yes
							</button>
							<button className={styles.button} onClick={handleChangeCover}>
								No
							</button>
						</div>
					</div>
				) : (
					<div className={styles.options}>
						<div className={styles.menu}>
							<div
								className={styles.option}
								onClick={() => {
									console.log('zoom action');
								}}
							>
								<ZoomIn className={styles.icon} />
							</div>
							<div
								className={styles.option}
								onClick={() => {
									console.log(photoData);
								}}
							>
								<Share className={styles.icon} />
							</div>
							{currentUser && (
								<div
									className={styles.option}
									onClick={() => {
										console.log(photoData);
									}}
								>
									<DeleteOutline className={styles.icon} />
								</div>
							)}
						</div>
						{currentUser && (
							<div className={styles.cover} onClick={handleChangeCover}>
								Set Cover Photo
							</div>
						)}
					</div>
				)}
			</div>
			<div className={styles.details}>
				<div className={styles['name-likes']}>
					<div className={styles.likes}>
						<Heart size={'small'} likes={likes} /> {likes && `${likes} likes`}
					</div>
				</div>
			</div>
		</div>
	);
}

export default CollectionPhoto;
