'use client';

// Libraries
import React from 'react';

// Styles
import styles from './newCollectionTile.module.scss';

// Context
import { useAppContext } from '@/app/context/AppContext';

function NewCollectionTile() {
	const { setModalOpen, setModalType } = useAppContext();

	return (
		<div
			className={styles.tile}
			onClick={() => {
				setModalOpen(true);
				setModalType('new-collection');
			}}
		>
			<div className={styles.new}>
				<div className={styles.create}>New Collection</div>
			</div>
		</div>
	);
}

export default NewCollectionTile;
