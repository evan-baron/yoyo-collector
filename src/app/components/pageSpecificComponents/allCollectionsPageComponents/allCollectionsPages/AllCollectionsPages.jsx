'use client';

// Libraries
import React, { useState, useEffect, useRef } from 'react';

// Utils
import axiosInstance from '@/lib/utils/axios';
import arraySplitter from '@/lib/helpers/arraySplitter';

// Components
import LoadingSpinner from '@/app/components/loading/LoadingSpinner';

// MUI
import {
	KeyboardArrowLeft,
	KeyboardArrowRight,
	KeyboardDoubleArrowLeft,
	KeyboardDoubleArrowRight,
} from '@mui/icons-material';

// Styles
import styles from './allCollectionsPages.module.scss';

function AllCollectionsPages() {
	const [sortType, setSortType] = useState('descending'); // can only be 'ascending', 'descending', or 'likes'
	const [pages, setPages] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [editingPage, setEditingPage] = useState(false);
	const [inputValue, setInputValue] = useState('');

	const inputRef = useRef(null);
	const lastCommittedValueRef = useRef(inputValue);

	useEffect(() => {
		const fetchCollections = async () => {
			const collectionsData = await axiosInstance.get(
				`/api/user/collections?sortType=${sortType}`
			);

			setPages(arraySplitter(collectionsData.data, 20));
		};
		fetchCollections();
	}, [sortType]);

	useEffect(() => {
		inputRef.current?.focus();
	}, [editingPage]);

	useEffect(() => {
		function handleClickOutside(event) {
			if (inputRef.current && !inputRef.current.contains(event.target)) {
				const num = Number(inputValue);
				if (!inputValue || num < 1 || num > pages.length) {
					setCurrentPage(lastCommittedValueRef.current);
				} else {
					setCurrentPage(num - 1);
				}
				setEditingPage(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [inputValue]);

	const handleSort = (e) => {
		const { name } = e.target.dataset;
		setSortType(name);
	};

	const loadingComplete = pages.length > 0;

	if (!loadingComplete) return <LoadingSpinner message='Loading' />;

	return (
		<div className={styles.container}>
			<h2 className={styles.h2}>All Collections</h2>
			<div className={styles.legend}>
				<ul className={styles.ul}>
					<li
						data-name='descending'
						className={`${styles.sort} ${styles.name} ${
							sortType === 'descending' && styles.selected
						}`}
						onClick={handleSort}
					>
						Newest
					</li>
					<li
						data-name='ascending'
						className={`${styles.sort} ${styles.name} ${
							sortType === 'ascending' && styles.selected
						}`}
						onClick={handleSort}
					>
						Oldest
					</li>
					<li
						data-name='likes'
						className={`${styles.sort} ${styles.name} ${
							sortType === 'likes' && styles.selected
						}`}
						onClick={handleSort}
					>
						Most Popular
					</li>
				</ul>
			</div>
			<div className={styles['page-selector']}>
				{currentPage > 0 && (
					<div className={styles['icons-left']}>
						<KeyboardDoubleArrowLeft
							className={styles.icon}
							onClick={() => setCurrentPage(0)}
						/>
						<KeyboardArrowLeft
							className={styles.icon}
							onClick={() => {
								setCurrentPage((prev) => prev - 1);
							}}
						/>
					</div>
				)}
				<div
					className={`${styles['page-box']} ${
						editingPage && styles['input-active']
					}`}
				>
					<div className={styles.pages} onClick={() => setEditingPage(true)}>
						{!editingPage ? (
							currentPage + 1
						) : (
							<input
								type='text'
								className={styles.input}
								ref={inputRef}
								value={inputValue}
								onFocus={() => {
									lastCommittedValueRef.current = currentPage;
									setInputValue('');
								}}
								onBlur={() => {
									if (inputValue === '') {
										setInputValue(lastCommittedValueRef.current.toString());
									}
								}}
								onChange={(e) => {
									const value = e.target.value;
									if (/^\d*$/.test(value)) {
										const num = Number(value);
										if (num >= 1 && num <= pages.length) {
											setInputValue(value);
										} else if (value === '') {
											setInputValue(''); // allow empty for user to edit
										}
									}
								}}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === 'Tab') {
										const num = Number(inputValue);
										if (!inputValue || num < 1 || num > pages.length) {
											setCurrentPage(lastCommittedValueRef.current);
										} else {
											setCurrentPage(num - 1);
										}
										setEditingPage(false);
									}
								}}
							/>
						)}{' '}
						/ {pages.length}
					</div>
				</div>
				{currentPage < pages.length - 1 && (
					<div className={styles['icons-right']}>
						<KeyboardArrowRight
							className={styles.icon}
							onClick={() => {
								setCurrentPage((prev) => prev + 1);
							}}
						/>
						<KeyboardDoubleArrowRight
							className={styles.icon}
							onClick={() => setCurrentPage(pages.length - 1)}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default AllCollectionsPages;
