// Styles
import styles from './page.module.scss';

// Next.js Components
import Image from 'next/image';

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
		</>
	);
}
