import { json } from '@sveltejs/kit';
import { TMDB_API_KEY, TMDB_BASE_URL } from '$env/static/private';
import { logError, logInfo, logWarning } from '$lib/helpers/logger/logger.js';
import type { RequestHandler } from './$types.js';
import type { Movie, TMDBResponse } from '$lib/types/movie.js';

// Server-side cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

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

function getCacheStats() {
  const now = Date.now();
  let validEntries = 0;
  let expiredEntries = 0;

  for (const entry of cache.values()) {
    if (now - entry.timestamp > CACHE_TTL) {
      expiredEntries++;
    } else {
      validEntries++;
    }
  }

  return {
    total: cache.size,
    valid: validEntries,
    expired: expiredEntries
  };
}

export const GET: RequestHandler = async ({ url }) => {
  const startTime = Date.now();
  
  try {
    const query = url.searchParams.get('q');
    const page = parseInt(url.searchParams.get('page') || '1');
    
    // Return JSON instead of using error()
    if (!query || query.trim().length === 0) {
      logWarning('SEARCH_MISSING_QUERY', {
        query,
        ip: url.hostname
      });
      
      return json({
        success: false,
        error: 'Search query is required',
        error_code: 'MISSING_QUERY'
      }, { status: 400 });
    }

    if (query.trim().length < 2) {
      logWarning('SEARCH_QUERY_TOO_SHORT', {
        query: query.trim(),
        length: query.trim().length,
        ip: url.hostname
      });
      
      return json({
        success: false,
        error: 'Search query must be at least 2 characters',
        error_code: 'QUERY_TOO_SHORT'
      }, { status: 400 });
    }

    if (page < 1 || page > 1000) {
      logWarning('SEARCH_INVALID_PAGE', {
        requestedPage: page,
        query: query.trim(),
        ip: url.hostname
      });
      
      return json({
        success: false,
        error: 'Page must be between 1 and 1000',
        error_code: 'INVALID_PAGE'
      }, { status: 400 });
    }

    const encodedQuery = encodeURIComponent(query.trim());
    const data = await fetchFromTMDB<TMDBResponse<Movie>>(`/search/movie?query=${encodedQuery}&page=${page}`);
    
    logInfo('MOVIE_SEARCH_SUCCESS', {
      query: query.trim(),
      page,
      totalResults: data.total_results,
      moviesReturned: data.results.length,
      duration: Date.now() - startTime
    });
    
    // Return wrapped response format like popular movies
    return json({
      success: true,
      data,
      cache_stats: getCacheStats()
    });
  } catch (err) {
    logError('MOVIE_SEARCH_API_ERROR', {
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      duration: Date.now() - startTime,
      url: url.pathname + url.search
    });
    
    return json({
      success: false,
      error: 'Unable to search movies right now. Please try again.',
      error_code: 'SEARCH_FAILED',
      details: err instanceof Error ? err.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
};