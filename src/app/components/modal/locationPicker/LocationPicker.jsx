// Libraries
import React, { useState, useEffect, useRef } from 'react';
import {
	getAll,
	getCountries,
	getStatesByShort,
	getCities,
} from 'countrycitystatejson';

// Styles
import styles from './locationPicker.module.scss';

// MUI
import { Close } from '@mui/icons-material';

// Components
import DropdownSelector from '../../dropdownSelector/DropdownSelector';

// Context
import { useAppContext } from '@/app/context/AppContext';

function LocationPicker() {
	const { setModalOpen, profileSettingsFormData, setProfileSettingsFormData } =
		useAppContext();

	const { country, state, city } = profileSettingsFormData;

	const [locationFormData, setLocationFormData] = useState({
		country: country,
		state: state,
		city: city,
	});

	const locationData = Object.entries(getAll()).map((obj) => obj[1]);

	const countries = locationData.map((obj) => obj.name);
	const countriesShort = getCountries().map((country) => {
		return { name: country.name, short: country.shortName };
	});

	const filteredCountries = countries
		.filter((item) =>
			item.toLowerCase().startsWith(locationFormData.country?.toLowerCase())
		)
		.sort((a, b) => a.localeCompare(b));

	const filteredStates = (() => {
		const country = locationFormData.country;

		if (!country) return [];

		const short = countriesShort.find((obj) => obj.name === country)?.short;

		if (!short) return;

		let states = getStatesByShort(short);

		if (!states) return;

		if (short === 'US') {
			const excluded = ['AA', 'AE', 'AP'];
			states = states.filter((key) => !excluded.includes(key));
		}

		return states
			.filter((state) =>
				state
					.toLowerCase()
					.startsWith(locationFormData.state?.toLowerCase() || '')
			)
			.sort((a, b) => a.localeCompare(b));
	})();

	const allCitiesInCountry = (country) => {
		const countryObj = locationData.find((c) => c.name === country);

		if (!countryObj || !countryObj.states) return [];

		return Object.values(countryObj.states)
			.flatMap((stateCities) => stateCities.map((city) => city.name))
			.sort((a, b) => a.localeCompare(b));
	};

	const filteredCities = (() => {
		const country = locationFormData.country;

		if (!country) return [];

		const short = countriesShort.find((obj) => obj.name === country)?.short;

		if (!short) return;

		const state = locationFormData.state;

		if (!state) {
			const allCities = allCitiesInCountry(country);

			return allCities
				.filter((city) =>
					city.toLowerCase().startsWith(locationFormData.city?.toLowerCase())
				)
				.reduce((finalAllCities, city) => {
					if (!finalAllCities.includes(city)) {
						finalAllCities.push(city);
					}
					return finalAllCities;
				}, []);
		} else if (state) {
			const cities =
				getAll()[short].states[state]?.map((city) => city.name) || [];
			return cities;
		}
	})();

	return (
		<>
			<div
				className={styles.location}
				onClick={() => {
					console.log(
						locationData.filter((country) => country.name === 'Cambodia')
					);
				}}
			>
				<div className={styles.item}>
					<DropdownSelector
						name='Country'
						value={locationFormData.country}
						list={filteredCountries}
						locationFormData={locationFormData}
						setLocationFormData={setLocationFormData}
					/>
				</div>
				<div className={styles.item}>
					<DropdownSelector
						name='State'
						value={locationFormData.state}
						list={filteredStates}
						locationFormData={locationFormData}
						setLocationFormData={setLocationFormData}
					/>
				</div>
				<div className={styles.item}>
					<DropdownSelector
						name='City'
						value={locationFormData.city}
						list={filteredCities}
						locationFormData={locationFormData}
						setLocationFormData={setLocationFormData}
					/>
				</div>
				<div className={styles.close} onClick={() => setModalOpen(false)}>
					<Close sx={{ fontSize: '2rem' }} />
				</div>
			</div>
		</>
	);
}

export default LocationPicker;
