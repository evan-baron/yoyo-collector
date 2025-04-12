'use client';

// Libraries
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Context
import { useAppContext } from '@/app/context/AppContext';

// Styles
import styles from './sidepanel.module.scss';

// Components
import VerticalDivider from '../dividers/VerticalDivider';

function SidePanel() {
	const { user, setModalOpen } = useAppContext();

	const router = useRouter();

	return (
		<section className={styles['side-panel']}>
			<nav className={styles.nav}>
				<ul className={styles.ul}>
					<Link
						className={styles.link}
						href='/'
						onClick={() => {
							router.push(window.location.pathname);
							setModalOpen(false);
						}}
					>
						Home
					</Link>
					{user && (
						<>
							<Link
								className={styles.link}
								href={`/${user.handle || user.id}/collections`}
							>
								My Collection
							</Link>
						</>
					)}
					<Link
						className={styles.link}
						href='/collections'
						onClick={() => setModalOpen(false)}
					>
						Collections
					</Link>
					<li className={styles.search}>
						<label htmlFor='search'>Search</label>
						<input name='search'></input>
					</li>
				</ul>
			</nav>
			<VerticalDivider />
		</section>
	);
}

export default SidePanel;
