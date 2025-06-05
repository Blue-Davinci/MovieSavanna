import type { PageServerLoad } from './$types.js';
import { error } from '@sveltejs/kit';
import { TMDB_API_KEY, TMDB_BASE_URL } from '$env/static/private';
import { logError, logInfo } from '$lib/helpers/logger/logger.js';
import type { MovieDetails, MovieCredits, MovieVideos } from '$lib/types/movie.js';

// In-memory cache for server-side requests
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

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
    logError('MOVIE_PAGE_TMDB_FETCH_ERROR', {
      endpoint,
      error: err instanceof Error ? err.message : 'Unknown error'
    });
    throw err;
  }
}

export const load: PageServerLoad = async ({ params, depends }) => {
  const movieId = parseInt(params.id);
  
  // Only throw hard error for truly invalid IDs
  if (isNaN(movieId) || movieId <= 0) {
    error(400, {  
      message: 'Invalid movie ID'
    });
  }
  
  depends(`movie:${movieId}`);
  
  try {
    // Fetch movie details, credits, and videos in parallel
    const [movieDetails, movieCredits, movieVideos] = await Promise.all([
      fetchFromTMDB<MovieDetails>(`/movie/${movieId}?`),
      fetchFromTMDB<MovieCredits>(`/movie/${movieId}/credits?`),
      fetchFromTMDB<MovieVideos>(`/movie/${movieId}/videos?`)
    ]);
    
    logInfo('MOVIE_PAGE_LOAD_SUCCESS', {
      movieId,
      title: movieDetails.title,
      runtime: movieDetails.runtime
    });
    
    // Return successful data
    return {
      movieDetails,
      movieCredits,
      movieVideos,
      error: null
    };
  } catch (err) { // Using 'err' instead of 'error'
    logError('MOVIE_PAGE_LOAD_ERROR', {
      movieId,
      error: err instanceof Error ? err.message : 'Unknown error'
    });
    
    // ✅ GRACEFUL: Return error state instead of throwing
    return {
      movieDetails: null,
      movieCredits: null,
      movieVideos: null,
      error: 'Unable to load movie details. Please try again.'
    };
  }
};