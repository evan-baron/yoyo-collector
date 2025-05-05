// Libraries
import React from 'react';
import { redirect } from 'next/navigation';
import userService from '@/services/userService';
import collectionsService from '@/services/collectionsService';
import Link from 'next/link';
import dayjs from 'dayjs';
import { validateAndExtendSession } from '@/lib/auth/validateAndExtend';

// Styles
import styles from './profile.module.scss';

// MUI
import {
	Add,
	East,
	Place,
	AlternateEmail,
	FormatQuote,
	Settings,
	Edit,
} from '@mui/icons-material';

// Components
import VerticalDivider from '../components/dividers/VerticalDivider';
import CollectionCarousel from '../components/collectionCarousel/CollectionCarousel';
import NewCollectionButton from '../components/newCollectionButton/NewCollectionButton';
import BlankProfilePhoto from '../components/blankProfilePhoto/BlankProfilePhoto';
import CollectionTile from '../components/collectionTile/CollectionTile';
import CollectionsTiles from '../components/collectionsTiles/CollectionsTiles';

async function Profile() {
	const { user_id } = await validateAndExtendSession('profile/page.jsx');

	let profile = {};
	let userCollections = [];

	try {
		const user = await userService.getUserById(user_id);

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
		} = user;

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
			memberSince: dayjs(created_at).format('MMMM, D, YYYY'),
		};

		const collectionData = await collectionsService.getAllCollectionsById(
			user_id
		);

		userCollections = collectionData;
	} catch (err) {
		console.error(
			'Error fetching user or collection data at profile/page:',
			err
		);
		redirect('/');
	}

	return (
		<div className={styles['profile-container']}>
			<div className={styles.profile}>
				<section className={styles.left}>
					<div className={styles['profile-picture']}>
						{profile.profilePicture ? (
							<img src={profile.profilePicture} className={styles.picture} />
						) : (
							<BlankProfilePhoto />
						)}
					</div>
					<div className={styles['name-info-box']}>
						<h1 className={styles.h1}>
							{profile.first} {profile.last}
						</h1>
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
						<div className={styles.details}>
							<h3 className={styles.handle}>
								Member since: {profile.memberSince}
							</h3>
						</div>
					</div>
					{profile.description && (
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
						</>
					)}
					{profile.yoyo && (
						<>
							<p className={styles.label}>Favorite yoyo:</p>
							<p className={styles.yoyo}>{profile.yoyo}</p>
						</>
					)}
					{profile.brand && (
						<>
							<p className={styles.label}>Favorite brand:</p>
							<p className={styles.brand}>{profile.brand}</p>
						</>
					)}
				</section>
				<VerticalDivider />
				<section className={styles.right}>
					<div className={styles['collections-container']}>
						{/* MAKE THE PLURAL CONDITIONAL ON COLLECTIONS.LENGTH */}
						<CollectionsTiles
							size='small'
							collectionType={'user'}
							scroll={'click'} // Click for the scroll with click nav dots, auto for default map
							page={'profile'}
						/>
					</div>
					<div className={styles['favorites-container']}>
						<h2 className={styles.h2}>Favorites:</h2>
						<CollectionCarousel title='Favorite Collections:' />
						<CollectionCarousel title='Favorite Yoyos:' />
					</div>
				</section>
			</div>
			{/* <Link href='/profile/settings' className={styles['settings-box']}>
				<Edit className={styles['settings-icon']} />
				<p className={styles.settings}>Edit Your Profile</p>
			</Link> */}
			<div className={styles['settings-buttons']}>
				<Link href='/profile/settings' className={styles['settings-box']}>
					<Settings className={styles['settings-icon']} />
					<p className={styles.settings}>Profile Settings</p>
				</Link>
				<Link href='/mycollections' className={styles['settings-box']}>
					<Edit className={styles['settings-icon']} />
					<p className={styles.settings}>Edit Collections</p>
				</Link>
				<NewCollectionButton />
			</div>
		</div>
	);
}

export default Profile;
