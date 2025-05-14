// Libraries
import React, { forwardRef } from 'react';
import Select from 'react-select';

// Styles
import customFormSelectStyles from '../customFormSelectStyles';
import customInputSelectStyles from '../customInputSelectStyles';

const BearingDropdown = forwardRef(function BearingDropdown(
	{ type, disabled, value, handleChange, name },
	ref
) {
	const response = ['A', 'C', 'D', 'Other'];

	const options = response.map((option) => ({
		value: option.toString(),
		label: option.toString(),
		name: name,
	}));

	return (
		<Select
			ref={ref}
			options={options}
			value={options.find((option) => option.value === value)}
			onChange={handleChange}
			placeholder='Select bearing type...'
			menuPlacement='bottom'
			menuShouldScrollIntoView={false}
			styles={
				type === 'yoyoForm' ? customFormSelectStyles : customInputSelectStyles
			}
			name={name}
			isClearable
			isDisabled={disabled}
		/>
	);
});

export default BearingDropdown;
