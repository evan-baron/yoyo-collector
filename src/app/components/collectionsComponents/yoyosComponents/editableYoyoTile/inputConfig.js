export function getInitialInputs({
	model,
	brand,
	colorway,
	category,
	releaseYear,
	responseType,
	bearing,
	originalOwner,
	purchaseYear,
	purchasePrice,
	value,
}) {
	return {
		model: {
			name: 'model',
			label: 'Model',
			value: model,
			maxLength: '50',
			position: 'left',
			regex: 'noSpecials',
			error: {
				valid: true,
				message: '',
			},
			input: {
				type: 'input',
				inputType: 'text',
			},
		},
		brand: {
			name: 'brand',
			label: 'Brand',
			value: brand,
			maxLength: '50',
			position: 'left',
			regex: 'noSpecials',
			error: {
				valid: true,
				message: '',
			},
			input: {
				type: 'dropdown',
			},
		},
		colorway: {
			name: 'colorway',
			label: 'Colorway',
			value: colorway,
			maxLength: '50',
			position: 'left',
			regex: 'noSpecials',
			error: {
				valid: true,
				message: '',
			},
			input: {
				type: 'input',
				inputType: 'text',
			},
		},
		category: {
			name: 'category',
			label: 'Category',
			value: category,
			maxLength: '60',
			position: 'left',
			regex: 'noSpecials',
			error: {
				valid: true,
				message: '',
			},
			input: {
				type: 'input',
				inputType: 'text',
			},
		},
		releaseYear: {
			name: 'releaseYear',
			label: 'Released',
			value: releaseYear,
			maxLength: '4',
			position: 'left',
			regex: 'onlyNums',
			error: {
				valid: true,
				message: '',
			},
			input: {
				type: 'dropdown',
			},
		},
		responseType: {
			name: 'responseType',
			label: 'Response',
			value: responseType,
			maxLength: '20',
			position: 'left',
			regex: 'noSpecials',
			error: {
				valid: true,
				message: '',
			},
			input: {
				type: 'dropdown',
			},
		},
		bearing: {
			name: 'bearing',
			label: 'Bearing',
			value: bearing,
			maxLength: '20',
			position: 'left',
			regex: 'noSpecials',
			error: {
				valid: true,
				message: '',
			},
			input: {
				type: 'dropdown',
			},
		},
		originalOwner: {
			name: 'originalOwner',
			label: 'Original owner',
			value: originalOwner,
			maxLength: '',
			position: 'right',
			regex: '',
			error: {
				valid: true,
				message: '',
			},
			input: {
				type: 'input',
				inputType: 'radio',
			},
		},
		purchaseYear: {
			name: 'purchaseYear',
			label: 'Purchased',
			value: purchaseYear,
			maxLength: '4',
			position: 'right',
			regex: 'onlyNums',
			error: {
				valid: true,
				message: '',
			},
			input: {
				type: 'dropdown',
			},
		},
		purchasePrice: {
			name: 'purchasePrice',
			label: 'Purchase price',
			value: purchasePrice,
			maxLength: '100',
			position: 'right',
			regex: 'specialsAllowed',
			error: {
				valid: true,
				message: '',
			},
			input: {
				type: 'input',
				inputType: 'text',
			},
		},
		value: {
			name: 'value',
			label: 'Approximate value',
			value: value,
			maxLength: '20',
			position: 'right',
			regex: 'specialsAllowed',
			error: {
				valid: true,
				message: '',
			},
			input: {
				type: 'input',
				inputType: 'text',
			},
		},
	};
}
