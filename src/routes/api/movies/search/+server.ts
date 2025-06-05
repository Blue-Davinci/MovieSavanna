import { json, error } from '@sveltejs/kit';
import { TMDB_API_KEY, TMDB_BASE_URL } from '$env/static/private';
import type { RequestHandler } from './$types.js';
import type { Movie, TMDBResponse } from '$lib/types/movie.js';
import { logError } from '$lib/helpers/logger/logger.js';

// Server-side cache
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
    logError('TMDB API request error', {
      message: `Failed to fetch data from TMDB for ${endpoint}`,
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    });
    throw new Error('Failed to fetch from TMDB');
  }
}

export const GET: RequestHandler = async ({ url }) => {
  try {
    const query = url.searchParams.get('q');
    const page = parseInt(url.searchParams.get('page') || '1');
    
    if (!query || query.trim().length === 0) {
      throw error(400, 'Search query is required');
    }

    if (query.trim().length < 2) {
      throw error(400, 'Search query must be at least 2 characters');
    }

    if (page < 1 || page > 1000) {
      throw error(400, 'Page must be between 1 and 1000');
    }

    const encodedQuery = encodeURIComponent(query.trim());
    const movies = await fetchFromTMDB<TMDBResponse<Movie>>(`/search/movie?query=${encodedQuery}&page=${page}`);
      return json(movies);
  } catch (err) {
    logError('Movie search API error', {
      message: 'Failed to search movies',
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    });
    throw error(500, 'Failed to search movies');
  }
};