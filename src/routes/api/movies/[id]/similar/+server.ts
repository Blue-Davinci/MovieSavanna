import { json } from '@sveltejs/kit';
import { logError, logInfo } from '$lib/helpers/logger/logger.js';
import { TMDB_API_KEY, TMDB_BASE_URL } from '$env/static/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const movieId = parseInt(params.id);

		if (!movieId || movieId <= 0) {
			return json(
				{
					success: false,
					error: 'Invalid movie ID'
				},
				{ status: 400 }
			);
		}

		logInfo('GET_SIMILAR_MOVIES_REQUEST', { movieId });

		// Use SvelteKit environment variables
		if (!TMDB_API_KEY || !TMDB_BASE_URL) {
			logError('MISSING_TMDB_CONFIG', {
				hasApiKey: !!TMDB_API_KEY,
				hasBaseUrl: !!TMDB_BASE_URL
			});
			throw new Error('Missing TMDB configuration');
		}

		const endpoint = `${TMDB_BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`;
		const response = await fetch(endpoint);

		if (!response.ok) {
			throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
		}

		const similarMovies = await response.json();

		return json({
			success: true,
			data: similarMovies
		});
	} catch (error) {
		logError('GET_SIMILAR_MOVIES_FAILED', {
			movieId: params.id,
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined
		});

		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Failed to get similar movies'
			},
			{ status: 500 }
		);
	}
};
