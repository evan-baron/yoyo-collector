import React from 'react';
import Link from 'next/link';
import styles from './header.module.css';

function Header() {
	return (
		<header className={styles.header}>
			<nav className={styles.nav}>
				<Link href='/' className={styles.logo}>
					YoyoCollector
				</Link>
				<ul className={styles.links}>
					<li className={styles.link}>Login</li>
				</ul>
			</nav>
		</header>
	);
}

export default Header;
