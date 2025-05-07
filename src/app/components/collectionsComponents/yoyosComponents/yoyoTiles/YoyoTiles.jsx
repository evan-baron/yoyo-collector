// Libraries
import React from 'react';

// Styles
import styles from './yoyoTiles.module.scss';

// MUI
import { North } from '@mui/icons-material';

// Components
import YoyoTile from '../yoyoTile/YoyoTile';

function YoyoTiles({ editing }) {
	return (
		<div className={styles.container}>
			<div className={styles.legend}>
				<ul className={styles.ul}>
					<li className={styles.sort}>
						Name
						<North className={styles.icon} />
					</li>
					<li className={styles.sort}>
						Manufacturer
						<North className={styles.icon} />
					</li>
					<li className={styles.sort}>
						Year
						<North className={styles.icon} />
					</li>
				</ul>
			</div>
			<YoyoTile editing={editing} />
			<YoyoTile editing={editing} />
			<YoyoTile editing={editing} />
		</div>
	);
}

export default YoyoTiles;
