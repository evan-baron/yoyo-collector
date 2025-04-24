// Utils
import axiosInstance from '@/utils/axios';
import { redirect } from 'next/navigation';

// Styles
import styles from '../../profile/profile.module.scss';

// MUI
import { East, Place, AlternateEmail, FormatQuote } from '@mui/icons-material';

// Components
import VerticalDivider from '@/app/components/dividers/VerticalDivider';
import CollectionCarousel from '@/app/components/collectionCarousel/CollectionCarousel';

async function ProfilePage({ params }) {
	const { handleOrId } = await params;

	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

	let profile;

	try {
		const user = await axiosInstance.get(
			`${baseUrl}/api/user/getUser?handleOrId=${handleOrId}`
		);
		const {
			first_name,
			last_name,
			handle,
			city,
			state,
			country,
			privacy,
			favorite_yoyo,
			favorite_brand,
			description,
			secure_url,
			created_at,
		} = user.data;

		const location = () => {
			return [city, state, country].filter(Boolean).join(', ') || '';
		};

		profile = {
			first: first_name,
			last: last_name,
			handle: handle,
			location: location(),
			privacy: privacy,
			yoyo: favorite_yoyo,
			brand: favorite_brand,
			description: description,
			profilePicture: secure_url,
			memberSince: created_at,
		};

		console.log(profile);
	} catch (error) {
		console.error('Error fetching profile data:', error);
		redirect('/');
	}

	if (profile.privacy === 'anonymous' || profile.privacy === 'private') {
		redirect('/');
	}

	return (
		<div className={styles['profile-container']}>
			<div className={styles.profile}>
				<section className={styles.left}>
					<div className={styles['profile-picture']}>
						<img src={profile.profilePicture} className={styles.picture} />
					</div>
					<div className={styles['name-info-box']}>
						<h1 className={styles.h1}>
							{profile.first} {profile.last}
						</h1>
						<div className={styles.details}>
							<h3 className={styles.handle}>
								<AlternateEmail className={styles.icon} />
								{profile.handle}
							</h3>
							<h3 className={styles.location}>
								<Place className={styles.icon} />
								{profile.location}
							</h3>
						</div>
					</div>
					<p className={styles.label}>About {profile.first}:</p>
					<div className={styles['description-box']}>
						<FormatQuote className={styles.quote} />
						<p className={styles.description}>{profile.description}</p>
					</div>
					<p className={styles.label}>Favorite yoyo:</p>
					<p className={styles.yoyo}>{profile.yoyo}</p>
					<p className={styles.label}>Favorite brand:</p>
					<p className={styles.brand}>{profile.brand}</p>
				</section>
				<VerticalDivider />
				<section className={styles.right}>
					<div className={styles['collections-container']}>
						{/* MAKE THE PLURAL CONDITIONAL ON COLLECTIONS.LENGTH */}
						<h2 className={styles.h2}>{profile.first}'s Collection(s):</h2>
						<CollectionCarousel />
					</div>
					<div className={styles['favorites-container']}>
						<h2 className={styles.h2}>Favorites:</h2>
						<CollectionCarousel type='Favorite Collections:' />
						<CollectionCarousel type='Favorite Yoyos:' />
					</div>
				</section>
			</div>
		</div>
	);
}

export default ProfilePage;
