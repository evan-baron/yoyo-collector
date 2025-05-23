// Styles
import styles from './home.module.scss';

// Next.js Components
import Image from 'next/image';
import Link from 'next/link';

// Components
import RegisterButton from './components/registerButton/RegisterButton';
import RegisterCTA from './components/registerCTA/RegisterCTA';
import CollectionCarousel from './components/collectionCarousel/CollectionCarousel';

export default function Home() {
	return (
		<div className={styles.home}>
			<section className={styles.hero}>
				<div className={styles.screen}>
					<h1 className={styles.h1}>Welcome to Yoyo Collector!</h1>
					<p className={styles.p}>
						A public database where you can create, manage, and share your
						collections with the world!{' '}
					</p>
				</div>
			</section>
			<section className={styles.description}>
				<h2 className={styles.h2}>
					With Yoyo Collector, you can create collections, keeping track of each
					individual yoyo, it's specs, pictures, and more. You can then share
					your collections publicly, anonymously, or keep them completely
					private.
				</h2>
				<RegisterCTA />
			</section>
			<section className={styles['preview-container']}>
				<div className={styles.preview}>
					<CollectionCarousel title='Top Collections' />
					<CollectionCarousel title='Newest Collections' />
				</div>
				<Link href='/mycollections' className={styles.link}>
					View All
				</Link>
			</section>
		</div>
	);
}
