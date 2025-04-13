import React from 'react';
import Link from 'next/link';

import styles from './footer.module.scss';

import HorizontalDivider from '../dividers/HorizontalDivider';

function Footer() {
	return (
		<footer className={styles.footer}>
			<p>
				© {new Date().getFullYear()} Yoyo Collector •{' '}
				<Link href='/privacy' className={styles.link}>
					Privacy
				</Link>{' '}
				•{' '}
				<Link href='/about' className={styles.link}>
					About
				</Link>{' '}
				•{' '}
				<Link href='/contact' className={styles.link}>
					Contact
				</Link>{' '}
				•{' '}
				<Link href='/bug-report' className={styles.link}>
					Report a Bug
				</Link>
			</p>
		</footer>
	);
}

export default Footer;
