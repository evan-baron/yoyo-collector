import { NextResponse } from 'next/server';

export function middleware(req) {
	console.log('A request was fired!');
}

export const config = {
	matcher: 'http://localhost:3000/api/:path*',
};
