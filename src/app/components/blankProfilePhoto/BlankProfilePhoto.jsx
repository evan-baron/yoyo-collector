import React from 'react';

// Styles
import styles from './blankProfilePhoto.module.scss';

function BlankProfilePhoto() {
	return (
		<div className={styles.placeholder}>
			<div className={styles.head}></div>
			<div className={styles.body}></div>
		</div>
	);
}

export default BlankProfilePhoto;
