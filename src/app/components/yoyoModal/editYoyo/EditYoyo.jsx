'use client';

// Libraries
import React from 'react';

// Styles
import styles from './editYoyo.module.scss';

// Components
import EditableYoyoTile from '../../pageSpecificComponents/myCollectionsPageComponents/yoyosComponents/editableYoyoTile/EditableYoyoTile';

// Context
import { useAppContext } from '@/app/context/AppContext';

function EditYoyo() {
	const { viewingYoyoData } = useAppContext();

	return (
		<div className={styles.container}>
			<EditableYoyoTile yoyoData={viewingYoyoData} />
		</div>
	);
}

export default EditYoyo;
