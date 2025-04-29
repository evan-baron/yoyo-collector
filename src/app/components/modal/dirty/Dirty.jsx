'use client';

// Libraries
import React from 'react';
import { useRouter } from 'next/navigation';

// Utils
import axiosInstance from '@/utils/axios';
import { trimAndValidate, warningMessage } from '@/helpers/validation';

// Styles
import styles from './dirty.module.scss';

// Context
import { useAppContext } from '@/app/context/AppContext';

function Dirty() {
	const {
		originalCollectionData,
		newCollectionData,
		setOriginalCollectionData,
		dirtyType,
		pendingRoute,
		profileSettingsFormData,
		user,
		error,
		setProfileSettingsFormData,
		setLoading,
		setPendingRoute,
		setUser,
		setCurrentlyEditing,
		setDirty,
		setDirtyType,
		setError,
		setModalOpen,
		setModalType,
	} = useAppContext();

	const router = useRouter();

	const handleLogout = async () => {
		try {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
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
				const user = response.data.user;
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
		}
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.h2}>Save Changes</h2>
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
					Save
				</button>
			</div>
		</div>
	);
}

export default Dirty;
