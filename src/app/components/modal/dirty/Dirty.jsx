'use client';

// Libraries
import React from 'react';
import { useRouter } from 'next/navigation';

// Utils
import axiosInstance from '@/lib/utils/axios';
import { trimAndValidate, warningMessage } from '@/lib/helpers/validation';

// Styles
import styles from './dirty.module.scss';

// Context
import { useAppContext } from '@/app/context/AppContext';

function Dirty() {
	const {
		originalCollectionData,
		newCollectionData,
		newYoyoData,
		originalYoyoData,
		setOriginalCollectionData,
		dirtyType,
		pendingRoute,
		profileSettingsFormData,
		selectedYoyo,
		user,
		error,
		setProfileSettingsFormData,
		setLoading,
		setPendingRoute,
		setUser,
		setCurrentlyEditing,
		setDirty,
		setDirtyType,
		setEditingYoyos,
		setError,
		setModalOpen,
		setModalType,
		setNewCollectionCounter,
		setNewYoyoData,
		setOriginalYoyoData,
	} = useAppContext();

	const router = useRouter();

	const handleLogout = async () => {
		try {
			setUser(null);
			await axiosInstance.post('/api/auth/logout', user);
		} catch (error) {
			console.error('Logout failed: ', error.response?.data || error.message);
		} finally {
			setProfileSettingsFormData(null);
			setCurrentlyEditing(null);
			setDirty(false);
			setDirtyType(null);
			setLoading(false);
			setModalOpen(false);
			setModalType(null);
			router.push('/');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (dirtyType === 'profile') {
			if (error) {
				setModalType('error');
				return;
			}

			const { trimmedData, failed } = trimAndValidate(profileSettingsFormData);

			if (failed.length) {
				setError(failed.map(([name]) => [name, warningMessage[name]]));
				return;
			}

			const submitData = trimmedData;

			try {
				setLoading(true);
				setModalOpen(false);
				const response = await axiosInstance.post(
					'/api/user/updateSettings',
					submitData
				);
				const user = Object.fromEntries(
					Object.entries(response.data.user).map(([key, value]) => [
						key,
						value === null ? '' : value,
					])
				);
				setUser(user);
				setProfileSettingsFormData({
					first: user.first_name || '',
					last: user.last_name || '',
					handle: user.handle || '',
					yoyo: user.favorite_yoyo || '',
					brand: user.favorite_brand || '',
					city: user.city || '',
					state: user.state || '',
					country: user.country || '',
					description: user.description || '',
					privacy: user.privacy || '',
				});
			} catch (error) {
				setLoading(false);
				console.log(
					'There was an error submitting profileSettings in components/modal/dirty/Dirty.jsx: ',
					error.message
				);
				return;
			} finally {
				if (pendingRoute) {
					if (pendingRoute === 'logout') {
						handleLogout();
					} else {
						router.push(pendingRoute);
					}
					setPendingRoute(null);
				}
				setCurrentlyEditing(null);
				setDirty(false);
				setLoading(false);
			}
		} else if (dirtyType === 'collection') {
			if (error) {
				setModalType('error');
				return;
			}

			const { collectionName } = originalCollectionData;

			const trimmed = collectionName.trim();

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
				const submitData = {
					...newCollectionData,
				};
				await axiosInstance.patch(
					'/api/user/collections/byCollectionId',
					submitData
				);
			} catch (error) {
				console.error(
					'There was an error updating the collection',
					error.message
				);
			} finally {
				if (pendingRoute) {
					if (pendingRoute === 'logout') {
						handleLogout();
					} else {
						router.push(pendingRoute);
					}
					setPendingRoute(null);
				}
				setModalOpen(false);
				setDirty(false);
				setError(null);
			}
		} else if (dirtyType === 'yoyo') {
			console.log(newYoyoData);
			console.log(originalYoyoData);
			if (error) {
				setModalType('error');
				return;
			}

			const valuesToUpdate = Object.entries(newYoyoData).reduce(
				(obj, [key, value]) => {
					if (value !== originalYoyoData[key]) {
						obj[key] = value;
					}
					return obj;
				},
				{}
			);

			console.log(selectedYoyo, valuesToUpdate);

			try {
				await axiosInstance.patch('/api/user/yoyos', {
					yoyoId: selectedYoyo,
					valuesToUpdate: valuesToUpdate,
				});
			} catch (error) {
				console.log(
					'There was an error updating the yoyo details at dirty modal',
					error
				);
				return;
			} finally {
				setEditingYoyos(false);
				setDirty(false);
				setDirtyType(null);
				setNewCollectionCounter((prev) => prev + 1);
				setNewYoyoData(null);
				setOriginalYoyoData(null);
				setModalOpen(false);
				setModalType(null);
			}
		}
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.h2}>Save Changes?</h2>
			<div className={styles.buttons}>
				<button className={styles.button} onClick={handleSubmit}>
					Save
				</button>

				{dirtyType === 'yoyo' && (
					<button
						className={styles.button}
						onClick={() => {
							console.log('new:', newYoyoData, 'old:', originalYoyoData);
							setModalOpen(false);
							setDirty(false);
							if (pendingRoute) {
								if (pendingRoute === 'logout') {
									handleLogout();
								} else {
									router.push(pendingRoute);
								}
								setPendingRoute(null);
							}
							setNewYoyoData({ ...originalYoyoData });
						}}
					>
						No
					</button>
				)}

				<button
					className={styles.button}
					onClick={() => {
						setModalOpen(false);
						setPendingRoute(null);
					}}
				>
					Cancel
				</button>
			</div>
		</div>
	);
}

export default Dirty;
