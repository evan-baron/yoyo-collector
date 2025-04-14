'use client';

// Libraries
import React from 'react';

// MUI Icons
import { Check } from '@mui/icons-material';

// Styles
import styles from './passwordValidation.module.scss';

const PasswordValidation = ({ passwordReqs }) => {
	return (
		<div className={styles['password-requirements']}>
			<p className={styles['requirements-description']}>
				Your password must contain:
			</p>
			<div className={styles.requirement}>
				{passwordReqs.length && (
					<Check
						sx={{
							fontSize: 'small',
							color: 'rgb(0, 200, 0)',
						}}
					/>
				)}
				<p>8 characters</p>
			</div>
			<div className={styles.requirement}>
				{passwordReqs.uppercase && (
					<Check
						sx={{
							fontSize: 'small',
							color: 'rgb(0, 200, 0)',
						}}
					/>
				)}
				<p>1 uppercase</p>
			</div>
			<div className={styles.requirement}>
				{passwordReqs.number && (
					<Check
						sx={{
							fontSize: 'small',
							color: 'rgb(0, 200, 0)',
						}}
					/>
				)}
				<p>1 number</p>
			</div>
			<div className={styles.requirement}>
				{passwordReqs.character && (
					<Check
						sx={{
							fontSize: 'small',
							color: 'rgb(0, 200, 0)',
						}}
					/>
				)}
				<p>
					1 special character<span>&nbsp;</span>
					<span className={styles.span}>(e.g. $, !, @, %, &)</span>
				</p>
			</div>
		</div>
	);
};

export default PasswordValidation;
