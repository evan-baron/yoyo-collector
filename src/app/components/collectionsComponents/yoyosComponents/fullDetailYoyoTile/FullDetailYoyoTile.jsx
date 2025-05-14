// Libraries
import React from 'react';

// Styles
import styles from './fullDetailYoyoTile.module.scss';

// MUI
import { Edit } from '@mui/icons-material';

// Components
import BlankYoyoPhoto from '@/app/components/blankYoyoPhoto/BlankYoyoPhoto';
import Heart from '@/app/components/icons/heart/Heart';

const FullDetailYoyoTile = ({
	selectedTile,
	setSelectedYoyo,
	handleSelect,
	likes,
	validLeftItems = [],
	validRightItems = [],
	condition,
	setEditing,
	yoyoId,
}) => {
	return (
		<div
			className={`${styles.tile} ${selectedTile ? styles.selected : ''}`}
			onClick={handleSelect}
		>
			<div className={styles['image-box']}>
				<div className={styles.image}>
					<BlankYoyoPhoto />
				</div>
				<div className={styles.likes}>
					<Heart size='small' likes={likes} />
					{likes > 0 && (
						<>
							{likes} {likes === 1 ? 'like' : 'likes'}
						</>
					)}
				</div>
			</div>

			<div className={styles['content-box']}>
				<div className={styles.details}>
					{validLeftItems.length > 0 && (
						<div className={styles.left}>
							{validLeftItems.map(([label, value], index) => (
								<div key={index} className={styles.attribute}>
									<label className={styles.label} htmlFor={value}>
										{label}:
									</label>
									<p>{value}</p>
								</div>
							))}
						</div>
					)}

					{validRightItems.length > 0 && (
						<div className={styles.right}>
							{validRightItems.map(([label, value], index) => {
								let displayValue = value;
								if (label === 'Original owner') {
									displayValue =
										String(value) === '0'
											? 'No'
											: String(value) === '1'
											? 'Yes'
											: '';
								}

								return (
									<div key={index} className={styles.attribute}>
										<label className={styles.label} htmlFor={value}>
											{label}:
										</label>
										<p>{displayValue}</p>
									</div>
								);
							})}
						</div>
					)}
				</div>

				{condition && (
					<div className={styles.about}>
						<div className={styles.attribute}>
							<label className={styles.label} htmlFor='condition'>
								About the yoyo:
							</label>
							<p className={styles.p}>{condition}</p>
						</div>
					</div>
				)}

				<Edit
					className={styles.edit}
					onClick={(e) => {
						setEditing(true);
						!selectedTile && setSelectedYoyo(yoyoId);
					}}
				/>
				{/* Optional: Only show edit if current user owns this yoyo */}
			</div>
		</div>
	);
};

export default FullDetailYoyoTile;
