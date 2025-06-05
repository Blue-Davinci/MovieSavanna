import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { TMDB_API_KEY, TMDB_BASE_URL } from '$env/static/private';
import type { Movie, TMDBResponse } from '$lib/types/movie.js';
import {logError } from '$lib/helpers/logger/logger.js';

// In-memory cache for server-side requests
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Rate limiting (simple implementation for server-side)
const rateLimiter = new Map<string, number>();
const RATE_LIMIT = 40; // 40 requests per 10 seconds
const RATE_WINDOW = 10 * 1000; // 10 seconds

class ServerTMDBService {
  private async makeRequest<T>(endpoint: string): Promise<T> {
    const now = Date.now();
    const key = 'server';
    
    // Rate limiting check
    if (rateLimiter.has(key)) {
      const lastRequest = rateLimiter.get(key)!;
      if (now - lastRequest < RATE_WINDOW / RATE_LIMIT) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    rateLimiter.set(key, now);

    // Check cache first
    const cacheKey = endpoint;
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey)!;
      if (now - cached.timestamp < CACHE_TTL) {
        return cached.data as T;
      }
    }    try {
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
      logError('TMDB API request failed', {
        error: err instanceof Error ? err.message : String(err),
        endpoint,
        timestamp: new Date().toISOString()
      });
      throw error(500, 'Failed to fetch movie data');
    }
  }

  async getPopularMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.makeRequest<TMDBResponse<Movie>>(`/movie/popular?page=${page}`);
  }

  async searchMovies(query: string, page: number = 1): Promise<TMDBResponse<Movie>> {
    if (!query.trim()) {
      throw error(400, 'Search query is required');
    }
    const encodedQuery = encodeURIComponent(query.trim());
    return this.makeRequest<TMDBResponse<Movie>>(`/search/movie?query=${encodedQuery}&page=${page}`);
  }
}

const tmdbService = new ServerTMDBService();

export const load: PageServerLoad = async ({ depends }) => {
  depends('movies:popular');
  
  try {
    // Get initial popular movies for the dashboard
    const popularMovies = await tmdbService.getPopularMovies(1);
    
    return {
      popularMovies: {
        results: popularMovies.results,
        total_pages: popularMovies.total_pages,
        total_results: popularMovies.total_results,
        page: popularMovies.page
      }
    };
  } catch (err) {
    logError('Dashboard load error', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString()
    });
    throw error(500, 'Failed to load dashboard data');
  }
};
