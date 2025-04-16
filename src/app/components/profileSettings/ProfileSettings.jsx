'use client';

// Libraries
import React, { useState } from 'react';

// Styles
import styles from './profileSettings.module.scss';

// MUI
import { Menu, West } from '@mui/icons-material';

// Components
import VerticalDivider from '../dividers/VerticalDivider';
import MenuItem from './menuItem/MenuItem';

function ProfileSettings({ setViewSettings }) {
	const [selected, setSelected] = useState({
		profile: true,
		account: false,
		collection: false,
		password: false,
	});

	const options = ['Profile', 'Account', 'Collection', 'Password'];

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
						{options.map((element, index) => {
							return (
								<MenuItem
									key={index}
									name={element}
									isSelected={selected[element.toLowerCase()]}
									handleChange={handleChange}
								/>
							);
						})}
					</ul>
				</nav>
			</div>
			<VerticalDivider />
			<div className={styles.right}>Page</div>
		</div>
	);
}

export default ProfileSettings;
