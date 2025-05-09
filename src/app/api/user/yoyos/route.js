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

		if (yoyoData.originalOwner === 'yes') {
			yoyoData.originalOwner = 1;
		} else yoyoData.originalOwner = 0;

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
		} = yoyoData;

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
