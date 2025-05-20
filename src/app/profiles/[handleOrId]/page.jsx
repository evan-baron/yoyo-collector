// Utils
import axiosInstance from '@/lib/utils/axios';
import { redirect } from 'next/navigation';
import dayjs from 'dayjs';

// Styles
import styles from '../../profile/profile.module.scss';

// MUI
import { Place, AlternateEmail } from '@mui/icons-material';

// Components
import VerticalDivider from '@/app/components/dividers/VerticalDivider';
import CollectionCarousel from '@/app/components/collectionCarousel/CollectionCarousel';
import BlankProfilePhoto from '@/app/components/blankProfilePhoto/BlankProfilePhoto';
import CollectionsTiles from '@/app/components/collectionsComponents/myCollectionsComponents/collectionsTiles/CollectionsTiles';

async function ProfilePage({ params }) {
	const { handleOrId } = await params;

	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

	let profile;

	try {
		const user = await axiosInstance.get(
			`${baseUrl}/api/user/getUser?handleOrId=${handleOrId}`
		);
		const {
			id,
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
			profileId: id,
			first: first_name,
			last: last_name,
			handle: handle,
			location: location(),
			privacy: privacy,
			yoyo: favorite_yoyo,
			brand: favorite_brand,
			description: description,
			profilePicture: secure_url,
			memberSince: dayjs(created_at).format('MMMM, D, YYYY'),
		};
	} catch (error) {
		console.error('Error fetching profile data:', error);
		redirect('/');
	}

	if (profile.privacy === 'private') {
		redirect('/');
	}

	return (
		<div className={styles['profile-container']}>
			<div className={styles.profile}>
				<section className={styles.left}>
					<div className={styles['profile-picture']}>
						{profile.profilePicture && profile.privacy === 'public' ? (
							<img src={profile.profilePicture} className={styles.picture} />
						) : (
							<BlankProfilePhoto />
						)}
					</div>
					<div className={styles['name-info-box']}>
						<h1 className={styles.h1}>
							{profile.privacy === 'public'
								? `${profile.first} ${profile.last}`
								: 'Anonymous'}
						</h1>
						{profile.privacy === 'public' && (
							<>
								{(profile.handle || profile.location) && (
									<div className={styles.details}>
										{profile.handle && (
											<h3 className={styles.handle}>
												<AlternateEmail className={styles.icon} />
												{profile.handle}
											</h3>
										)}
										{profile.location && (
											<h3 className={styles.location}>
												<Place className={styles.icon} />
												{profile.location}
											</h3>
										)}
									</div>
								)}
								{profile.privacy === 'public' && (
									<div className={styles.details}>
										<h3 className={styles.handle}>
											Member since: {profile.memberSince}
										</h3>
									</div>
								)}
							</>
						)}
					</div>
					{profile.privacy === 'public' && (
						<>
							<p className={styles.label}>About {profile.first}:</p>
							<div className={styles['description-box']}>
								<svg viewBox='0 0 24 24' className={styles.quote}>
									<defs>
										<linearGradient
											id='quoteGradient'
											x1='0%'
											y1='0%'
											x2='100%'
											y2='100%'
										>
											<stop offset='0%' stopColor='#00e1ff' />
											<stop offset='85%' stopColor='#ff00ff' />
										</linearGradient>
									</defs>
									<path
										d='M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z'
										fill='url(#quoteGradient)'
									/>
								</svg>
								<p className={styles.description}>{profile.description}</p>
							</div>
							<p className={styles.label}>Favorite yoyo:</p>
							<p className={styles.yoyo}>{profile.yoyo}</p>
							<p className={styles.label}>Favorite brand:</p>
							<p className={styles.brand}>{profile.brand}</p>
						</>
					)}
				</section>
				<VerticalDivider />
				<section className={styles.right}>
					<div className={styles['collections-container']}>
						<CollectionsTiles
							profileId={profile.profileId}
							scroll={'click'}
							size={'small'}
							collectionType={'visitor'}
							userName={
								profile.privacy === 'public' ? profile.first : 'Anonymous'
							}
							page={'profile'}
							privacy={profile.privacy}
						/>
					</div>
					<div className={styles['favorites-container']}>
						<h2 className={styles.h2}>Favorites:</h2>
						<CollectionCarousel title='Favorite Collections:' />
						<CollectionCarousel title='Favorite Yoyos:' />
					</div>
				</section>
			</div>
		</div>
	);
}

export default ProfilePage;
