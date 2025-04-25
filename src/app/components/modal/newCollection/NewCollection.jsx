'use client';

// Libraries
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Utils
import axiosInstance from '@/utils/axios';

// Styles
import styles from './newCollection.module.scss';

// Context
import { useAppContext } from '@/app/context/AppContext';

function NewCollection() {
	const { setModalOpen, setLoading } = useAppContext();

	const router = useRouter();

	const [formData, setFormData] = useState({
		collection: '',
	});
	const [error, setError] = useState(null);
	const [collectionCreated, setCollectionCreated] = useState(null);

	const getInvalidChars = (input) => {
		const regex = /[^A-Za-z0-9\-_\.~()"' ]/g;
		const matches = input.match(regex);
		return matches ? matches.join('') : '';
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		const invalidChars = getInvalidChars(value);

		if (invalidChars) {
			setError(`Invalid characters in name: ${invalidChars}`);
		} else {
			setError(null); // Clear any previous error
		}

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async () => {
		const trimmed = formData.collection?.trim();

		const valid = (param) => /^[A-Za-z0-9\-_.~()"' ]+$/.test(param);

		if (!trimmed) {
			setError(`Collection name can't be empty.`);
			return;
		}

		if (!valid(trimmed)) {
			setError('Only letters, numbers, spaces, -, _, ., and ~ are allowed.');
			return;
		}

		try {
			setLoading(true);
			await axiosInstance.post('/api/user/collections', formData);
		} catch (error) {
			console.error(
				'There was an error creating a collection at NewCollection.jsx:',
				error.message
			);
		} finally {
			setLoading(false);
			setCollectionCreated(true);
			setFormData({
				collection: '',
			});
		}
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.h2}>
				{collectionCreated ? 'Go To Collection?' : 'New Collection'}
			</h2>
			{!collectionCreated && (
				<div className={styles['collection-input']}>
					<label htmlFor='collection' className={styles.label}>
						Collection Name:
					</label>
					<div className={styles['input-container']}>
						<input
							id='collection'
							name='collection'
							placeholder='My Collection'
							value={formData.collection}
							onChange={handleChange}
							required
							aria-label='Enter a name for your collection'
							className={styles.input}
							maxLength='30'
						/>
					</div>
				</div>
			)}
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<div className={styles.buttons}>
				{collectionCreated ? (
					<button
						className={styles.button}
						onClick={() => console.log('go to collection')}
						style={{ width: '6rem' }}
					>
						OK
					</button>
				) : (
					<button
						className={styles.button}
						disabled={!!error}
						onClick={handleSubmit}
						style={{
							opacity: !!error && '.5',
							cursor: !!error && 'auto',
						}}
					>
						Create Collection
					</button>
				)}
				<button
					className={styles.button}
					onClick={() => {
						setModalOpen(false);
						setCollectionCreated(null);
					}}
				>
					{collectionCreated ? 'Not now' : 'Cancel'}
				</button>
			</div>
		</div>
	);
}

export default NewCollection;
