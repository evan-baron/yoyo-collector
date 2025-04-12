// Libraries
import React from 'react';

// Components
import Login from './login/Login';
import Register from './register/Register';
import ForgotPassword from './forgotPassword/ForgotPassword';
import ResetPassword from './resetPassword/ResetPassword';

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
			case 'register':
				return <Register />;
			case 'forgot-password':
				return <ForgotPassword />;
			case 'reset-password':
				return <ResetPassword />;
			default:
				return <div>Modal</div>;
		}
	};

	return <div className={styles.modal}>{modalContent()}</div>;
}

export default Modal;
