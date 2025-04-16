'use client';

// Libraries
import React, { useState, useEffect } from 'react';

// Styles
import styles from './settingsConsole.module.scss';

// MUI
import { Menu, West } from '@mui/icons-material';

// Components
import VerticalDivider from '../dividers/VerticalDivider';
import MenuItem from './menuItem/MenuItem';
import AccountSettings from './accountSettings/AccountSettings';
import CollectionSettings from './collectionSettings/CollectionSettings';
import PasswordSecuritySettings from './passwordSecuritySettings/PasswordSecuritySettings';
import ProfileSettings from './profileSettings/ProfileSettings';

function SettingsConsole({ setViewSettings }) {
	// State
	const [selected, setSelected] = useState({
		Profile: {
			selected: true,
			component: ProfileSettings,
		},
		Account: {
			selected: false,
			component: AccountSettings,
		},
		Collection: {
			selected: false,
			component: CollectionSettings,
		},
		Password: {
			selected: false,
			component: PasswordSecuritySettings,
		},
	});

	const handleChange = (e) => {
		const name = e.target.dataset.name;

		setSelected((prev) => {
			const newSelected = {};
			for (const key in prev) {
				newSelected[key] = {
					...prev[key],
					selected: key.toLowerCase() === name,
				};
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
						{Object.entries(selected).map(([key, value], index) => {
							return (
								<MenuItem
									key={index}
									name={key}
									isSelected={value.selected}
									handleChange={handleChange}
								/>
							);
						})}
					</ul>
				</nav>
			</div>
			<VerticalDivider />
			<div className={styles.right}>
				{Object.entries(selected).map(([key, value]) => {
					if (value?.selected) {
						const Component = value?.component;
						return Component ? <Component key={key} /> : null;
					} else {
						return null;
					}
				})}
			</div>
		</div>
	);
}

export default SettingsConsole;
