'use client';

// Libraries
import React from 'react';
import Link from 'next/link';

// Styles
import styles from './footer.module.scss';

// Context
import { useAppContext } from '@/app/context/AppContext';

function Footer() {
	const { dirty, setModalOpen, setModalType } = useAppContext();

	return (
		<footer className={styles.footer}>
			<p>
				© {new Date().getFullYear()} Yoyo Collector •{' '}
				<Link
					href={dirty ? '' : '/privacy'}
					onClick={() => {
						if (dirty) {
							setModalOpen(true);
							setModalType('dirty');
							return;
						}
					}}
					className={styles.link}
				>
					Privacy
				</Link>{' '}
				•{' '}
				<Link
					href={dirty ? '' : '/about'}
					onClick={() => {
						if (dirty) {
							setModalOpen(true);
							setModalType('dirty');
							return;
						}
					}}
					className={styles.link}
				>
					About
				</Link>{' '}
				•{' '}
				<Link
					href={dirty ? '' : '/contact'}
					onClick={() => {
						if (dirty) {
							setModalOpen(true);
							setModalType('dirty');
							return;
						}
					}}
					className={styles.link}
				>
					Contact
				</Link>{' '}
				•{' '}
				<Link
					href={dirty ? '' : '/bug-report'}
					onClick={() => {
						if (dirty) {
							setModalOpen(true);
							setModalType('dirty');
							return;
						}
					}}
					className={styles.link}
				>
					Report a Bug
				</Link>
			</p>
		</footer>
	);
}

export default Footer;
