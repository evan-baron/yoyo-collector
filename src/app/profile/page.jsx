// Libraries
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import axiosInstance from '@/utils/axios';
import Link from 'next/link';

// Styles
import styles from './profile.module.scss';

// MUI
import { East } from '@mui/icons-material';

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

		profile = {
			first: first_name,
			last: last_name,
			handle: handle,
			city: city,
			state: state,
			country: country,
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
		<div className={styles.profile}>
			<div className={styles.preview}>
				<Link href='/profile/settings' className={styles.settings}>
					Profile Settings
					<East className={styles.west} />
				</Link>
			</div>
		</div>
	);
}

export default Profile;
