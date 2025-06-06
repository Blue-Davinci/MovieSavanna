// DEPRECATED: This file contains private env vars and should NOT be used client-side
// Use client-tmdb.ts for client-side API calls instead
// This file is kept for reference only

import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from '$env/static/private';
import { logError, logWarning, logInfo } from '$lib/helpers/logger/logger.js';
import type { 
  Movie, 
  MovieDetails, 
  MovieCredits, 
  TMDBResponse, 
  APIError,
  CacheEntry,
  CacheOptions,
  PosterSize,
  BackdropSize,
  ProfileSize,
} from '$lib/types/movie.js';

/**
 * TMDB API Service with caching and rate limiting
 */
class TMDBService {
  private cache = new Map<string, CacheEntry<unknown>>();
  private rateLimiter = new Map<string, number>();
  private readonly RATE_LIMIT = 40; // 40 requests per 10 seconds
  private readonly RATE_WINDOW = 10000; // 10 seconds in milliseconds
  private readonly DEFAULT_TTL = 1800000; // 30 minutes in milliseconds

  /**
   * Rate limiting check
   */
  private checkRateLimit(): boolean {
    const now = Date.now();
    const windowStart = now - this.RATE_WINDOW;
    
    // Clean old requests
    for (const [key, timestamp] of this.rateLimiter.entries()) {
      if (timestamp < windowStart) {
        this.rateLimiter.delete(key);
      }
    }
    
    // Check if we're within rate limit
    if (this.rateLimiter.size >= this.RATE_LIMIT) {
      logWarning('TMDB API rate limit reached', {
        message: 'Rate limit exceeded. Too many requests in a short period.',
        error: 'Rate limit exceeded',
        timestamp: new Date().toISOString(),
      })
      return false;
    }
    
    // Add current request to rate limiter
    this.rateLimiter.set(`${now}`, now);
    return true;
  }

  /**
   * Get cached data or return null if expired/not found
   */
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data as T;
  }

  /**
   * Set data in cache
   */
  private setCache<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    });
  }

  /**
   * Make API request with error handling and caching
   */
  private async makeRequest<T>(
    endpoint: string, 
    options: CacheOptions = {}
  ): Promise<T> {
    const { ttl = this.DEFAULT_TTL, skipCache = false } = options;
    const cacheKey = `tmdb_${endpoint}`;

    // Check cache first (unless skipping)
    if (!skipCache) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached) {
        logInfo('TMDB cache hit', {
          message: `Returning cached data for ${endpoint}`,
          endpoint,
          timestamp: new Date().toISOString(),
        });
        return cached;
      }
    }

    // Check rate limit
    if (!this.checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please wait before making more requests.');
    }

    try {
      const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}`;
      logInfo('TMDB API request', {
        message: `Making request to TMDB API for ${endpoint}`,
        endpoint,
        timestamp: new Date().toISOString(),
      });
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData: APIError = await response.json().catch(() => ({
          success: false,
          status_code: response.status,
          status_message: response.statusText
        }));
        
        throw new Error(`TMDB API Error ${errorData.status_code}: ${errorData.status_message}`);
      }

      const data: T = await response.json();
      
      // Cache successful response
      this.setCache(cacheKey, data, ttl);
      
      return data;
    } catch (error) {
      logError('TMDB API request error', {
        message: `Failed to fetch data from TMDB for ${endpoint}`,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        endpoint,
        timestamp: new Date().toISOString(),
      });
      
      // If we have stale cache data, return it as fallback
      const staleCache = this.cache.get(cacheKey);
      if (staleCache) {
        logWarning('Using stale cache data', {
          message: `Returning stale cache data for ${endpoint}`,
          endpoint,
          timestamp: new Date().toISOString(),
        });
        return staleCache.data as T;
      }
      
      throw error;
    }
  }


  /**
   * Get popular movies
   */
  async getPopularMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.makeRequest<TMDBResponse<Movie>>(`/movie/popular?page=${page}`);
  }

  /**
   * Search movies by title
   */
  async searchMovies(query: string, page: number = 1): Promise<TMDBResponse<Movie>> {
    const encodedQuery = encodeURIComponent(query.trim());
    return this.makeRequest<TMDBResponse<Movie>>(
      `/search/movie?query=${encodedQuery}&page=${page}`,
      { ttl: 600000 } // 10 minutes for search results
    );
  }

  /**
   * Get movie details by ID
   */
  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.makeRequest<MovieDetails>(`/movie/${movieId}`);
  }

  /**
   * Get movie credits (cast and crew)
   */
  async getMovieCredits(movieId: number): Promise<MovieCredits> {
    return this.makeRequest<MovieCredits>(`/movie/${movieId}/credits`);
  }

  /**
   * Get full image URL
   */
  getImageUrl(
    path: string | null, 
    size: PosterSize | BackdropSize | ProfileSize = 'w500'
  ): string | null {
    if (!path) return null;
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  }

  /**
   * Clear cache (useful for development)
   */
  clearCache(): void {
    this.cache.clear();
    logInfo('TMDB cache cleared', {
      message: 'Cache has been cleared successfully',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Get cache stats
   */
  getCacheStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const entry of this.cache.values()) {
      if (now > entry.expiry) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      total: this.cache.size,
      valid: validEntries,
      expired: expiredEntries,
      rateLimitRemaining: this.RATE_LIMIT - this.rateLimiter.size
    };
  }
}

// Export singleton instance
export const tmdbService = new TMDBService();