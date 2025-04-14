// lib/rateLimiter.js
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Create a rate limiter instance that uses in-memory store
const rateLimiter = new RateLimiterMemory({
	points: 5, // Number of requests allowed
	duration: 60, // Duration of the window in seconds (1 minute)
});

export async function checkRateLimit(ip) {
	try {
		// Consume 1 point for each request
		await rateLimiter.consume(ip); // Consume points for the request
	} catch (rejRes) {
		// If rate limit is exceeded, return an error
		throw new Error('Too many requests, please try again later');
	}
}
