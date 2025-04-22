// Libraries
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import Link from 'next/link';

// Styles
import styles from './profile.module.scss';

// MUI
import { West, Settings } from '@mui/icons-material';

async function Profile() {
	const cookieStore = await cookies();
	const token = cookieStore.get('session_token')?.value;

	if (!token) {
		redirect('/');
	}

	return (
		<div className={styles.profile}>
			<div className={styles.preview}>
				<Link href='/profile/settings' className={styles.back}>
					<West className={styles.west} />
					Settings
				</Link>
			</div>
		</div>
	);
}

export default Profile;
