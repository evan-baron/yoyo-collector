// src/helpers/validation.js

// Constants
const names = ['first', 'last'];
const handleYoyoBrandKeys = ['handle', 'yoyo', 'brand'];
const locationKeys = ['country', 'state', 'city'];
const privacyValues = ['public', 'anonymous', 'private'];
const nullAllowed = [
	'handle',
	'yoyo',
	'brand',
	'city',
	'state',
	'country',
	'description',
];

// Warning messages
export const warningMessage = {
	first: 'No special characters or numbers allowed',
	last: 'No special characters or numbers allowed',
	handle: 'No special characters allowed',
	yoyo: 'No special characters allowed',
	brand: 'No special characters allowed',
};

// Regex rule checks
const onlyLetters = (param) => /^\p{L}+$/u.test(param);
const namesTest = (param) => /^[a-zA-Z \-']+$/.test(param);
const lettersNumbers = (param) => /^[a-zA-Z0-9 \-']+$/.test(param);

// Validation function
export const validateField = (name, value) => {
	if (
		nullAllowed.includes(name) &&
		(value === null || value === undefined || value === '')
	) {
		return true;
	}

	if (name === 'id' && typeof value !== 'number') {
		return false;
	}

	if (names.includes(name)) {
		return namesTest(value);
	}

	if (handleYoyoBrandKeys.includes(name)) {
		return lettersNumbers(value);
	}

	if (locationKeys.includes(name)) {
		return onlyLetters(value);
	}

	if (name === 'privacy') {
		return privacyValues.includes(value);
	}

	return true;
};

// Helper to trim data and validate all fields
export const trimAndValidate = (formData) => {
	const trimmedData = Object.fromEntries(
		Object.entries(formData).map(([key, value]) => [
			key,
			value?.trim() === '' ? null : value?.trim(),
		])
	);

	const values = Object.entries(trimmedData);

	const failed = values.filter(([key, val]) => !validateField(key, val));

	return { trimmedData, failed };
};
