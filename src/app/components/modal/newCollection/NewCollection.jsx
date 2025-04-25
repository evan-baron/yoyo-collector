'use client';

// Libraries
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Styles
import styles from './newCollection.module.scss';

// Context
import { useAppContext } from '@/app/context/AppContext';

function NewCollection() {
	const { setModalOpen, setPendingRoute, pendingRoute } = useAppContext();

	const router = useRouter();

	const [formData, setFormData] = useState({
		collection: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		console.log('submit');
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.h2}>New Collection</h2>
			<div className={styles['collection-input']}>
				<label htmlFor='collection' className={styles.label}>
					Collection Name:
				</label>
				<div className={styles['input-container']}>
					<input
						id='collection'
						name='collection'
						value={formData.collection}
						onChange={handleChange}
						required
						aria-label='Enter a name for your collection'
						className={styles.input}
					/>
				</div>
			</div>
			<div className={styles.buttons}>
				<button
					className={styles.button}
					onClick={() => {
						setModalOpen(false);
						setPendingRoute(null);
					}}
				>
					Cancel
				</button>
				<button className={styles.button} onClick={handleSubmit}>
					Create Collection
				</button>
			</div>
		</div>
	);
}

export default NewCollection;
