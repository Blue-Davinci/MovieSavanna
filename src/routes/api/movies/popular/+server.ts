import { json } from '@sveltejs/kit';
import { TMDB_API_KEY, TMDB_BASE_URL } from '$env/static/private';
import type { RequestHandler } from './$types.js';
import type { Movie, TMDBResponse } from '$lib/types/movie.js';

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
    console.error('TMDB API request failed:', err);
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
  try {
    const page = parseInt(url.searchParams.get('page') || '1');
    
    if (page < 1 || page > 1000) {
      return json({ 
        success: false, 
        error: 'Invalid page number. Please choose between 1 and 1000.',
        error_code: 'INVALID_PAGE'
      }, { status: 400 });
    }

    const data = await fetchFromTMDB<TMDBResponse<Movie>>(`/movie/popular?page=${page}`);
    
    return json({
      success: true,
      data,
      cache_stats: getCacheStats()
    });
  } catch (err) {
    console.error('Popular movies API error:', err);
    
    // Enhanced error response
    return json({
      success: false,
      error: 'Unable to load popular movies right now. Please try again.',
      error_code: 'FETCH_FAILED',
      details: err instanceof Error ? err.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
};