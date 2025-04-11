'use client';

// Libraries
import React from 'react';
import Link from 'next/link';

// Context
import { useAppContext } from '@/app/context/AppContext';

// Styles
import styles from './sidepanel.module.scss';

// Components
import VerticalDivider from '../dividers/VerticalDivider';

function SidePanel() {
	const { user } = useAppContext();

	return (
		<section className={styles['side-panel']}>
			<nav className={styles.nav}>
				<ul className={styles.ul}>
					<Link href='/'>Home</Link>
					{user && (
						<>
							<Link href={`/${user.handle || user.id}/collections`}>
								My Collection
							</Link>
							<Link href={`/${user.handle || user.id}/new`}>
								New Collection
							</Link>
						</>
					)}
					<Link href='/collections'>View Collections</Link>
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
