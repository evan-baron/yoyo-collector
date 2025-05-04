// Libraries
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import sessionService from '@/services/sessionService';
import dayjs from 'dayjs';
import { validateAndExtendSession } from '@/lib/auth/validateAndExtend';

// Components
import SettingsConsole from '@/app/components/settingsComponents/settingsConsole/SettingsConsole';

async function Settings() {
	await validateAndExtendSession('profile/settings/page.jsx');

	return <SettingsConsole />;
}

export default Settings;
