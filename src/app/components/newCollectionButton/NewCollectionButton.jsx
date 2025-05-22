'use client';

// Libraries
import React, { useState, useEffect } from 'react';

// Utils
import axiosInstance from '@/lib/utils/axios';

// Styles
import styles from './newCollectionButton.module.scss';

// MUI
import { Add } from '@mui/icons-material';

// Context
import { useAppContext } from '@/app/context/AppContext';

function NewCollectionButton() {
	const { setModalOpen, setModalType, newCollectionCounter } = useAppContext();

	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		const fetchCollections = async () => {
			try {
				const collectionsData = await axiosInstance.get(
					'/api/user/collections/byUserId',
					{
						withCredentials: true,
					}
				);

				const allCollections = collectionsData.data;

				setDisabled(allCollections.length > 9);
			} catch (error) {
				console.error(
					'There was an error fetching the collectionsData',
					error.message
				);
			}
		};
		fetchCollections();
	}, [newCollectionCounter]);

	return (
		<button
			className={`${styles['new-collection-btn']} ${
				disabled && styles.disabled
			}`}
			onClick={() => {
				setModalOpen(true);
				setModalType('new-collection');
			}}
			disabled={disabled}
		>
			<Add className={styles['settings-icon']} style={{ fontSize: '1.5rem' }} />
			<p className={styles.settings}>New Collection</p>
		</button>
	);
}

export default NewCollectionButton;
