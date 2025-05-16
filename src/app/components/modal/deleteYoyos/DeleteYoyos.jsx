'use client';

// Libraries
import React, { useState, useEffect } from 'react';

// Utils
import axiosInstance from '@/lib/utils/axios';

// Styles
import styles from './deleteYoyos.module.scss';

// Context
import { useAppContext } from '@/app/context/AppContext';

function DeleteYoyos() {
	const {
		selectedYoyos,
		setSelectedYoyos,
		setNewCollectionCounter,
		setModalOpen,
		setLoading,
		setUser,
		user,
	} = useAppContext();
	const { delete_yoyo_warning: deleteWarning } = user;

	const [warning, setWarning] = useState(null);
	const [formData, setFormData] = useState({
		understand: false,
		ask: false,
	});
	const [dontAsk, setDontAsk] = useState(deleteWarning);

	useEffect(() => {
		setDontAsk(deleteWarning);
	}, [user.delete_yoyo_warning]);

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
		if (!deleteWarning && !warning) {
			setWarning(true);
			return;
		}

		console.log(selectedYoyos);

		try {
			setLoading(true);
			if (formData.ask) {
				try {
					await axiosInstance.patch('/api/user/updateSettings', {
						warningType: 'yoyo',
					});
				} catch (error) {
					throw new Error(
						'Error setting delete_yoyo_warning in DeleteYoyos modal',
						error.message
					);
				} finally {
					setUser((prev) => ({
						...prev,
						delete_yoyo_warning: 1,
					}));
				}
			}
			await Promise.all(
				selectedYoyos.map((yoyo) =>
					axiosInstance.delete('/api/user/yoyos', {
						data: {
							id: yoyo,
						},
					})
				)
			);
		} catch (error) {
			console.error('There was an error deleting the yoyos', error.message);
			return;
		} finally {
			setWarning(false);
			setModalOpen(false);
			setSelectedYoyos([]);
			setNewCollectionCounter((prev) => prev + 1);
			setLoading(false);
		}
	}

	return (
		<div className={styles.container}>
			<h2 className={styles.h2}>
				Delete {selectedYoyos.length > 1 ? 'Yoyos' : 'Yoyo'}
			</h2>
			{warning && (
				<div className={styles.warning}>
					<h3 className={styles.h3}>
						<span
							style={{
								color: 'red',
								fontWeight: 'bold',
								fontSize: '1.75rem',
								textShadow: '2px 2px .5rem rgba(0, 0, 0, .75)',
							}}
						>
							Warning:
						</span>{' '}
						Deleting yoyos will{' '}
						<span style={{ fontWeight: 'bold' }}>permanently</span> delete all
						the contents related to them:
						<br />
					</h3>
					<ul className={styles.ul}>
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

export default DeleteYoyos;
