// Utils
import axiosInstance from '@/utils/axios';
import { redirect } from 'next/navigation';

// Styles
import styles from './collectionPage.module.scss';

// Components
import CollectionTemplate from '@/app/components/collectionTemplate/CollectionTemplate';
import EditableCollectionTemplate from '@/app/components/editableCollectionTemplate/EditableCollectionTemplate';

async function Collection({ params }) {
	const { collectionId } = await params;

	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

	let collection;

	try {
		const response = await axiosInstance.get(
			`${baseUrl}/api/user/collections?collectionId=${collectionId}`
		);

		collection = response.data;
	} catch (error) {
		console.error('Error fetching collection data:', error);
		redirect('/');
	}

	return <EditableCollectionTemplate collection={collection} />;
}

export default Collection;
