import { json } from '@sveltejs/kit';
import { TMDB_API_KEY, TMDB_BASE_URL } from '$env/static/private';
import { logError, logInfo, logWarning } from '$lib/helpers/logger/logger.js';
import type { RequestHandler } from './$types.js';
import type { MovieDetails, MovieCredits, MovieVideos } from '$lib/types/movie.js';

// Server-side cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour for movie details (longer cache)

async function fetchFromTMDB<T>(endpoint: string): Promise<T> {
	const startTime = Date.now();
	const now = Date.now();
	const cacheKey = endpoint;

	// Check cache first
	if (cache.has(cacheKey)) {
		const cached = cache.get(cacheKey)!;
		if (now - cached.timestamp < CACHE_TTL) {
			logInfo('TMDB_CACHE_HIT', {
				endpoint,
				cacheAge: now - cached.timestamp,
				cacheTTL: CACHE_TTL
			});
			return cached.data as T;
		}
	}

	try {
		const url = `${TMDB_BASE_URL}${endpoint}&api_key=${TMDB_API_KEY}`;

		logInfo('TMDB_API_REQUEST', {
			endpoint,
			cacheKey
		});

		const response = await fetch(url);

		if (!response.ok) {
			logError('TMDB_API_ERROR', {
				endpoint,
				status: response.status,
				statusText: response.statusText,
				url: url.replace(TMDB_API_KEY, '[REDACTED]')
			});
			throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		// Cache the result
		cache.set(cacheKey, { data, timestamp: now });

		const duration = Date.now() - startTime;
		logInfo('TMDB_API_SUCCESS', {
			endpoint,
			duration,
			responseSize: JSON.stringify(data).length,
			cached: false
		});

		return data;
	} catch (err) {
		logError('TMDB_FETCH_FAILED', {
			endpoint,
			error: err instanceof Error ? err.message : 'Unknown error',
			stack: err instanceof Error ? err.stack : undefined,
			duration: Date.now() - startTime
		});
		throw new Error('Failed to fetch from TMDB');
	}
}

export const GET: RequestHandler = async ({ params, url }) => {
	const startTime = Date.now();

	try {
		const movieId = parseInt(params.id);

		if (isNaN(movieId) || movieId <= 0) {
			logWarning('INVALID_MOVIE_ID', {
				movieId: params.id,
				ip: url.hostname
			});

			return json(
				{
					success: false,
					error: 'Invalid movie ID',
					error_code: 'INVALID_ID'
				},
				{ status: 400 }
			);
		}

		// Fetch movie details, credits, and videos in parallel
		const [movieDetails, movieCredits, movieVideos] = await Promise.all([
			fetchFromTMDB<MovieDetails>(`/movie/${movieId}?`),
			fetchFromTMDB<MovieCredits>(`/movie/${movieId}/credits?`),
			fetchFromTMDB<MovieVideos>(`/movie/${movieId}/videos?`)
		]);

		logInfo('MOVIE_DETAILS_SUCCESS', {
			movieId,
			title: movieDetails.title,
			runtime: movieDetails.runtime,
			castCount: movieCredits.cast.length,
			videoCount: movieVideos.results.length,
			duration: Date.now() - startTime
		});

		return json({
			success: true,
			data: {
				details: movieDetails,
				credits: movieCredits,
				videos: movieVideos
			}
		});
	} catch (err) {
		logError('MOVIE_DETAILS_API_ERROR', {
			movieId: params.id,
			error: err instanceof Error ? err.message : 'Unknown error',
			stack: err instanceof Error ? err.stack : undefined,
			duration: Date.now() - startTime,
			url: url.pathname + url.search
		});

		return json(
			{
				success: false,
				error: 'Unable to load movie details right now. Please try again.',
				error_code: 'FETCH_FAILED',
				details: err instanceof Error ? err.message : 'Unknown error',
				timestamp: new Date().toISOString()
			},
			{ status: 500 }
		);
	}
};
