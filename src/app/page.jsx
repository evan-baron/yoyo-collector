// Styles
import styles from './page.module.scss';

// Next.js Components
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
	return (
		<>
			<section className={styles.hero}>
				<div className={styles.screen}>
					<h1 className={styles.h1}>Welcome to Yoyo Collector!</h1>
					<p className={styles.p}>
						Yoyo Collector is a public database where you can create, manage,
						and share your collections with the world!{' '}
					</p>
				</div>
			</section>
			<section className={styles.preview}>
				<h2 className={styles.h2}>Top Collections</h2>
				<div className={styles.collection}></div>
				<h2 className={styles.h2}>Newest Collections</h2>
				<div className={styles.collection}></div>
			</section>
			<Link href='/collections' className={styles.link}>
				View All
			</Link>
		</>
	);
}
