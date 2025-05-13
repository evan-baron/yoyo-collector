const customInputSelectStyles = {
	container: (styles) => ({
		...styles,
		padding: '0px',
		margin: '0px',
		minWidth: '10rem',
	}),

	// Control (the outer container of the select box)
	control: (styles) => ({
		...styles,
		backgroundColor: '#454545',
		border: 'none',
		borderRadius: 'none',
		fontSize: '1.125rem',
		maxHeight: '2rem',
		minHeight: '2rem',
		boxShadow: 'none',
		'&:hover': {
			borderColor: 'transparent',
		},
		display: 'flex',
		alignItems: 'center',
		padding: '0px',
		margin: '0px',
		boxSizing: 'border-box',
	}),

	// Menu (the dropdown menu that appears when clicking the control)
	menu: (styles) => ({
		...styles,
		backgroundColor: '#454545',
		borderRadius: 'none',
		zIndex: '9999',
		margin: '0px',
	}),

	// MenuList (the list of options inside the dropdown)
	menuList: (styles) => ({
		...styles,
		overflowY: 'auto',
		backgroundColor: '#454545',
		// Custom scrollbar styles
		scrollbarWidth: '1rem',
		scrollbarColor: '#757575 #373737',
	}),

	// Option (each item in the dropdown)
	option: (styles, { isSelected, isFocused }) => ({
		...styles,
		backgroundColor: isSelected
			? 'rgba(0, 225, 225, .75)'
			: isFocused
			? '#525252'
			: '#454545',
		color: isSelected ? '#eeeeee' : '#eeeeee',
		padding: '0.25rem .5rem',
		cursor: 'pointer',
		'&:hover': {
			backgroundColor: '#525252',
		},
		fontSize: '1.25rem',
		minHeight: '1.75rem',
	}),

	// Placeholder (when no option is selected)
	placeholder: (styles) => ({
		...styles,
		color: '#aaaaaa',
		position: 'absolute',
		display: 'none',
	}),

	// SingleValue (the selected value in the control)
	singleValue: (styles) => ({
		...styles,
		color: '#eeeeee',
	}),

	// ValueContainer (the container holding the selected value)
	valueContainer: (styles) => ({
		...styles,
		display: 'flex',
		alignItems: 'center',
		padding: '0px .25rem',
		margin: '0px',
		flex: 1,
		height: '100%',
	}),

	// Targeting the div containing the selected value to remove padding
	singleValueContainer: (styles) => ({
		...styles,
		padding: '0px',
		margin: '0px',
	}),

	// Targeting the input element to remove any margin or padding
	input: (styles) => ({
		...styles,
		margin: '0px',
		padding: '0px .25rem',
		color: '#eeeeee',
	}),

	// Indicator (the dropdown indicator, e.g. the arrow)
	indicatorSeparator: (styles) => ({
		...styles,
		display: 'auto',
		backgroundColor: '#696969',
		width: '2px',
		padding: '0px',
		margin: '4px 0px',
	}),

	dropdownIndicator: (styles) => ({
		...styles,
		color: '#696969',
		'&:hover': {
			color: '#696969',
		},
		padding: '0px 8px',
	}),

	clearIndicator: (styles, { isFocused }) => ({
		...styles,
		'&:hover': {
			color: '#eeeeee',
		},
		padding: '0px 8px',
	}),
};

export default customInputSelectStyles;
