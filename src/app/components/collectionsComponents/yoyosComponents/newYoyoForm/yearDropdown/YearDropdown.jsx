// Libraries
import React from 'react';
import Select from 'react-select';

// Styles
import customFormSelectStyles from '../customFormSelectStyles';
import customInputSelectStyles from '../customInputSelectStyles';

function YearDropdown({ type, disabled, value, handleChange, name }) {
	const startYear = 1950;
	const endYear = new Date().getFullYear();

	const years = Array.from(
		{ length: endYear - startYear + 1 },
		(_, i) => startYear + i
	)
		.sort((a, b) => b - a)
		.map((year) => ({
			value: year,
			label: year === '' ? 'Select year' : String(year),
			name: name,
		}));

	return (
		<Select
			options={years}
			value={years.find((year) => year.value === value)}
			onChange={(selectedOption) => handleChange(selectedOption, { name })}
			placeholder='Select year...'
			menuPlacement='bottom'
			menuShouldScrollIntoView={false}
			styles={
				type === 'yoyoForm' ? customFormSelectStyles : customInputSelectStyles
			}
			isClearable
			isDisabled={disabled}
		/>
	);
}

export default YearDropdown;
