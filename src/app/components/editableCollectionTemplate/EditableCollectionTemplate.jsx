'use client';

// Libraries
import React, { useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';

// Styles
import styles from './editableCollectionTemplate.module.scss';

// MUI
import { Edit, Save } from '@mui/icons-material';

// Components
import BlankCoverPhoto from '../blankCoverPhoto/BlankCoverPhoto';
import PictureUploader from '../pictureUploader/PictureUploader';

function EditableCollectionTemplate({ collection }) {
	const { id, collection_name, collection_description, likes, created_at } =
		collection;
	const created = dayjs(created_at).format('MMMM, D, YYYY');

	const [editing, setEditing] = useState(false);
	const [currentlyEditing, setCurrentlyEditing] = useState({
		collectionName: false,
		description: false,
		coverPhoto: false,
	});

	return (
		<div className={styles['collection-container']}>
			<div className={styles.title}>
				<div className={styles['collection-name-box']}>
					{currentlyEditing.collectionName ? (
						''
					) : (
						<>
							<h1
								className={styles.h1}
								style={{ cursor: editing ? 'pointer' : '' }}
							>
								{collection_name}
							</h1>
							{editing && <Edit className={styles['name-edit-icon']} />}
						</>
					)}
				</div>
				<div className={styles.details}>
					<h3 className={styles.h3}>Created {created}</h3>
					<p className={styles.likes}>
						<svg viewBox='0 0 24 24' className={styles.heart}>
							<defs>
								<linearGradient
									id='quoteGradient'
									x1='0%'
									y1='0%'
									x2='100%'
									y2='100%'
								>
									<stop offset='0%' stopColor='#ff00ff' />
									<stop offset='90%' stopColor='#00e1ff' />
								</linearGradient>
							</defs>
							<path
								d='m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z'
								fill='url(#quoteGradient)'
							/>
						</svg>
						{likes ? likes : '69'} likes
					</p>
				</div>
				{currentlyEditing.description ? (
					''
				) : (
					<p
						className={styles.description}
						style={{ cursor: editing ? 'pointer' : '' }}
					>
						<span>
							{collection_description
								? collection_description
								: 'This is a sample description. This collection only contains solid gold and platinum yoyos. All of which are worth millions.'}
						</span>
						{editing ? (
							<Edit
								sx={{
									position: 'relative',
									top: !collection_description?.length ? '.125rem' : '', // DON'T FORGET TO REMOVE THE ! FROM THE START WHEN READY
									fontSize: !collection_description?.length ? '1rem' : '1.5rem', // DON'T FORGET TO REMOVE THE ! FROM THE START WHEN READY
									cursor: 'pointer',
									marginLeft: '.25rem',
								}}
							/>
						) : (
							''
						)}
					</p>
				)}
			</div>
			<div className={styles.collection}>
				<section className={styles['photos-container']}>
					<div className={styles.left}>
						<h2 className={styles.h2}>Cover Photo</h2>
						<div className={styles.cover}>
							{editing ? (
								<PictureUploader uploadType='cover' />
							) : (
								<BlankCoverPhoto />
							)}
						</div>
					</div>
					<div className={styles.right}>
						<h2 className={styles.h2}>Collection Photos</h2>
						<div className={styles.photos}>
							<div className={styles.grid}>
								<div className={styles.photo}></div>
								<div className={styles.photo}></div>
								<div className={styles.photo}></div>
								<div className={styles.photo}></div>
							</div>
						</div>
					</div>
				</section>
				<section className={styles['yoyos-container']}>
					<h2 className={styles.h2}>Yoyos</h2>
					<div className={styles.sort}>
						<div className={styles.style}>Photos Only</div>
						<div className={styles.style}>Details Only</div>
						<div className={styles.style}>Photos and Details</div>
					</div>
					<div className={styles.yoyos}>
						<div className={styles.tile}>
							(This will be its own component called YoyoTile)
						</div>
						<div className={styles.tile}>
							(This will be its own component called YoyoTile)
						</div>
						<div className={styles.tile}>
							(This will be its own component called YoyoTile)
						</div>
						<div className={styles.tile}>
							(This will be its own component called YoyoTile)
						</div>
					</div>
				</section>
			</div>
			<button
				className={styles['settings-box']}
				onClick={() => setEditing((prev) => !prev)}
			>
				{editing ? (
					<Save className={styles['settings-icon']} />
				) : (
					<Edit className={styles['settings-icon']} />
				)}
				<p className={styles.settings}>
					{editing ? 'Save Changes' : 'Edit Collection'}
				</p>
			</button>
		</div>
	);
}

export default EditableCollectionTemplate;
