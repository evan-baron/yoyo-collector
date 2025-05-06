'use client';

// Libraries
import React, { useState } from 'react';

// Styles
import styles from './share.module.scss';

// MUI
import { Close, ContentCopy } from '@mui/icons-material';

// Context
import { useAppContext } from '@/app/context/AppContext';

function Share() {
	const { setModalOpen, shareLink, setShareLink } = useAppContext();

	const [copied, setCopied] = useState(null);

	const handleCopy = () => {
		navigator.clipboard
			.writeText(shareLink)
			.then(() => {
				setCopied(true);
			})
			.catch((err) => {
				console.error('Failed to copy: ', err);
			});
	};

	return (
		<div className={styles.container}>
			<div className={styles.link}>
				<ContentCopy
					sx={{ fontSize: 30 }}
					className={styles.icon}
					onClick={handleCopy}
				/>
				<textarea
					className={styles.textarea}
					value={shareLink}
					readOnly
					rows={'1'}
				/>
			</div>
			<div
				className={styles.close}
				onClick={() => {
					setShareLink(null);
					setModalOpen(false);
				}}
			>
				<Close sx={{ fontSize: 30 }} />
				Close
			</div>
		</div>
	);
}

export default Share;
