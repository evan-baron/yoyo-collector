'use client';

// Libraries
import React, { useState, useEffect, useMemo } from 'react';

// Config/Utils
import { getInitialInputs } from './inputConfig';

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
import ManufacturerDropdown from '../newYoyoForm/manufacturerDropdown/ManufacturerDropdown';
import YearDropdown from '../newYoyoForm/yearDropdown/YearDropdown';
import ResponseDropdown from '../newYoyoForm/responseDropdown/ResponseDropdown';
import BearingDropdown from '../newYoyoForm/bearingDropdown/bearingDropdown';

function EditableYoyoTile({
	yoyoData,
	setSelectedYoyo,
	setSelectedYoyos,
	selectedTile,
}) {
	const { newYoyoData, setNewYoyoData, originalYoyoData, setOriginalYoyoData } =
		useAppContext();

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
			model: model || '',
			brand: brand || '',
			bearing: bearing || '',
			colorway: colorway || '',
			releaseYear: releaseYear || '',
			originalOwner: originalOwner || '',
			purchaseYear: purchaseYear || '',
			purchasePrice: purchasePrice || '',
			category: category || '',
			responseType: responseType || '',
			condition: condition || '',
			value: value || '',
		});
	}, [yoyoData]);

	useEffect(() => {
		setNewYoyoData({ ...originalYoyoData });
	}, [originalYoyoData]);

	const [inputs, setInputs] = useState(() =>
		getInitialInputs(
			model,
			brand,
			colorway,
			category,
			releaseYear,
			responseType,
			bearing,
			originalOwner,
			purchaseYear,
			purchasePrice,
			value
		)
	);

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

		inputs[name].error.valid &&
			setInputs((prev) => ({
				...prev,
				[name]: {
					...prev[name],
					error: { valid: true, message: '' },
				},
			}));

		const invalidChars = getInvalidChars(name, value);

		if (invalidChars) {
			setInputs((prev) => ({
				...prev,
				[name]: {
					...prev[name],
					error: {
						valid: false,
						message: `Invalid characters used: ${invalidChars}`,
					},
				},
			}));
		} else {
			setInputs((prev) => ({
				...prev,
				[name]: {
					...prev[name],
					error: { valid: true, message: '' },
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

		inputs[name].error.valid &&
			setInputs((prev) => ({
				...prev,
				[name]: {
					...prev[name],
					error: { valid: true, message: '' },
				},
			}));

		const invalidChars = getInvalidChars(name, value);

		if (invalidChars) {
			setInputs((prev) => ({
				...prev,
				[name]: {
					...prev[name],
					error: {
						valid: false,
						message: `Invalid characters used: ${invalidChars}`,
					},
				},
			}));
		} else {
			setInputs((prev) => ({
				...prev,
				[name]: {
					...prev[name],
					error: { valid: true, message: '' },
				},
			})); // Clear any previous error
		}

		setNewYoyoData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleUndo = (item) => {
		setNewYoyoData((prev) => ({
			...prev,
			[item]: originalYoyoData[item],
		}));
	};

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
							{Object.entries(inputs).map(([key, item]) => {
								if (item.position === 'left') {
									return (
										<React.Fragment key={key}>
											<YoyoTileInput
												name={item.name}
												itemLabel={item.label}
												value={newYoyoData[item.name]}
												handleChange={
													item.input.type === 'input'
														? handleChange
														: handleDropdownChange
												}
												handleUndo={handleUndo}
												maxLength={item.maxLength}
												error={item.error}
												input={item.input}
												undo={
													originalYoyoData[item.name] !== newYoyoData[item.name]
												}
											/>
											{item.name !== 'responseType' &&
												item.name !== 'bearing' &&
												item.name !== 'releaseYear' &&
												!item.error.valid && (
													<p className={styles.error}>{item.error.message}</p>
												)}
										</React.Fragment>
									);
								}
							})}
						</div>
						<div className={styles.right}>
							{Object.entries(inputs).map(([key, item]) => {
								if (item.position === 'right') {
									return (
										<React.Fragment key={key}>
											<YoyoTileInput
												name={item.name}
												itemLabel={item.label}
												value={newYoyoData[item.name]}
												handleChange={
													item.input.type === 'input'
														? handleChange
														: handleDropdownChange
												}
												handleUndo={handleUndo}
												maxLength={item.maxLength}
												error={item.error}
												input={item.input}
												undo={
													originalYoyoData[item.name] !== newYoyoData[item.name]
												}
											/>
											{item.name !== 'responseType' &&
												item.name !== 'bearing' &&
												item.name !== 'releaseYear' &&
												!item.error.valid && (
													<p className={styles.error}>{item.error.message}</p>
												)}
										</React.Fragment>
									);
								}
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
