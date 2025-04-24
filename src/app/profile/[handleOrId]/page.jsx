// Libraries
import React from 'react';
import { notFound } from 'next/navigation';

// Utils
import axiosInstance from '@/utils/axios';

export default async function ProfilePage({ params }) {
	const { handleOrId } = params;
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

	let user = null;

	return <div>page</div>;
}
