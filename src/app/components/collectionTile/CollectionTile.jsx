'use client';

// Libraries
import React from 'react';

// Styles
import styles from './collectionTile.module.scss';

function CollectionTile({ collectionData }) {
	const {
		name: collection_name,
		likes,
		created_at,
		updated_at,
		secure_url,
	} = collectionData;
	return <div className={styles.tile}>{collectionData.collection_name}</div>;
}

export default CollectionTile;
