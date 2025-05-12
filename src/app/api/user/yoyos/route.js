import { NextResponse } from 'next/server';
import yoyosService from '@/services/yoyosService';
import uploadsService from '@/services/uploadsService';
import { getUserIdFromToken } from '@/lib/auth/getUserIdFromToken';
import { cookies } from 'next/headers';
import { validateAndExtendSession } from '@/lib/auth/validateAndExtend';

const { createYoyo, getYoyoById, updateYoyo, deleteYoyo } = yoyosService;

// Create new yoyo
export async function POST(req, res) {
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

		const yoyoData = await req.json();

		// Validation
		//Constants
		const noSpecials = [
			'model',
			'brand',
			'bearing',
			'responseType',
			'color',
			'category',
		];
		const onlyNums = ['year', 'purchased'];
		const specialsAllowed = ['value', 'price', 'condition'];

		const noSpecialsTest = (param) => /^[a-zA-Z0-9 \-./!']+$/.test(param);
		const numsTest = (param) => /^[0-9]+$/.test(param);
		const specialsTest = (param) =>
			/^[a-zA-Z0-9 '$%^&*()\-\+\/!@,.?:\";#]+$/.test(param);

		const validateField = (name, value) => {
			if (value === null || value === '') {
				return true;
			}

			if (name === 'collectionId' || name === 'originalOwner') {
				return true;
			}

			if (noSpecials.includes(name)) {
				return noSpecialsTest(value);
			}

			if (onlyNums.includes(name)) {
				return numsTest(value);
			}

			if (specialsAllowed.includes(name)) {
				return specialsTest(value);
			}

			return false;
		};

		const trimAndValidate = (formData) => {
			const trimmedData = Object.fromEntries(
				Object.entries(formData).map(([key, value]) => {
					if (typeof value === 'string') {
						const trimmed = value.trim();
						return [key, trimmed === '' ? null : trimmed];
					}
					// Convert NaN to null for numeric inputs
					if (typeof value === 'number' && isNaN(value)) {
						return [key, null];
					}
					return [key, value];
				})
			);

			const values = Object.entries(trimmedData);

			const failed = values.filter(([key, val]) => !validateField(key, val));

			return { trimmedData, failed };
		};

		const { trimmedData, failed } = trimAndValidate(yoyoData);

		if (failed.length > 0) {
			return NextResponse.json(
				{
					message:
						'Invalid characters detected in yoyo submission at /api/user/yoyos POST',
				},
				{ status: 400 }
			);
		}

		if (trimmedData.originalOwner === 'yes') {
			trimmedData.originalOwner = 1;
		} else if (trimmedData.originalOwner === 'no') {
			trimmedData.originalOwner = 0;
		}

		const {
			collectionId,
			bearing,
			brand,
			category,
			color,
			condition,
			model,
			originalOwner,
			price,
			purchased,
			responseType,
			value,
			year,
		} = trimmedData;

		const response = await createYoyo(
			userId,
			collectionId,
			bearing,
			brand,
			category,
			color,
			condition,
			model,
			originalOwner,
			price,
			purchased,
			responseType,
			value,
			year
		);

		// Eventually figure out how to connect uploading images while inserting yoyo into db...
		console.log(response.data);

		await validateAndExtendSession('api/user/collections/route.js POST');

		return NextResponse.json(response, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ 'There was an error at /api/user/yoyos POST': error.message },
			{ status: 500 }
		);
	}
}
