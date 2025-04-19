// Libraries
import React from 'react';

// Components
import Login from './login/Login';
import Register from './register/Register';
import ForgotPassword from './forgotPassword/ForgotPassword';
import ResetPassword from './resetPassword/ResetPassword';
import VerifyEmail from './verifyEmail/VerifyEmail';
import ThankYou from './thankYou/ThankYou';
import LocationPicker from './locationPicker/LocationPicker';
import Dirty from './dirty/Dirty';

// Context
import { useAppContext } from '@/app/context/AppContext';

// Styles
import styles from './modal.module.scss';

function Modal() {
	const { modalType, setModalOpen } = useAppContext();

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
			case 'verify-email':
				return <VerifyEmail />;
			case 'thank-you':
				return <ThankYou />;
			case 'location-picker':
				return <LocationPicker />;
			case 'dirty':
				return <Dirty />;
			default:
				return <div>Modal</div>;
		}
	};

	return (
		<div className={styles.modal}>
			<div
				className={styles.background}
				onClick={() => {
					if (modalType !== 'location-picker') {
						setModalOpen(false);
					}
				}}
			></div>
			{modalContent()}
		</div>
	);
}

export default Modal;
