import userService from '@/services/userService';
const { updateUserSettings } = userService;
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/utils/rateLimiter';

export async function POST(req) {
	try {
		const ip =
			req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
			req.ip ||
			'anonymous';
		await checkRateLimit(ip);

		const newProfileSettings = await req.json();

		const values = Object.entries(newProfileSettings); // Should return array of values like ['city', 'Denver']

		const lettersNumbersAllowed = [
			'first',
			'last',
			'handle',
			'yoyo',
			'brand',
			'city',
			'state',
			'country',
		];

		const lettersNumbers = (param) => /^[a-zA-Z0-9 -']+$/.test(param);
		const lettersNumbersCharacters = (param) =>
			/^[a-zA-Z0-9,./?~@&()*%\$!#-'":;\s]+$/.test(param);

		const nullAllowed = [
			'handle',
			'yoyo',
			'brand',
			'city',
			'state',
			'country',
			'description',
		];

		const validation = (name, value) => {
			if (
				nullAllowed.includes(name) &&
				(value === null || value === undefined)
			) {
				return true;
			}

			if (typeof value !== 'string') return true;

			if (lettersNumbersAllowed.includes(name)) {
				return lettersNumbers(value);
			} else if (!lettersNumbersAllowed.includes(name)) {
				return lettersNumbersCharacters(value);
			}

			return false;
		};

		const isPrivacyValid = (param) =>
			['public', 'anonymous', 'private'].includes(param);

		const failed = values.filter(([key, val]) =>
			key === 'privacy' ? !isPrivacyValid(val) : !validation(key, val)
		);

		if (failed.length) {
			return NextResponse.json(
				{
					message: `Validation failed for: ${failed
						.map(([key]) => key)
						.join(', ')}`,
				},
				{ status: 400 }
			);
		}

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
			id,
		} = newProfileSettings;

		await updateUserSettings(
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
			id
		);

		return NextResponse.json(
			{ message: 'User profile settings updated successfully' },
			{ status: 200 }
		);
	} catch (err) {
		console.log('There was an error at api/user/updateSettings: ', err.message);
		return NextResponse.json({ message: err.message }, { status: 500 });
	}
}
