// Libraries
import React from 'react';

// Components
import EditYoyo from './editYoyo/EditYoyo';
import FullDetailYoyo from './fullDetailYoyo/FullDetailYoyo';

// Context
import { useAppContext } from '@/app/context/AppContext';

// Styles
import styles from './yoyoModal.module.scss';

function YoyoModal() {
	const { yoyoModalType } = useAppContext();

	const modalContent = () => {
		switch (yoyoModalType) {
			case 'edit-yoyo':
				return <EditYoyo />;
			case 'view-yoyo':
				return <FullDetailYoyo />;
			default:
				return <div>Modal</div>;
		}
	};

	return (
		<div className={styles.modal}>
			<div className={styles.background}></div>
			{modalContent()}
		</div>
	);
}

export default YoyoModal;
