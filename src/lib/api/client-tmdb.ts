import type { Movie, TMDBResponse, PosterSize, BackdropSize, ProfileSize } from '$lib/types/movie.js';

/**
 * Client-side TMDB service that calls our internal API routes
 * This ensures API keys stay on the server
 */
export class ClientTMDBService {
  private async makeRequest<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      // Keeping the client side logs to the console
      // Not using our loggers
      console.error('Client TMDB request failed:', error);
      throw error;
    }
  }

  async getPopularMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.makeRequest<TMDBResponse<Movie>>(`/api/movies/popular?page=${page}`);
  }

  async searchMovies(query: string, page: number = 1): Promise<TMDBResponse<Movie>> {
    if (!query.trim()) {
      throw new Error('Search query is required');
    }
    const params = new URLSearchParams({
      q: query.trim(),
      page: page.toString()
    });
    return this.makeRequest<TMDBResponse<Movie>>(`/api/movies/search?${params}`);  }

  /**
   * Get full image URL (client-safe - no API key required)
   */
  getImageUrl(
    path: string | null, 
    size: PosterSize | BackdropSize | ProfileSize = 'w500'
  ): string | null {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
}

export const clientTMDB = new ClientTMDBService();
