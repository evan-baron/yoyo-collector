'use client';

// Context
import { useAppContext } from './context/AppContext';

// Components
import Modal from './components/modal/modal';

// Styles
import styles from './page.module.css';

// Next.js Components
import Image from 'next/image';

export default function Home() {
	const { component, isModalOpen } = useAppContext();

	return (
		<main className={styles.main}>
			{component === 'home' && <div>Hello World</div>}
			{isModalOpen && <Modal />}
		</main>
	);
}
