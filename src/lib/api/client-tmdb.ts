import type {
	Movie,
	MovieDetails,
	MovieCredits,
	MovieVideos,
	TMDBResponse,
	PosterSize,
	BackdropSize,
	ProfileSize
} from '$lib/types/movie.js';

/**
 * Client-side TMDB service that calls our internal API routes
 * This ensures API keys stay on the server
 */
export class ClientTMDBService {
	private logError(event: string, data: Record<string, unknown>) {
		const logEntry = {
			level: 'ERROR',
			event,
			timestamp: new Date().toISOString(),
			location: 'client',
			userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
			...data
		};

		console.error(`[CLIENT] ${event}:`, logEntry);
	}

	private logInfo(event: string, data: Record<string, unknown>) {
		if (import.meta.env.DEV) {
			const logEntry = {
				level: 'INFO',
				event,
				timestamp: new Date().toISOString(),
				location: 'client',
				...data
			};
			$inspect(`[CLIENT] ${event}:`, logEntry);
		}
	}

	private async makeRequest<T>(url: string): Promise<T> {
		const startTime = Date.now();

		try {
			this.logInfo('CLIENT_API_REQUEST', { url });

			const response = await fetch(url);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));

				this.logError('CLIENT_API_RESPONSE_ERROR', {
					url,
					status: response.status,
					statusText: response.statusText,
					errorData,
					duration: Date.now() - startTime
				});

				throw new Error(
					errorData.error || errorData.message || `Request failed: ${response.status}`
				);
			}

			const result = await response.json();

			this.logInfo('CLIENT_API_SUCCESS', {
				url,
				duration: Date.now() - startTime,
				hasData: !!result.data,
				success: result.success
			});

			// Handle our wrapped API response format
			if (result.success && result.data) {
				return result.data as T;
			} else {
				throw new Error(result.error || 'API returned unsuccessful response');
			}
		} catch (error) {
			this.logError('CLIENT_TMDB_REQUEST_FAILED', {
				url,
				error: error instanceof Error ? error.message : 'Unknown error',
				duration: Date.now() - startTime
			});
			throw error;
		}
	}

	async getPopularMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
		try {
			// Now correctly extracts data from wrapped response
			const result = await this.makeRequest<TMDBResponse<Movie>>(
				`/api/movies/popular?page=${page}`
			);
			return result;
		} catch (error) {
			this.logError('GET_POPULAR_MOVIES_FAILED', {
				page,
				error: error instanceof Error ? error.message : 'Unknown error'
			});
			throw error;
		}
	}
	async getMovieDetails(movieId: number): Promise<{
		details: MovieDetails;
		credits: MovieCredits;
		videos: MovieVideos;
	}> {
		if (!movieId || movieId <= 0) {
			this.logError('GET_MOVIE_DETAILS_INVALID_ID', {
				movieId
			});
			throw new Error('Invalid movie ID');
		}

		try {
			const result = await this.makeRequest<{
				details: MovieDetails;
				credits: MovieCredits;
				videos: MovieVideos;
			}>(`/api/movies/${movieId}`);

			return result;
		} catch (error) {
			this.logError('GET_MOVIE_DETAILS_FAILED', {
				movieId,
				error: error instanceof Error ? error.message : 'Unknown error'
			});
			throw error;
		}
	}

	async searchMovies(query: string, page: number = 1): Promise<TMDBResponse<Movie>> {
		if (!query.trim()) {
			this.logError('SEARCH_MOVIES_INVALID_QUERY', {
				query,
				page
			});
			throw new Error('Search query is required');
		}

		try {
			const params = new URLSearchParams({
				q: query.trim(),
				page: page.toString()
			});

			// Now correctly extracts data from wrapped response
			const result = await this.makeRequest<TMDBResponse<Movie>>(`/api/movies/search?${params}`);
			return result;
		} catch (error) {
			this.logError('SEARCH_MOVIES_FAILED', {
				query: query.trim(),
				page,
				error: error instanceof Error ? error.message : 'Unknown error'
			});
			throw error;
		}
	}
	/**
	 * Discover movies with filters
	 */
	async discoverMovies(params: {
		with_genres?: string;
		sort_by?: string;
		'vote_count.gte'?: number;
		'vote_average.gte'?: number;
		page?: number;
	}): Promise<TMDBResponse<Movie>> {
		try {
			const searchParams = new URLSearchParams();

			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined) {
					searchParams.append(key, value.toString());
				}
			});

			const result = await this.makeRequest<TMDBResponse<Movie>>(
				`/api/movies/discover?${searchParams}`
			);
			return result;
		} catch (error) {
			this.logError('DISCOVER_MOVIES_FAILED', {
				params,
				error: error instanceof Error ? error.message : 'Unknown error'
			});
			throw error;
		}
	}

	/**
	 * Get similar movies to a specific movie
	 */
	async getSimilarMovies(movieId: number): Promise<TMDBResponse<Movie>> {
		if (!movieId || movieId <= 0) {
			this.logError('GET_SIMILAR_MOVIES_INVALID_ID', { movieId });
			throw new Error('Invalid movie ID');
		}

		try {
			const result = await this.makeRequest<TMDBResponse<Movie>>(`/api/movies/${movieId}/similar`);
			return result;
		} catch (error) {
			this.logError('GET_SIMILAR_MOVIES_FAILED', {
				movieId,
				error: error instanceof Error ? error.message : 'Unknown error'
			});
			throw error;
		}
	}

	/**
	 * Get movie details (simpler version for recommendations)
	 */
	async getMovieDetailsSimple(movieId: number): Promise<MovieDetails> {
		try {
			const result = await this.getMovieDetails(movieId);
			return result.details;
		} catch (error) {
			this.logError('GET_MOVIE_DETAILS_SIMPLE_FAILED', {
				movieId,
				error: error instanceof Error ? error.message : 'Unknown error'
			});
			throw error;
		}
	}

	/**
	 * Get full image URL (client-safe - no API key required)
	 */
	getImageUrl(
		path: string | null,
		size: PosterSize | BackdropSize | ProfileSize = 'w500'
	): string | null {
		if (!path) return null;

		const url = `https://image.tmdb.org/t/p/${size}${path}`;

		this.logInfo('IMAGE_URL_GENERATED', {
			path,
			size,
			generatedUrl: url
		});

		return url;
	}
}

export const clientTMDB = new ClientTMDBService();
