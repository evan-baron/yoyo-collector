// Libraries
import React from 'react';

// MUI
import { Edit } from '@mui/icons-material';

// Styles
import styles from './blankEditableYoyoTile.module.scss';

// Components
import Heart from '@/app/components/icons/heart/Heart';
import BlankYoyoPhoto from '@/app/components/blankYoyoPhoto/BlankYoyoPhoto';

function BlankEditableYoyoTile() {
	return (
		<div className={`${styles.tile} ${styles.selected}`}>
			<input type='checkbox' className={styles.checkbox} />

			<div className={styles['image-box']}>
				<div className={styles.image}>
					<BlankYoyoPhoto />
				</div>
				<div className={styles.likes}>
					<Heart size='small' likes={0} />
				</div>
			</div>
			<div className={styles['content-box']}>
				<div className={styles.details}>
					<div className={styles.left}>
						<div className={styles.attribute}>
							<div className={styles.label} style={{ marginRight: '.25rem' }}>
								Model:
							</div>
							<Edit className={styles.icon} />
						</div>
						<div className={styles.attribute}>
							<div className={styles.label} style={{ marginRight: '.25rem' }}>
								Brand:
							</div>
							<Edit className={styles.icon} />
						</div>
						<div className={styles.attribute}>
							<div className={styles.label} style={{ marginRight: '.25rem' }}>
								Colorway:
							</div>
							<Edit className={styles.icon} />
						</div>
						<div className={styles.attribute}>
							<div className={styles.label} style={{ marginRight: '.25rem' }}>
								Category/Material:
							</div>
							<Edit className={styles.icon} />
						</div>
						<div className={styles.attribute}>
							<div className={styles.label} style={{ marginRight: '.25rem' }}>
								Released:
							</div>
							<Edit className={styles.icon} />
						</div>
						<div className={styles.attribute}>
							<div className={styles.label} style={{ marginRight: '.25rem' }}>
								Response:
							</div>
							<Edit className={styles.icon} />
						</div>
						<div className={styles.attribute}>
							<div className={styles.label} style={{ marginRight: '.25rem' }}>
								Bearing:
							</div>
							<Edit className={styles.icon} />
						</div>
					</div>
					<div className={styles.right}>
						<div className={styles.attribute}>
							<div className={styles.label} style={{ marginRight: '.25rem' }}>
								Original owner:
							</div>
							<div className={styles.options}>
								<div className={styles.option}>
									<input type='radio' className={styles.radio} />
									<label className={styles.label}>Yes</label>
								</div>
								<div className={styles.option}>
									<input type='radio' className={styles.radio} />
									<label className={styles.label}>No</label>
								</div>
							</div>
						</div>
						<div className={styles.attribute}>
							<div className={styles.label} style={{ marginRight: '.25rem' }}>
								Purchased:
							</div>
							<Edit className={styles.icon} />
						</div>
						<div className={styles.attribute}>
							<div className={styles.label} style={{ marginRight: '.25rem' }}>
								Purchase price:
							</div>
							<Edit className={styles.icon} />
						</div>
						<div className={styles.attribute}>
							<div className={styles.label} style={{ marginRight: '.25rem' }}>
								Approximate value:
							</div>
							<Edit className={styles.icon} />
						</div>
					</div>
				</div>
				<div className={styles.about}>
					<div className={styles.attribute}>
						<label className={styles.label} htmlFor='condition'>
							About the yoyo:
						</label>
						<p>
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

export default BlankEditableYoyoTile;
