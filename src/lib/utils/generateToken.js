import crypto from 'crypto';

export function generateSecureToken(length = 22) {
	const charset =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charsetLength = charset.length;
	const token = [];
	const bytes = new Uint8Array(length * 2); // extra to allow for rejections
	crypto.getRandomValues(bytes);

	let i = 0;
	while (token.length < length && i < bytes.length) {
		const byte = bytes[i++];
		const max = Math.floor(256 / charsetLength) * charsetLength;
		if (byte < max) {
			token.push(charset[byte % charsetLength]);
		}
	}

	// If we didn't get enough valid characters, generate more
	while (token.length < length) {
		const [byte] = crypto.getRandomValues(new Uint8Array(1));
		const max = Math.floor(256 / charsetLength) * charsetLength;
		if (byte < max) {
			token.push(charset[byte % charsetLength]);
		}
	}

	return token.join('');
}
