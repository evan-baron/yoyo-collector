// Libraries
import React from 'react';

// Styles
import styles from './blankCoverPhoto.module.scss';

function BlankCoverPhoto() {
	return (
		<div className={styles.container}>
			<div className={styles.frame}>
				<div className={styles.landscape}>
					<div className={styles.circle}></div>
					<div className={styles.square1}></div>
					<div className={styles.square2}></div>
				</div>
			</div>
		</div>
	);
}

export default BlankCoverPhoto;
