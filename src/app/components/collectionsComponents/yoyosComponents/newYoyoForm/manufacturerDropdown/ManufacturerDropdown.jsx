// Libraries
import React from 'react';
import CreatableSelect from 'react-select/creatable';

// Utils
import { yoyoBrands } from '../yoyoBrands';

// Styles
import customSelectStyles from '../customSelectStyles';

function ManufacturerDropdown({ value, handleChange }) {
	const options = [' '].concat(yoyoBrands).map((brand) => ({
		value: brand.toString(),
		label: brand.toString(),
		name: 'manufacturer',
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
			isClearable
		/>
	);
}

export default ManufacturerDropdown;
