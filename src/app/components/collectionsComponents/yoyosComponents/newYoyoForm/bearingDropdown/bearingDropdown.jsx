// Libraries
import React from 'react';
import Select from 'react-select';

// Styles
import customSelectStyles from '../customSelectStyles';

function BearingDropdown({ disabled, value, handleChange, name }) {
	const response = ['A', 'C', 'D', 'Other'];

	const options = response.map((option) => ({
		value: option.toString(),
		label: option.toString(),
		name: name,
	}));

	return (
		<Select
			options={options}
			value={options.find((option) => option.value === value)}
			onChange={handleChange}
			placeholder='Select bearing type...'
			menuPlacement='bottom'
			menuShouldScrollIntoView={false}
			styles={customSelectStyles}
			name={name}
			isClearable
			isDisabled={disabled}
		/>
	);
}

export default BearingDropdown;
