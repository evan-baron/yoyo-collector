'use client';

// Libraries
import React, { useState, useEffect, useMemo } from 'react';

// Config/Utils
import { getInitialInputs } from './inputConfig';

// Styles
import styles from './editableYoyoTile.module.scss';

// MUI
import { Edit, Check, Close, Undo } from '@mui/icons-material';

// Components
import Heart from '@/app/components/icons/heart/Heart';
import YoyoTileInput from '../yoyoTileInput/YoyoTileInput';
import BlankEditableYoyoTile from '../blankEditableYoyoTile/BlankEditableYoyoTile';
import PictureUploader from '@/app/components/pictureUploader/PictureUploader';
import YoyoPhotoScroller from '../yoyoPhotoScroller/YoyoPhotoScroller';

// Context
import { useAppContext } from '@/app/context/AppContext';

function EditableYoyoTile({
	yoyoData,
	selectedTile,
	collectionId,
	added,
	setAdded,
	uploadError,
	setUploadError,
}) {
	const {
		dirty,
		error,
		originalYoyoData,
		newYoyoData,
		setDirty,
		setDirtyType,
		setError,
		setNewYoyoData,
		setOriginalYoyoData,
		setSelectedYoyo,
		selectedYoyo,
		setModalOpen,
		setModalType,
	} = useAppContext();

	const [inputs, setInputs] = useState();
	const [editCondition, setEditCondition] = useState();
	const [currentlyEditing, setCurrentlyEditing] = useState(null);
	const [clearInputRef, setClearInputRef] = useState(null);

	const {
		id,
		bearing,
		brand,
		category,
		colorway,
		likes,
		model,
		photos,
		original_owner: originalOwner,
		purchase_price: purchasePrice,
		purchase_year: purchaseYear,
		release_year: releaseYear,
		response_type: responseType,
		yoyo_condition: condition,
		yoyo_value: value,
	} = yoyoData;

	useEffect(() => {
		if (!yoyoData) return;

		const yoyoObject = {
			id,
			model: model || '',
			brand: brand || '',
			bearing: bearing || '',
			colorway: colorway || '',
			releaseYear: releaseYear || '',
			originalOwner:
				originalOwner === 1 ? 'yes' : originalOwner === 0 ? 'no' : '',
			purchaseYear: purchaseYear || '',
			purchasePrice: purchasePrice || '',
			category: category || '',
			responseType: responseType || '',
			condition: condition || '',
			value: value || '',
		};

		setOriginalYoyoData(yoyoObject);
		setNewYoyoData(yoyoObject);

		setInputs(
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
				value,
				condition
			)
		);
	}, [yoyoData]);

	useEffect(() => {
		if (!inputs) return;

		const hasError = Object.values(inputs).some(
			(obj) => obj.error.valid === false
		);
		setError(hasError);
	}, [inputs]);

	useEffect(() => {
		if (!originalYoyoData || !newYoyoData) {
			return;
		}

		const isDirty =
			originalYoyoData.model.trim() !== newYoyoData.model.trim() ||
			originalYoyoData.brand.trim() !== newYoyoData.brand.trim() ||
			originalYoyoData.bearing.trim() !== newYoyoData.bearing.trim() ||
			originalYoyoData.colorway.trim() !== newYoyoData.colorway.trim() ||
			originalYoyoData.releaseYear !== newYoyoData.releaseYear ||
			originalYoyoData.originalOwner !== newYoyoData.originalOwner ||
			originalYoyoData.purchaseYear !== newYoyoData.purchaseYear ||
			originalYoyoData.purchasePrice.trim() !==
				newYoyoData.purchasePrice.trim() ||
			originalYoyoData.category.trim() !== newYoyoData.category.trim() ||
			originalYoyoData.responseType.trim() !==
				newYoyoData.responseType.trim() ||
			originalYoyoData.condition.trim() !== newYoyoData.condition.trim() ||
			originalYoyoData.value.trim() !== newYoyoData.value.trim();
		setDirty(isDirty);
		isDirty ? setDirtyType('yoyo') : setDirtyType(null);
	}, [originalYoyoData, newYoyoData]);

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
	const specialsAllowed = ['value', 'price', 'condition'];

	const getInvalidChars = (name, input) => {
		const noSpecialsTest = /[^a-zA-Z0-9 \-./?!']/g;
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
		e.stopPropagation();
		const { name, value } = e.target;

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

	const handleUndo = (item, name) => {
		console.log(inputs[item]);

		setNewYoyoData((prev) => ({
			...prev,
			[item]: originalYoyoData[item],
		}));

		!inputs[item].error.valid &&
			setInputs((prev) => ({
				...prev,
				[item]: {
					...prev[item],
					error: { valid: true, message: '' },
				},
			}));
	};

	const loadingComplete = useMemo(() => {
		return (
			originalYoyoData !== undefined &&
			newYoyoData !== undefined &&
			inputs &&
			Object.keys(inputs).length > 0
		);
	}, [inputs, originalYoyoData, newYoyoData]);

	if (!loadingComplete) return <BlankEditableYoyoTile />;

	return (
		<div className={styles.tile}>
			<div className={styles['image-box']}>
				{photos.length > 0 && <YoyoPhotoScroller photos={photos} />}
				<div
					className={`${styles.image} ${
						photos.length > 0 ? styles.hidden : ''
					}`}
				>
					<PictureUploader
						collection={collectionId}
						key='yoyo'
						uploadType='yoyo'
						input='yoyoInput'
						setAdded={setAdded}
						setUploadError={setUploadError}
						clearInputRef={clearInputRef}
						setClearInputRef={setClearInputRef}
					/>
				</div>
			</div>
			<div className={styles['content-box']}>
				<div className={styles.details}>
					<>
						<div className={styles.left}>
							{Object.entries(inputs).map(([key, item]) => {
								if (item.position === 'left') {
									return (
										<React.Fragment key={id + item.name}>
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
												id={id}
												onStartEditing={() =>
													setCurrentlyEditing(`${id}-${item.label}`)
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
										<React.Fragment key={id + item.name}>
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
												id={id}
												onStartEditing={() =>
													setCurrentlyEditing(`${id}-${item.label}`)
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
							<div className={styles['photo-input']}>
								<label htmlFor='yoyoInput' className={styles.label}>
									Add Photos
								</label>
							</div>
						</div>
					</>
				</div>

				<div className={styles.about}>
					<div className={styles.attribute}>
						<label className={styles.label} htmlFor='condition'>
							Condition/Additional Notes:
						</label>
						{!editCondition ? (
							<div
								className={styles.p}
								onClick={(e) => {
									e.stopPropagation();
									setEditCondition(true);
								}}
							>
								{newYoyoData.condition}
								<Edit
									className={styles.icon}
									style={{
										cursor: 'pointer',
									}}
								/>
								{newYoyoData.condition !== originalYoyoData.condition && (
									<Undo
										onClick={(e) => {
											e.stopPropagation();
											handleUndo('condition');
										}}
										className={styles.undo}
									/>
								)}
							</div>
						) : (
							<>
								<div className={styles['textarea-box']}>
									<textarea
										className={styles.textarea}
										name='condition'
										id='condition'
										maxLength={300}
										rows='3'
										placeholder="This yoyo is worth at least a thousand bucks, Janice. Don't let anyone convince you otherwise. If I pass on and I see the kids sell it for anything less..."
										value={newYoyoData.condition || ''}
										onChange={handleChange}
										onClick={(e) => e.stopPropagation()}
									/>
									<Check
										className={styles.check}
										onClick={(e) => {
											e.stopPropagation();
											if (!inputs.condition.error.valid) return;
											setEditCondition(false);
										}}
									/>
									<Close
										className={styles.close}
										onClick={(e) => {
											e.stopPropagation();
											setEditCondition(false);
											handleUndo('condition');
											setInputs((prev) => ({
												...prev,
												condition: {
													...prev.condition,
													error: {
														valid: true,
														message: '',
													},
												},
											}));
										}}
									/>
								</div>
								{!inputs.condition.error.valid && (
									<p className={styles.error}>
										{inputs.condition.error.message}
									</p>
								)}
							</>
						)}
					</div>
				</div>
			</div>
			<div
				className={styles['close-tile']}
				onClick={() => {
					if (dirty) {
						setModalOpen(true);
						setModalType('dirty');
						return;
					}
					setSelectedYoyo(null);
				}}
			>
				<Close className={styles.close} />
			</div>
		</div>
	);
}

export default EditableYoyoTile;
