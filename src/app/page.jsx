// Utils
import collectionsService from '@/services/collectionsService';

// Styles
import styles from './home.module.scss';

// Next.js Components
import Image from 'next/image';
import Link from 'next/link';

// Components
import RegisterButton from './components/registerButton/RegisterButton';
import RegisterCTA from './components/registerCTA/RegisterCTA';
import CollectionCarousel from './components/collectionCarousel/CollectionCarousel';

export default async function Home() {
	let topCollections = [];
	let newCollections = [];

	const { topFiveCollections } =
		await collectionsService.getTopFiveCollections();
	topCollections = topFiveCollections;

	const { fiveNewestCollections } =
		await collectionsService.getFiveNewestCollections();
	newCollections = fiveNewestCollections;

	return (
		<div className={styles.home}>
			<section className={styles.hero}>
				<div className={styles.screen}>
					<h1 className={styles.h1}>Welcome to Yoyo Collector!</h1>
					<p className={styles.p}>
						A public space where you can create, manage, and share your
						collections with the world!
					</p>
				</div>
			</section>
			<section className={styles.description}>
				<h2 className={styles.h2}>
					With Yoyo Collector, you can easily create and manage collections to
					keep track of your yoyos — their condition, photos, and more. Choose
					to share your collections publicly, anonymously, or keep them entirely
					private.
				</h2>
				<RegisterCTA />
			</section>
			<section className={styles['preview-container']}>
				<div className={styles.preview}>
					<CollectionCarousel
						title='Top Collections'
						collections={topCollections}
					/>
					<CollectionCarousel
						title='Newest Collections'
						collections={newCollections}
					/>
				</div>
				<Link href='/collections' className={styles.link}>
					View All
				</Link>
			</section>
		</div>
	);
}
