import { json } from '@sveltejs/kit';
import { TMDB_API_KEY, TMDB_BASE_URL } from '$env/static/private';
import { logError } from '$lib/helpers/logger/logger.js';
import type { RequestHandler } from './$types.js';
import type { TMDBResponse, Movie } from '$lib/types/movie.js';
import { logInfo } from '$lib/helpers/logger/logger.js';

export const GET: RequestHandler = async () => {
	try {
		logInfo('Testing TMDB API connection', {
			timestamp: new Date().toISOString(),
			api_base_url: TMDB_BASE_URL,
			api_key: TMDB_API_KEY ? 'Provided' : 'Not provided'
		});

		// Test popular movies with direct fetch
		const response = await fetch(`${TMDB_BASE_URL}/movie/popular?page=1&api_key=${TMDB_API_KEY}`);

		if (!response.ok) {
			throw new Error(`TMDB API returned ${response.status}: ${response.statusText}`);
		}

		const popularMovies: TMDBResponse<Movie> = await response.json();

		return json({
			success: true,
			message: 'TMDB API connection successful!',
			sample_data: {
				total_results: popularMovies.total_results,
				total_pages: popularMovies.total_pages,
				sample_movie: popularMovies.results[0]
			}
		});
	} catch (error) {
		logError('TMDB API test failed:', {
			error: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined,
			timestamp: new Date().toISOString()
		});

		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'TMDB API test failed'
			},
			{ status: 500 }
		);
	}
};
