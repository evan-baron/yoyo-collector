import { sendContactForm } from '@/services/mailService';
import { NextResponse } from 'next/server';

export async function POST(req) {
	try {
		const { name, email, message } = await req.json();

		await sendContactForm(name, email, message);

		const response = NextResponse.json(
			{
				message: 'Contact Us email sent',
			},
			{ status: 201 }
		);

		return response;
	} catch (err) {
		console.log(
			'Error sending contact form at api/contact/contact/route.js:',
			err
		);
		return NextResponse.json({ message: err.message }, { status: 500 });
	}
}
