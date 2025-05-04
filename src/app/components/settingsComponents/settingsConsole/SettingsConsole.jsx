'use client';

// Libraries
import React, { useState, useMemo } from 'react';
import Link from 'next/link';

// Styles
import styles from './settingsConsole.module.scss';

// MUI
import { West } from '@mui/icons-material';

// Components
import MenuItem from '@/app/components/settingsComponents/menuItem/MenuItem';
import AccountSettings from '@/app/components/settingsComponents/accountSettings/AccountSettings';
import CollectionSettings from '@/app/components/settingsComponents/collectionSettings/CollectionSettings';
import PasswordSecuritySettings from '@/app/components/settingsComponents/passwordSecuritySettings/PasswordSecuritySettings';
import ProfileSettings from '@/app/components/settingsComponents/profileSettings/ProfileSettings';
import LoadingSpinner from '@/app/components/loading/LoadingSpinner';

// Context
import { useAppContext } from '@/app/context/AppContext';

function SettingsConsole() {
	const { loading, dirty, setModalOpen, setModalType, setViewSettings, user } =
		useAppContext();

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
		<>
			<div className={styles.settings}>
				<div className={styles.left}>
					<nav className={styles.nav}>
						<ul className={styles.ul}>
							<Link className={styles['view-profile']} href='/profile'>
								<West
									className={styles.west}
									sx={{ color: 'rgb(255, 0, 225)' }}
								/>
								<p className={styles.p}>Back to Profile</p>
							</Link>
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
				<div className={styles.right}>
					{SelectedComponent && (
						<SelectedComponent setViewSettings={setViewSettings} />
					)}
				</div>
			</div>
			{loading && <LoadingSpinner message='Saving' />}
		</>
	);
}

export default SettingsConsole;
