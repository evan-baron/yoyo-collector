// Libraries
import React from 'react';
import Select from 'react-select';

// Styles
import customSelectStyles from '../customSelectStyles';

function ResponseDropdown({ value, handleChange }) {
	const response = ['Fixed', 'Responsive', 'Unresponsive'];

	const options = response.map((option) => ({
		value: option.toString(),
		label: option,
		name: 'response',
	}));

	return (
		<Select
			options={options}
			value={options.find((option) => option.value === value)}
			onChange={handleChange}
			placeholder='Select response type...'
			menuPlacement='bottom'
			menuShouldScrollIntoView={false}
			styles={customSelectStyles}
		/>
	);
}

export default ResponseDropdown;
