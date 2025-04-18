// Libraries
import React, { useState, useEffect, useRef, useMemo } from 'react';

// Styles
import styles from './dropdownSelector.module.scss';

function DropdownSelector({
	name,
	value,
	list,
	locationFormData,
	setLocationFormData,
}) {
	const [isFocused, setIsFocused] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const [isUsingKeyboard, setIsUsingKeyboard] = useState(false);

	const inputRef = useRef();
	const dropdownRef = useRef();
	const optionRefs = useRef([]);

	optionRefs.current = [];

	const onClickOutside = () => {
		setIsFocused(false);
	};

	useEffect(() => {
		if (highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
			optionRefs.current[highlightedIndex].scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
			});
		}
	}, [highlightedIndex]);

	useEffect(() => {
		const handleMouseMove = () => {
			setIsUsingKeyboard(false);
		};
		window.addEventListener('mousemove', handleMouseMove);
		return () => window.removeEventListener('mousemove', handleMouseMove);
	}, []);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				onClickOutside();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [onClickOutside]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setLocationFormData({
			...locationFormData,
			[name]: value,
		});
	};

	return (
		<form autoComplete='off'>
			<label htmlFor={name} className={styles.label}>
				{name}:
			</label>
			<input
				type='text'
				name={name.toLowerCase()}
				id={name.toLowerCase()}
				value={value}
				className={styles.input}
				autoComplete='off'
				placeholder={`Select ${name}`}
				ref={inputRef}
				onChange={handleChange}
				onFocus={() => setIsFocused(true)}
				onKeyDown={(e) => {
					if (!isFocused) setIsFocused(true);

					setIsUsingKeyboard(true);

					if (e.key === 'ArrowDown') {
						e.preventDefault();
						setHighlightedIndex((prev) => Math.min(prev + 1, list.length - 1));
					} else if (e.key === 'ArrowUp') {
						e.preventDefault();
						setHighlightedIndex((prev) => Math.max(prev - 1, 0));
					} else if (e.key === 'Tab') {
						e.preventDefault();
						setHighlightedIndex((prev) => Math.min(prev + 1, list.length - 1));
						if (highlightedIndex < 0 && !isFocused) {
							inputRef.current?.blur();
						}
					} else if (e.key === 'Enter') {
						e.preventDefault();
						if (highlightedIndex >= 0 && highlightedIndex < list.length) {
							setLocationFormData({
								...locationFormData,
								[name.toLowerCase()]: list[highlightedIndex],
							});
							setIsFocused(false);
							setHighlightedIndex(-1);
							inputRef.current?.blur();
						}
						if (highlightedIndex < 0) {
							inputRef.current?.blur();
						}
					}
				}}
			/>
			{value && isFocused && (
				<div className={styles.dropdown} ref={dropdownRef}>
					{list.map((item, index) => (
						<div
							key={index}
							ref={(option) => (optionRefs.current[index] = option)}
							className={`${styles.option} ${
								highlightedIndex === index ? styles.highlighted : ''
							}`}
							onMouseOver={() => {
								if (!isUsingKeyboard) {
									setHighlightedIndex(index);
								}
							}}
							onClick={() => {
								setLocationFormData({
									...locationFormData,
									[name.toLowerCase()]: item,
								});
								setIsFocused(false);
							}}
						>
							{item}
						</div>
					))}
				</div>
			)}
		</form>
	);
}

export default DropdownSelector;
