import React from 'react';

import styles from './collections.module.scss';

function Collections() {
	return (
		<div className={styles.collections}>
			<section className={styles.middle}>
				<div className={styles.tilebox}>
					<div className={styles.tile}></div>
					<div className={styles.tile}></div>
					<div className={styles.tile}></div>
					<div className={styles.tile}></div>
					<div className={styles.tile}></div>
					<div className={styles.tile}></div>
					<div className={styles.tile}></div>
					<div className={styles.tile}></div>
					<div className={styles.tile}></div>
				</div>
				<div className={styles.more}>
					<h2 className={styles.h2}>More</h2>
					<p className={styles.p}>Arrow</p>
				</div>
			</section>
		</div>
	);
}

export default Collections;
