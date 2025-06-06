import { json } from '@sveltejs/kit';
import { logError, logInfo } from '$lib/helpers/logger/logger.js';
import { TMDB_API_KEY, TMDB_BASE_URL } from '$env/static/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const searchParams = url.searchParams;
		const page = parseInt(searchParams.get('page') || '1');
		const withGenres = searchParams.get('with_genres');
		const sortBy = searchParams.get('sort_by') || 'popularity.desc';
		const voteCountGte = parseInt(searchParams.get('vote_count.gte') || '0');
		const voteAverageGte = parseFloat(searchParams.get('vote_average.gte') || '0');

		logInfo('DISCOVER_MOVIES_REQUEST', {
			withGenres,
			sortBy,
			voteCountGte,
			voteAverageGte,
			page
		});

		// Build endpoint parameters
		const params = new URLSearchParams({
			page: page.toString(),
			sort_by: sortBy
		});

		if (withGenres) {
			params.append('with_genres', withGenres);
		}
		if (voteCountGte > 0) {
			params.append('vote_count.gte', voteCountGte.toString());
		}
		if (voteAverageGte > 0) {
			params.append('vote_average.gte', voteAverageGte.toString());
		}

		if (!TMDB_API_KEY || !TMDB_BASE_URL) {
			logError('MISSING_TMDB_CONFIG', {
				hasApiKey: !!TMDB_API_KEY,
				hasBaseUrl: !!TMDB_BASE_URL
			});
			throw new Error('Missing TMDB configuration');
		}

		const endpoint = `${TMDB_BASE_URL}/discover/movie?${params}&api_key=${TMDB_API_KEY}`;
		const response = await fetch(endpoint);

		if (!response.ok) {
			throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
		}

		const movies = await response.json();

		return json({
			success: true,
			data: movies
		});
	} catch (error) {
		logError('DISCOVER_MOVIES_FAILED', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined
		});

		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Failed to discover movies'
			},
			{ status: 500 }
		);
	}
};
