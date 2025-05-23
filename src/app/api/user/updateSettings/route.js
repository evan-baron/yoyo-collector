import userService from '@/services/userService';
const { updateUserSettings, updateWarning } = userService;
import { NextResponse } from 'next/server';
import { getUserIdFromToken } from '@/lib/auth/getUserIdFromToken';
import { cookies } from 'next/headers';
import { validateAndExtendSession } from '@/lib/auth/validateAndExtend';

export async function POST(req) {
	try {
		const { userId, valid } = await getUserIdFromToken({
			cookies,
		});

		if (!userId) {
			throw new Error('User ID is missing');
		}

		if (!valid) {
			throw new Error('Token no longer valid');
		}

		const newProfileSettings = await req.json();

		const values = Object.entries(newProfileSettings); // Should return array of values like ['city', 'Denver']

		// Rule Checks Setup
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

		// Regex Rule Checks
		const onlyLetters = (param) => /^\p{L}+$/u.test(param);
		const namesTest = (param) => /^[a-zA-Z \-']+$/.test(param);
		const lettersNumbers = (param) => /^[a-zA-Z0-9 \-']+$/.test(param);

		const validation = (name, value) => {
			if (
				nullAllowed.includes(name) &&
				(value === null || value === undefined || value === '')
			) {
				return true;
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

		// If item fails, puts into this array
		const failed = values.filter(([key, val]) => !validation(key, val));

		// If array length > 0, reject
		if (failed.length) {
			return NextResponse.json(
				{
					message: `Validation failed for: ${failed
						.map(([key]) => key)
						.join(', ')} inside api/user/updateSettings/route.js`,
				},
				{ status: 400 }
			);
		}

		// All items passed, destructure object and send to services/backend
		const {
			brand,
			city,
			country,
			description,
			first,
			handle,
			last,
			privacy,
			state,
			yoyo,
		} = newProfileSettings;

		const updatedUser = await updateUserSettings(
			brand,
			city,
			country,
			description,
			first,
			handle,
			last,
			privacy,
			state,
			yoyo,
			userId
		);

		await validateAndExtendSession('api/user/updateSettings/route.js POST');

		return NextResponse.json(
			{
				user: updatedUser,
				message: 'User profile settings updated successfully',
			},
			{ status: 200 }
		);
	} catch (err) {
		console.log('There was an error at api/user/updateSettings: ', err.message);
		return NextResponse.json({ message: err.message }, { status: 500 });
	}
}

export async function PATCH(req, res) {
	try {
		const { userId, valid } = await getUserIdFromToken({
			cookies,
		});

		if (!userId) {
			throw new Error('User ID is missing');
		}

		if (!valid) {
			throw new Error('Token no longer valid');
		}

		const params = await req.json();
		const { warningType } = params;

		if (warningType === 'collection') {
			await updateWarning(userId, 'delete_collection_warning');
		} else if (warningType === 'yoyo') {
			await updateWarning(userId, 'delete_yoyo_warning');
		}

		return NextResponse.json(
			{
				message: 'User warning settings updated successfully',
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log(
			'There was an error updating the user at api/user/updateSettings PATCH: ',
			error.message
		);
		return NextResponse.json({ message: err.message }, { status: 500 });
	}
}
