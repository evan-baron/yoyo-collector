'use client';

// Libraries
import React, { useState, useEffect, useMemo } from 'react';

// Styles
import styles from './editableYoyoTile.module.scss';

// MUI
import { Edit, Undo } from '@mui/icons-material';

// Components
import BlankYoyoPhoto from '@/app/components/blankYoyoPhoto/BlankYoyoPhoto';
import Heart from '@/app/components/icons/heart/Heart';
import YoyoTileInput from '../yoyoTileInput/YoyoTileInput';
import LoadingSpinner from '@/app/components/loading/LoadingSpinner';

// Context
import { useAppContext } from '@/app/context/AppContext';

function EditableYoyoTile({
	yoyoData,
	setSelectedYoyo,
	setSelectedYoyos,
	selectedTile,
}) {
	const { newYoyoData, setNewYoyoData, originalYoyoData, setOriginalYoyoData } =
		useAppContext();

	const [error, setError] = useState({
		model: {
			valid: true,
			message: '',
		},
		brand: {
			valid: true,
			message: '',
		},
		colorway: {
			valid: true,
			message: '',
		},
		category: {
			valid: true,
			message: '',
		},
		purchasePrice: {
			valid: true,
			message: '',
		},
		value: {
			valid: true,
			message: '',
		},
		condition: {
			valid: true,
			message: '',
		},
	});

	const {
		id,
		bearing,
		brand,
		category,
		colorway,
		likes,
		model,
		original_owner: originalOwner,
		purchase_price: purchasePrice,
		purchase_year: purchaseYear,
		release_year: releaseYear,
		response_type: responseType,
		yoyo_condition: condition,
		yoyo_value: value,
	} = yoyoData;

	useEffect(() => {
		setOriginalYoyoData({
			id: id,
			model: model,
			brand: brand,
			bearing: bearing,
			colorway: colorway,
			releaseYear: releaseYear,
			originalOwner: originalOwner,
			purchaseYear: purchaseYear,
			purchasePrice: purchasePrice,
			category: category,
			responseType: responseType,
			condition: condition,
			value: value,
		});
	}, [yoyoData]);

	useEffect(() => {
		setNewYoyoData({ ...originalYoyoData });
	}, [originalYoyoData]);

	const left = [
		{
			name: 'model',
			label: 'Model',
			value: model,
			maxLength: '50',
		},
		{
			name: 'brand',
			label: 'Brand',
			value: brand,
			maxLength: '50',
		},
		{
			name: 'colorway',
			label: 'Colorway',
			value: colorway,
			maxLength: '50',
		},
		{
			name: 'category',
			label: 'Category',
			value: category,
			maxLength: '60',
		},
		{
			name: 'releaseYear',
			label: 'Released',
			value: releaseYear,
			maxLength: '4',
		},
		{
			name: 'responseType',
			label: 'Response',
			value: responseType,
			maxLength: '20',
		},
		{
			name: 'bearing',
			label: 'Bearing',
			value: bearing,
			maxLength: '20',
		},
	];

	const right = [
		{
			name: 'originalOwner',
			label: 'Original owner',
			value: originalOwner,
		},
		{
			name: 'purchaseYear',
			label: 'Purchased',
			value: purchaseYear,
		},
		{
			name: 'purchasePrice',
			label: 'Purchase price',
			value: purchasePrice,
		},
		{
			name: 'value',
			label: 'Approximate value',
			value: value,
		},
	];

	const handleSelect = () => {
		// console.log(yoyoData);
		setSelectedYoyo(id);
		// selectedTile ? setSelectedYoyo(null) : setSelectedYoyo(id);
	};

	// Validation
	//Constants
	const noSpecials = [
		'model',
		'brand',
		'bearing',
		'responseType',
		'color',
		'category',
	];
	const onlyNums = ['year', 'purchased'];
	const specialsAllowed = ['value', 'price', 'condition'];

	const getInvalidChars = (name, input) => {
		const noSpecialsTest = /[^a-zA-Z0-9 \-./!']/g;
		const specialsTest = /[^a-zA-Z0-9 '$%^&*()\-\+\/!@,.?:\";#]/g;
		if (noSpecials.includes(name)) {
			const matches = input.match(noSpecialsTest);
			return matches ? matches.join('') : '';
		}
		if (specialsAllowed.includes(name)) {
			const matches = input.match(specialsTest);
			return matches ? matches.join('') : '';
		}
	};

	const handleDropdownChange = (e, meta) => {
		const { name } = meta;
		const value = e ? e.value : '';

		error &&
			setError((prev) => ({
				...prev,
				[name]: {
					valid: true,
					message: '',
				},
			}));

		const invalidChars = getInvalidChars(name, value);

		if (invalidChars) {
			setError((prev) => ({
				...prev,
				[name]: {
					valid: false,
					message: `Invalid characters used: ${invalidChars}`,
				},
			}));
		} else {
			setError((prev) => ({
				...prev,
				[name]: {
					valid: true,
					message: '',
				},
			})); // Clear any previous error
		}

		setNewYoyoData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		console.log(name, value);

		error &&
			setError((prev) => ({
				...prev,
				[name]: {
					valid: true,
					message: '',
				},
			}));

		const invalidChars = getInvalidChars(name, value);

		if (invalidChars) {
			setError((prev) => ({
				...prev,
				[name]: {
					valid: false,
					message: `Invalid characters used: ${invalidChars}`,
				},
			}));
		} else {
			setError((prev) => ({
				...prev,
				[name]: {
					valid: true,
					message: '',
				},
			})); // Clear any previous error
		}

		setNewYoyoData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// const handleChange = (e) => {
	// 	const { name, value } = e.target;
	// 	console.log(value);

	// 	setNewYoyoData((prev) => ({
	// 		...prev,
	// 		[name]: value,
	// 	}));
	// };

	const loadingComplete = useMemo(() => {
		return originalYoyoData !== undefined && newYoyoData !== undefined;
	}, [originalYoyoData, newYoyoData]);

	if (!loadingComplete) return <LoadingSpinner message='loading' />;

	return (
		<div
			className={`${styles.tile} ${selectedTile && styles.selected}`}
			onClick={handleSelect}
		>
			<input type='checkbox' className={styles.input} />

			<div className={styles['image-box']}>
				<div className={styles.image}>
					<BlankYoyoPhoto />
				</div>
				<div className={styles.likes}>
					<Heart size='small' likes={likes} />
					{likes > 0 && (
						<>
							{likes} {likes && likes === 1 ? 'like' : 'likes'}
						</>
					)}
				</div>
			</div>
			<div className={styles['content-box']}>
				<div className={styles.details}>
					<>
						<div className={styles.left}>
							{left.map((item, index) => {
								return (
									<React.Fragment key={index}>
										<YoyoTileInput
											name={item.name}
											itemLabel={item.label}
											value={newYoyoData[item.name]}
											handleChange={handleChange}
											handleDropdownChange={handleDropdownChange}
											type={'text'}
											maxLength={item.maxLength}
											error={error}
										/>
										{item.name !== 'responseType' &&
											item.name !== 'bearing' &&
											item.name !== 'releaseYear' &&
											!error[item.name]?.valid && (
												<p className={styles.error}>
													{error[item.name]?.message}
												</p>
											)}
									</React.Fragment>
								);
							})}
						</div>
						<div className={styles.right}>
							{right.map((item, index) => {
								return (
									<React.Fragment key={index}>
										<YoyoTileInput
											name={item.name}
											itemLabel={item.label}
											handleChange={handleChange}
											handleDropdownChange={handleDropdownChange}
											value={item.value}
											type={item.name === 'originalOwner' ? 'radio' : 'text'}
											maxLength={item.maxLength}
											error={error}
										/>
										{item.name !== 'originalOwner' &&
											item.name !== 'purchaseYear' &&
											!error[item.name]?.valid && (
												<p className={styles.error}>
													{error[item.name]?.message}
												</p>
											)}
									</React.Fragment>
								);
							})}
						</div>
					</>
				</div>

				<div className={styles.about}>
					<div className={styles.attribute}>
						<label className={styles.label} htmlFor='condition'>
							About the yoyo:
						</label>
						<p>
							{condition}{' '}
							<Edit
								sx={{
									fontSize: '1.25rem',
									alignSelf: 'end',
								}}
								className={styles.icon}
							/>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EditableYoyoTile;
