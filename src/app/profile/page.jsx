// Libraries
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import axiosInstance from '@/utils/axios';
import Link from 'next/link';

// Styles
import styles from './profile.module.scss';

// MUI
import { East, Place, AlternateEmail, FormatQuote } from '@mui/icons-material';

// Components
import VerticalDivider from '../components/dividers/VerticalDivider';

async function Profile() {
	const cookieStore = await cookies();
	const token = cookieStore.get('session_token')?.value;
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

	if (!token) {
		redirect('/');
	}

	let profile = {};

	try {
		const user = await axiosInstance.get(`${baseUrl}/api/token/authenticate/`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

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
		};
		console.log(user.data);
	} catch (error) {
		console.error('Error fetching user data:', error);
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
						<h1 className={styles.name}>
							{profile.first} {profile.last}
						</h1>
						<div className={styles.details}>
							<h2 className={styles.handle}>
								<AlternateEmail className={styles.icon} />
								{profile.handle}
							</h2>
							<h2 className={styles.location}>
								<Place className={styles.icon} />
								{profile.location}
							</h2>
						</div>
					</div>
					<p className={styles.about}>About {profile.first}:</p>
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
				<section className={styles.right}></section>
				{/* <Link href='/profile/settings' className={styles.settings}>
					Profile Settings
					<East className={styles.west} />
				</Link> */}
			</div>
		</div>
	);
}

export default Profile;
