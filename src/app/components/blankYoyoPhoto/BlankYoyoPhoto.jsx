// Libraries
import React from 'react';
import Image from 'next/image';

// Assets
import yoyoPhoto from '@/app/assets/site/blank-yoyo-photo-trimmed.png';

// Styles
import styles from './blankYoyoPhoto.module.scss';

function BlankYoyoPhoto() {
	return (
		<div className={styles['image-box']}>
			<Image
				src={yoyoPhoto}
				className={styles.image}
				alt='default yoyo photo'
			/>
		</div>
	);
}

export default BlankYoyoPhoto;
