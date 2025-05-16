import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import yoyosService from '@/services/yoyosService';
import uploadsService from '@/services/uploadsService';
import { getUserIdFromToken } from '@/lib/auth/getUserIdFromToken';
import { cookies } from 'next/headers';
import { validateAndExtendSession } from '@/lib/auth/validateAndExtend';

const { createYoyo, updateYoyo, deleteYoyo } = yoyosService;
const { deleteUploadsByYoyoId, getAllYoyoPhotos } = uploadsService;

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
const onlyNums = ['year', 'purchased', 'releaseYear', 'purchaseYear'];
const specialsAllowed = ['value', 'price', 'condition', 'purchasePrice'];

const noSpecialsTest = (param) => /^[a-zA-Z0-9 \-./?!']+$/.test(param);
const numsTest = (param) => /^[0-9]+$/.test(param);
const specialsTest = (param) =>
	/^[a-zA-Z0-9 '$%^&*()\-\+\/!@,.?:\";#]+$/.test(param);

const validateField = (name, value) => {
	if (value === null || value === '') {
		return true;
	}

	if (
		name === 'collectionId' ||
		name === 'originalOwner' ||
		name === 'yoyoId'
	) {
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

		await validateAndExtendSession('api/user/yoyos/route.js POST');

		return NextResponse.json(response, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ 'There was an error at /api/user/yoyos POST': error.message },
			{ status: 500 }
		);
	}
}

// Update a yoyo
export async function PATCH(req, res) {
	const keyMap = {
		originalOwner: 'original_owner',
		purchasePrice: 'purchase_price',
		purchaseYear: 'purchase_year',
		releaseYear: 'release_year',
		responseType: 'response_type',
		condition: 'yoyo_condition',
		value: 'yoyo_value',
	};

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

		const { yoyoId, valuesToUpdate } = await req.json();

		const { trimmedData, failed } = trimAndValidate(valuesToUpdate);

		const dbValuesToUpdate = Object.entries(trimmedData).reduce(
			(obj, [key, value]) => {
				const dbKey = keyMap[key] || key;
				obj[dbKey] = value;
				return obj;
			},
			{}
		);

		console.log(failed);

		if (failed.length > 0) {
			return NextResponse.json(
				{
					message:
						'Invalid characters detected in yoyo submission at /api/user/yoyos PATCH',
				},
				{ status: 400 }
			);
		}

		if (dbValuesToUpdate.original_owner === 'yes') {
			dbValuesToUpdate.original_owner = 1;
		} else if (dbValuesToUpdate.original_owner === 'no') {
			dbValuesToUpdate.original_owner = 0;
		}

		const response = await updateYoyo(yoyoId, { ...dbValuesToUpdate });

		// Eventually figure out how to connect uploading images while inserting yoyo into db...
		console.log(response.data);

		await validateAndExtendSession('api/user/yoyos/route.js PATCH');

		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ 'There was an error at /api/user/yoyos PATCH': error.message },
			{ status: 500 }
		);
	}
}

// Delete a yoyo
export async function DELETE(req, res) {
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

		const { id } = await req.json();

		const getYoyoPhotosResponse = await getAllYoyoPhotos(id);

		const publicIds = getYoyoPhotosResponse.map((photo) => photo.public_id);

		console.log(publicIds);

		await Promise.all(publicIds.map((id) => cloudinary.uploader.destroy(id)));

		const deleteUploadsResponse = await deleteUploadsByYoyoId(userId, id);

		const deleteYoyoResponse = await deleteYoyo(id, userId);

		const response = {
			yoyo: deleteYoyoResponse,
			uploads: deleteUploadsResponse,
		};

		await validateAndExtendSession(
			'api/user/collections/byCollectionId/route.js DELETE'
		);

		return NextResponse.json(response, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{
				'There was an error deleting the yoyo at /api/user/yoyos DELETE':
					error.message,
			},
			{ status: 500 }
		);
	}
}
