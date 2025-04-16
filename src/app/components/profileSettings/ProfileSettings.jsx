'use client';

// Libraries
import React, { useState } from 'react';

// Styles
import styles from './profileSettings.module.scss';

// MUI
import { West } from '@mui/icons-material';

function ProfileSettings({ setViewSettings }) {
	const [selected, setSelected] = useState({
		profile: true,
		account: false,
		collection: false,
		password: false,
	});

	const handleChange = (e) => {
		const name = e.target.dataset.name;

		setSelected((prev) => {
			const newSelected = {};
			for (const key in prev) {
				newSelected[key] = key === name;
			}
			return newSelected;
		});
	};

	return (
		<div className={styles.settings}>
			<div className={styles.left}>
				<div
					className={styles.back}
					onClick={() => setViewSettings((prev) => !prev)}
				>
					<West className={styles.west} /> Back to Profile
				</div>
				<nav className={styles.nav}>
					<ul className={styles.ul}>
						<li
							data-name='profile'
							className={`${styles.li} ${
								selected.profile ? styles.highlighted : ''
							}`}
							onClick={handleChange}
						>
							Profile Settings
						</li>
						<li
							data-name='account'
							className={`${styles.li} ${
								selected.account ? styles.highlighted : ''
							}`}
							onClick={handleChange}
						>
							Account Settings
						</li>
						<li
							data-name='collection'
							className={`${styles.li} ${
								selected.collection ? styles.highlighted : ''
							}`}
							onClick={handleChange}
						>
							Collection Settings
						</li>
						<li
							data-name='password'
							className={`${styles.li} ${
								selected.password ? styles.highlighted : ''
							}`}
							onClick={handleChange}
						>
							Password & Security
						</li>
					</ul>
				</nav>
			</div>
			<div className={styles.right}>Page</div>
		</div>
	);
}

export default ProfileSettings;
