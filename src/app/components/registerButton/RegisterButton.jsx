'use client';

// Libraries
import React from 'react';

// Styles
import styles from './registerButton.module.scss';

// Context
import { useAppContext } from '@/app/context/AppContext';

function RegisterButton() {
	const { setModalOpen, setModalType } = useAppContext();

	return (
		<button
			className={styles.button}
			onClick={() => {
				setModalOpen(true);
				setModalType('register');
			}}
		>
			Register
		</button>
	);
}

export default RegisterButton;
