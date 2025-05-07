// Libraries
import React, { useState } from 'react';
import { getAll, getCountries, getStatesByShort } from 'countrycitystatejson';

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

	// Location Data
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
	const filteredCities = (() => {
		const country = locationFormData.country;

		if (!country) return [];

		const countries = locationData.find((param) => param.name === country);

		if (!countries || !countries.states) return [];

		const allCities = Object.values(countries.states)
			.flatMap((stateCities) => stateCities.map((city) => city.name))
			.sort((a, b) => a.localeCompare(b));

		const short = countriesShort.find((obj) => obj.name === country)?.short;

		if (!short) return [];

		const state = locationFormData.state;

		if (!state) {
			return allCities
				.filter((city) =>
					city
						.toLowerCase()
						.startsWith(locationFormData.city?.toLowerCase() || '')
				)
				.reduce((finalAllCities, city) => {
					if (!finalAllCities.includes(city)) {
						finalAllCities.push(city);
					}
					return finalAllCities;
				}, []);
		} else if (state) {
			const cities = getAll()[short]?.states?.[state];

			if (!cities) return [];

			return cities
				.map((city) => city?.name)
				.filter((city) =>
					city
						.toLowerCase()
						.startsWith(locationFormData.city?.toLowerCase() || '')
				)
				.sort((a, b) => a.localeCompare(b));
		}
	})();

	// Handle Submits
	const handleLocationSubmit = () => {
		const { country, state, city } = locationFormData;

		const shortenedCountries = {
			'United States': 'USA',
			'United Arab Emirates': 'UAE',
			'United Kingdom': 'UK',
			// More to come as I think of them
		};

		const countryShorten = (country) => shortenedCountries[country] || country;

		setProfileSettingsFormData({
			...profileSettingsFormData,
			country: countryShorten(country),
			state: state,
			city: city,
		});

		setModalOpen(false);
	};

	return (
		<>
			<div className={styles.location}>
				<h2 className={styles.h2}>Location Settings</h2>
				<div className={styles.item}>
					<DropdownSelector
						name='Country'
						value={locationFormData.country}
						list={filteredCountries}
						formData={locationFormData}
						setFunction={setLocationFormData}
					/>
				</div>
				<div className={styles['city-state']}>
					<div className={styles.item}>
						<DropdownSelector
							name='State'
							value={locationFormData.state}
							list={filteredStates}
							formData={locationFormData}
							setFunction={setLocationFormData}
						/>
					</div>
					<div className={styles.item}>
						<DropdownSelector
							name='City'
							value={locationFormData.city}
							list={filteredCities}
							formData={locationFormData}
							setFunction={setLocationFormData}
						/>
					</div>
				</div>
				<div className={styles.buttons}>
					<button className={styles.button} onClick={() => setModalOpen(false)}>
						Cancel
					</button>
					<button className={styles.button} onClick={handleLocationSubmit}>
						Save
					</button>
				</div>
				<div className={styles.close} onClick={() => setModalOpen(false)}>
					<Close sx={{ fontSize: '2rem' }} />
				</div>
			</div>
		</>
	);
}

export default LocationPicker;
