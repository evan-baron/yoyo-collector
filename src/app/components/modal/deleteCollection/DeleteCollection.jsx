'use client';

// Libraries
import React, { useState, useEffect } from 'react';

// Utils
import axiosInstance from '@/utils/axios';
import useCollectionCounter from '@/helpers/collectionCounter';

// Styles
import styles from './deleteCollection.module.scss';

// Context
import { useAppContext } from '@/app/context/AppContext';

function DeleteCollection() {
	const {
		collectionToDelete,
		setCollectionToDelete,
		setModalOpen,
		setLoading,
		setUser,
		user,
	} = useAppContext();
	const { delete_collection_warning: deleteWarning } = user;
	const incrementCollectionCounter = useCollectionCounter();

	const [warning, setWarning] = useState(null);
	const [formData, setFormData] = useState({
		understand: false,
		ask: false,
	});
	const [dontAsk, setDontAsk] = useState(deleteWarning);

	useEffect(() => {
		setDontAsk(deleteWarning);
	}, [user.delete_collection_warning]);

	function handleChange(e) {
		const { name, checked } = e.target;
		if (name === 'ask' && !formData.understand) {
			setFormData({
				understand: true,
				ask: true,
			});
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: checked,
			}));
		}
	}

	async function handleSubmit() {
		console.log('delete collection', collectionToDelete);
		console.log(deleteWarning);
		console.log(formData);
		console.log(user);

		if (!deleteWarning && !warning) {
			setWarning(true);
			return;
		}

		try {
			setLoading(true);
			if (formData.ask) {
				console.log('test');
				try {
					await axiosInstance.patch('/api/user/updateSettings', {
						warningType: 'collection',
					});
				} catch (error) {
					throw new Error(
						'Error setting delete_collection_warning in DeleteCollection modal',
						error.message
					);
				} finally {
					setUser((prev) => ({
						...prev,
						delete_collection_warning: 1,
					}));
				}
			}
			await axiosInstance.delete('/api/user/collections/byCollectionId', {
				data: {
					id: collectionToDelete,
				},
			});
		} catch (error) {
			console.error(
				'There was an error deleting the collection',
				error.message
			);
			return;
		} finally {
			setWarning(false);
			setModalOpen(false);
			setCollectionToDelete(null);
			incrementCollectionCounter();
			setLoading(false);
		}
	}

	return (
		<div className={styles.container}>
			<h2 className={styles.h2}>Delete Collection</h2>
			{warning && (
				<div className={styles.warning}>
					<h3 className={styles.h3}>
						<span
							style={{
								color: 'red',
								fontWeight: 'bold',
								fontSize: '2rem',
								textShadow: '2px 2px .5rem rgba(0, 0, 0, .75)',
							}}
						>
							Warning:
						</span>{' '}
						Deleting the collection will{' '}
						<span style={{ fontWeight: 'bold' }}>permanently</span> delete all
						the contents inside of it:
						<br />
					</h3>
					<ul className={styles.ul}>
						<li>Collection Data</li>
						<li>Collection Photos</li>
						<li>Yoyo Data</li>
						<li>Yoyo Photos</li>
					</ul>
					<div className={styles.inputs}>
						<div className={styles.item}>
							<input
								className={styles.checkbox}
								type='checkbox'
								id='understand'
								name='understand'
								checked={formData.understand}
								onChange={handleChange}
								required
							/>
							<label htmlFor='understand'>I understand</label>
						</div>
						<div className={styles.item}>
							<input
								className={styles.checkbox}
								type='checkbox'
								id='ask'
								name='ask'
								checked={formData.ask}
								onChange={handleChange}
							/>
							<label htmlFor='ask'>Don't ask again</label>
						</div>
					</div>
				</div>
			)}
			<div className={styles.buttons}>
				<button
					className={styles.button}
					onClick={() => {
						setModalOpen(false);
					}}
				>
					Cancel
				</button>
				<button
					className={styles.button}
					onClick={handleSubmit}
					disabled={warning && !formData.understand}
					style={{
						opacity: warning && !formData.understand ? '.5' : '1',
						cursor: warning && !formData.understand ? 'default' : 'pointer',
					}}
				>
					Delete
				</button>
			</div>
		</div>
	);
}

export default DeleteCollection;
