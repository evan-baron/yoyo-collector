// Context
import { useAppContext } from '@/app/context/AppContext';

export default function useCollectionCounter() {
	const { setNewCollectionCounter } = useAppContext();

	const incrementCollectionCounter = () => {
		setNewCollectionCounter((prev) => prev + 1);
	};

	return incrementCollectionCounter;
}
