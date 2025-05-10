// Libraries
import React from 'react';

// Styles
import styles from './yoyoTile.module.scss';

function YoyoTile({ editing }) {
	return (
		<div className={styles.tile}>
			<div className={styles.legend}>
				<ul className={`${styles.ul} ${editing && styles.editing}`}>
					{editing && (
						<li className={styles.checkbox}>
							<input type='checkbox' className={styles.input} />
						</li>
					)}
					<li className={styles.name}>Draupnir</li>
					<li className={styles.manufacturer}>Yoyorecreation</li>
					<li className={styles.year}>2015</li>
				</ul>
			</div>
		</div>
	);
}

export default YoyoTile;
