// Libraries
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// Components
import SettingsConsole from '@/app/components/settingsComponents/settingsConsole/SettingsConsole';

async function Settings() {
	const cookieStore = await cookies();
	const token = cookieStore.get('session_token')?.value;

	if (!token) {
		redirect('/');
	}

	return <SettingsConsole />;
}

export default Settings;
