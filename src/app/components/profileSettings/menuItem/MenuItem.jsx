import React from 'react';

// Styles
import styles from './menuItem.module.scss';

function MenuItem({ name, isSelected, handleChange }) {
	return (
		<>
			<li
				data-name={name.toLowerCase()}
				className={`${styles.li} ${isSelected ? styles.highlighted : ''}`}
				onClick={handleChange}
			>
				{name === 'Password' ? 'Password & Security' : `${name} Settings`}
			</li>
		</>
	);
}

export default MenuItem;
