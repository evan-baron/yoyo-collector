// Libraries
import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { components } from 'react-select';

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

	const CustomInput = (props) => <components.Input {...props} maxLength={50} />;

	return (
		<CreatableSelect
			components={{ Input: CustomInput }}
			options={options}
			value={options.find((option) => option.value === value) || null}
			onChange={handleChange}
			placeholder='Select brand...'
			menuPlacement='bottom'
			menuShouldScrollIntoView={false}
			styles={customSelectStyles}
			name={name}
			isClearable
		/>
	);
}

export default ManufacturerDropdown;
