'use client';

// Libraries
import React from 'react';

// Styles
import styles from './newCollectionButton.module.scss';

// MUI
import { Add } from '@mui/icons-material';

// Context
import { useAppContext } from '@/app/context/AppContext';

function NewCollectionButton() {
	const { setModalOpen, setModalType } = useAppContext();

	return (
		<button
			className={styles['new-collection-btn']}
			onClick={() => {
				setModalOpen(true);
				setModalType('new-collection');
			}}
		>
			<Add className={styles['settings-icon']} style={{ fontSize: '1.5rem' }} />
			<p className={styles.settings}>New Collection</p>
		</button>
	);
}

export default NewCollectionButton;
