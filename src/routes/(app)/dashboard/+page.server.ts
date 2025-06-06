import type { PageServerLoad } from './$types.js';
import { TMDB_API_KEY, TMDB_BASE_URL } from '$env/static/private';
import { logError, logInfo } from '$lib/helpers/logger/logger.js';
import type { Movie, TMDBResponse } from '$lib/types/movie.js';

// In-memory cache for server-side requests
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

async function fetchFromTMDB<T>(endpoint: string): Promise<T> {
	const now = Date.now();
	const cacheKey = endpoint;

	// Check cache first
	if (cache.has(cacheKey)) {
		const cached = cache.get(cacheKey)!;
		if (now - cached.timestamp < CACHE_TTL) {
			return cached.data as T;
		}
	}

	try {
		const url = `${TMDB_BASE_URL}${endpoint}&api_key=${TMDB_API_KEY}`;
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		// Cache the result
		cache.set(cacheKey, { data, timestamp: now });

		return data;
	} catch (err) {
		logError('DASHBOARD_TMDB_FETCH_ERROR', {
			endpoint,
			error: err instanceof Error ? err.message : 'Unknown error'
		});
		throw err;
	}
}

export const load: PageServerLoad = async ({ depends }) => {
	depends('movies:popular');

	try {
		const popularMovies = await fetchFromTMDB<TMDBResponse<Movie>>('/movie/popular?page=1');

		logInfo('DASHBOARD_LOAD_SUCCESS', {
			moviesLoaded: popularMovies.results.length,
			totalResults: popularMovies.total_results
		});

		return {
			popularMovies
		};
	} catch (error) {
		logError('DASHBOARD_LOAD_ERROR', {
			error: error instanceof Error ? error.message : 'Unknown error'
		});

		// Return fallback data instead of throwing
		return {
			popularMovies: {
				page: 1,
				results: [],
				total_pages: 0,
				total_results: 0
			} as TMDBResponse<Movie>
		};
	}
};
