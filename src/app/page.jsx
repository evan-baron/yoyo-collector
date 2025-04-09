'use client';

// Context
import { useAppContext } from './context/AppContext';

// Components
import Modal from './components/modal/Modal';
import Register from './components/register/Register';

// Styles
import styles from './page.module.css';

// Next.js Components
import Image from 'next/image';

export default function Home() {
	const { component, isModalOpen } = useAppContext();

	return (
		<main className={styles.main}>
			{component === 'home' && <div>Hello World</div>}
			{component === 'register' && <Register />}
			{isModalOpen && <Modal />}
		</main>
	);
}
