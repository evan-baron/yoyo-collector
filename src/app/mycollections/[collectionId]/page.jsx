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
	let photos;

	try {
		const response = await axiosInstance.get(
			`${baseUrl}/api/user/collections?collectionId=${collectionId}`
		);

		collection = response.data.collectionData;
		photos = response.data.collectionPhotos;

		console.log(collection);
	} catch (error) {
		console.error('Error fetching collection data:', error);
		redirect('/');
	}

	// console.log(collection);

	return <EditableCollectionTemplate collection={collection} photos={photos} />;
}

export default Collection;
