// Libraries
import React from 'react';
import CreatableSelect from 'react-select/creatable';

// Utils
import { yoyoBrands } from '../yoyoBrands';

// Styles
import customSelectStyles from '../customSelectStyles';

function ManufacturerDropdown({ value, handleChange, name }) {
	const options = yoyoBrands.map((brand) => ({
		value: brand.toString(),
		label: brand.toString(),
		name: name,
	}));

	return (
		<CreatableSelect
			options={options}
			value={options.find((option) => option.value === value)}
			onChange={handleChange}
			placeholder='Select manufacturer...'
			menuPlacement='bottom'
			menuShouldScrollIntoView={false}
			styles={customSelectStyles}
			name={name}
			isClearable
		/>
	);
}

export default ManufacturerDropdown;
