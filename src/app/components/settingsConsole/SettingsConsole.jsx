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
import LoadingSpinner from '../loading/LoadingSpinner';

// Context
import { useAppContext } from '@/app/context/AppContext';

function SettingsConsole({ setViewSettings }) {
	const { loading, dirty, setModalOpen, setModalType } = useAppContext();

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
				{SelectedComponent && (
					<SelectedComponent setViewSettings={setViewSettings} />
				)}
			</div>
			<div
				className={styles.close}
				onClick={() => {
					!dirty && router.push('/collections');

					setModalOpen(true);
					setModalType('dirty');
				}}
			>
				<Close sx={{ fontSize: '2rem' }} />
			</div>
			{loading && <LoadingSpinner message='Saving' />}
		</div>
	);
}

export default SettingsConsole;
