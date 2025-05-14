// Libraries
import React, { forwardRef } from 'react';
import CreatableSelect from 'react-select/creatable';
import { components } from 'react-select';

// Utils
import { yoyoBrands } from '../yoyoBrands';

// Styles
import customFormSelectStyles from '../customFormSelectStyles';
import customInputSelectStyles from '../customInputSelectStyles';

const ManufacturerDropdown = forwardRef(function ManufacturerDropdown(
	{ type, value, handleChange, name },
	ref
) {
	const options = yoyoBrands.map((brand) => ({
		value: brand.toString(),
		label: brand.toString(),
		name: name,
	}));

	const CustomInput = (props) => <components.Input {...props} maxLength={50} />;

	return (
		<CreatableSelect
			ref={ref}
			components={{ Input: CustomInput }}
			options={options}
			value={value ? { label: value, value } : null}
			onChange={handleChange}
			placeholder='Select brand...'
			menuPlacement='bottom'
			menuShouldScrollIntoView={false}
			styles={
				type === 'yoyoForm' ? customFormSelectStyles : customInputSelectStyles
			}
			name={name}
			isClearable
		/>
	);
});

export default ManufacturerDropdown;
