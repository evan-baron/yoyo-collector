// Libraries
import React from 'react';

// Components
import Login from './login/Login';

// Context
import { useAppContext } from '@/app/context/AppContext';

// Styles
import styles from './modal.module.scss';

function Modal() {
	const { modalOpen, setModalOpen, modalType, setModalType, user, setUser } =
		useAppContext();

	const modalContent = () => {
		switch (modalType) {
			case 'login':
				return <Login />;
			default:
				return <div>Modal</div>;
		}
	};

	return <div className={styles.modal}>{modalContent()}</div>;
}

export default Modal;
