// Libraries
import React from 'react';
import Image from 'next/image';

// Assets
import yoyoPhoto from '@/app/assets/site/blank-yoyo-photo-trimmed.png';

// Styles
import styles from './blankYoyoPhoto.module.scss';

function BlankYoyoPhoto({ noBorder }) {
	return (
		<Image
			src={yoyoPhoto}
			className={`${styles.image} ${noBorder && styles['no-border']}`}
			alt='default yoyo photo'
		/>
	);
}

export default BlankYoyoPhoto;
