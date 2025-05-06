'use client';

// Libraries
import React from 'react';

// Styles
import styles from './viewPhoto.module.scss';

// MUI
import { Close } from '@mui/icons-material';

// Context
import { useAppContext } from '@/app/context/AppContext';

function ViewPhoto() {
	const { setModalOpen, viewPhoto, setViewPhoto } = useAppContext();

	return (
		<div className={styles.container}>
			<img src={viewPhoto} className={styles.image} />
			<div
				className={styles.close}
				onClick={() => {
					setViewPhoto(null);
					setModalOpen(false);
				}}
			>
				<Close sx={{ fontSize: 30 }} />
				Close
			</div>
		</div>
	);
}

export default ViewPhoto;
