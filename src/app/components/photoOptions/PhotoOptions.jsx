'use client';

// Libraries
import React, { useState } from 'react';

// Utils
import axiosInstance from '@/lib/utils/axios';

// Styles
import styles from './photoOptions.module.scss';

// MUI
import { ZoomIn, Share } from '@mui/icons-material';

// Context
import { useAppContext } from '@/app/context/AppContext';

function PhotoOptions({ optionsSize, photo }) {
	const {
		editingYoyos,
		setModalOpen,
		setModalType,
		setShareLink,
		setViewPhoto,
		setNewCollectionCounter,
	} = useAppContext();

	const { secure_url: photoUrl, id, public_id, yoyo_id } = photo;

	const [changeModal, setChangeModal] = useState(false);
	const [changeModalType, setChangeModalType] = useState(false);

	async function handleSave(e) {
		e.stopPropagation();
		if (changeModalType === 'yoyo') {
			try {
				await axiosInstance.patch('/api/user/yoyoPictures', {
					photoId: id,
					yoyoId: yoyo_id,
				});
			} catch (error) {
				console.error(
					'There was an error changing the main yoyo photo at components/photoOptions:',
					error.message
				);
			} finally {
				setNewCollectionCounter((prev) => prev + 1);
				setChangeModal(false);
			}
		} else if (changeModalType === 'delete') {
			try {
				await axiosInstance.delete('/api/user/yoyoPictures', {
					data: {
						photoId: id,
						publicId: public_id,
					},
				});
			} catch (error) {
				console.error(
					'There was an error deleting the photo at components/photoOptions:',
					error.message
				);
			} finally {
				setNewCollectionCounter((prev) => prev + 1);
				setChangeModal(false);
			}
		}
	}

	return (
		<>
			{changeModal ? (
				<div className={styles.change}>
					<h3 className={styles.h3}>
						{changeModalType === 'yoyo'
							? 'Set as main photo?'
							: 'Delete photo?'}
					</h3>
					<div className={styles.buttons}>
						<button className={styles.button} onClick={(e) => handleSave(e)}>
							Yes
						</button>
						<button
							className={styles.button}
							onClick={(e) => {
								e.stopPropagation();
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
						{!editingYoyos && (
							<>
								<div
									className={`${styles.option} ${
										!editingYoyos && styles['not-editing']
									}`}
								>
									<ZoomIn
										className={`${styles.icon} ${
											!editingYoyos && styles['not-editing']
										} ${optionsSize === 'small' && styles['small-icon']}`}
										onClick={(e) => {
											e.stopPropagation();
											setModalOpen(true);
											setModalType('view-photo');
											setViewPhoto(photoUrl);
										}}
									/>
								</div>
								<div
									className={`${styles.option} ${
										!editingYoyos && styles['not-editing']
									}`}
									onClick={(e) => {
										e.stopPropagation();
										setModalOpen(true);
										setModalType('share');
										setShareLink(photoUrl);
									}}
								>
									<Share
										className={`${styles.icon} ${
											!editingYoyos &&
											optionsSize !== 'small' &&
											styles['not-editing']
										} ${optionsSize === 'small' && styles['small-icon']}`}
									/>
								</div>
							</>
						)}
					</div>
					{editingYoyos && (
						<>
							<div
								className={styles.cover}
								onClick={(e) => {
									e.stopPropagation();
									setChangeModal((prev) => !prev);
									setChangeModalType('yoyo');
								}}
							>
								Set As Main Photo
							</div>
							<div
								className={styles.cover}
								onClick={(e) => {
									e.stopPropagation();
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
		</>
	);
}

export default PhotoOptions;
