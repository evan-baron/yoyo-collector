'use client';

// Libraries
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

// Styles
import styles from './settingsConsole.module.scss';

// MUI
import { Close } from '@mui/icons-material';

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
		// Collection: {
		// 	selected: false,
		// 	component: CollectionSettings,
		// },
		Password: {
			selected: false,
			component: PasswordSecuritySettings,
		},
	});

	const router = useRouter();

	const SelectedComponent = useMemo(() => {
		const selectedEntry = Object.values(selected).find(
			(entry) => entry.selected
		);
		return selectedEntry?.component || null;
	}, [selected]);

	const handleChange = (e) => {
		const name = e.target.dataset.name;

		setSelected((prev) =>
			Object.fromEntries(
				Object.entries(prev).map(([key, val]) => [
					key,
					{ ...val, selected: key.toLowerCase() === name },
				])
			)
		);
	};

	return (
		<div className={styles.settings}>
			<div className={styles.left}>
				<nav className={styles.nav}>
					<ul className={styles.ul}>
						{Object.entries(selected).map(([key, value], index) => {
							return (
								<MenuItem
									key={key}
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
				{SelectedComponent && (
					<SelectedComponent setViewSettings={setViewSettings} />
				)}
			</div>
			<div className={styles.close} onClick={() => router.push('/collections')}>
				<Close sx={{ fontSize: '2rem' }} />
			</div>
		</div>
	);
}

export default SettingsConsole;
