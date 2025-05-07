'use client';

// Libraries
import React from 'react';

// Styles
import styles from './newCollectionTile.module.scss';

// Context
import { useAppContext } from '@/app/context/AppContext';

function NewCollectionTile({ size }) {
	const { setModalOpen, setModalType } = useAppContext();

	return (
		<div
			className={styles.tile}
			onClick={() => {
				setModalOpen(true);
				setModalType('new-collection');
			}}
		>
			<div className={`${styles.new} ${size === 'small' && styles.small}`}>
				<div
					className={styles.create}
					style={{
						fontSize: size === 'small' ? '1.25rem' : '2rem',
						bottom: size === 'small' ? '-1.75rem' : '-2.5rem',
					}}
				>
					New Collection
				</div>
			</div>
		</div>
	);
}

export default NewCollectionTile;
