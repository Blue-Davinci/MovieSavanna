import { clientTMDB } from '$lib/api/client-tmdb.js';
import type { Movie, MovieDetails, Genre } from '$lib/types/movie.js';
import type { UserFavorite } from '$lib/types/favorites.js';

interface GenreAnalysis {
	topGenres: number[];
	genreScores: Map<number, number>;
}

export class RecommendationService {
	private readonly FALLBACK_GENRES = [28, 12, 16, 35, 80, 18, 14, 27, 9648, 10749]; // Popular genre IDs
	private readonly MAX_SAMPLE_SIZE = 8;
	private readonly API_DELAY = 100; // ms between API calls
	private readonly MIN_RATING = 6.0;
	private readonly MIN_VOTE_COUNT = 300;

	/**
	 * Get intelligent recommendations based on user's favorite movies
	 */
	async getRecommendationsFromFavorites(favorites: UserFavorite[]): Promise<Movie[]> {
		if (favorites.length === 0) {
			return this.getPopularMovies();
		}

		try {
			$inspect('[RECOMMENDATIONS] Analyzing user preferences from', favorites.length, 'favorites');

			// Analyze user's genre preferences from favorites
			const genreAnalysis = await this.analyzeUserGenrePreferences(favorites);

			if (genreAnalysis.topGenres.length === 0) {
				$inspect('[RECOMMENDATIONS] No genre preferences found, falling back to popular movies');
				return this.getPopularMovies();
			}

			$inspect('[RECOMMENDATIONS] Top genres:', genreAnalysis.topGenres);

			// Get recommendations based on preferred genres
			const recommendations = await this.getGenreBasedRecommendations(
				genreAnalysis.topGenres,
				favorites.map((fav: UserFavorite) => fav.movie_id)
			);

			$inspect('[RECOMMENDATIONS] Generated', recommendations.length, 'recommendations');
			return recommendations.slice(0, 12); // Limit to 12 recommendations
		} catch (error) {
			console.error('[RECOMMENDATIONS] Error generating recommendations:', error);
			return this.getPopularMovies();
		}
	}

	/**
	 * Analyze user's genre preferences from their favorites
	 */
	private async analyzeUserGenrePreferences(favorites: UserFavorite[]): Promise<GenreAnalysis> {
		const genreScores = new Map<number, number>();
		const sampleSize = Math.min(favorites.length, this.MAX_SAMPLE_SIZE);

		// Process a sample of user's favorites
		const sampleFavorites = favorites.slice(0, sampleSize);

		for (const favorite of sampleFavorites) {
			try {
				const movieDetails: MovieDetails = await clientTMDB.getMovieDetailsSimple(
					favorite.movie_id
				);

				// Weight genres by movie rating (higher rated = more influence)
				const weight = favorite.movie_rating ? Math.max(favorite.movie_rating / 10, 0.5) : 1;

				movieDetails.genres.forEach((genre: Genre) => {
					const currentScore = genreScores.get(genre.id) || 0;
					genreScores.set(genre.id, currentScore + weight);
				});

				// Small delay to respect API rate limits
				await new Promise((resolve) => setTimeout(resolve, this.API_DELAY));
			} catch (error) {
				console.warn(
					`[RECOMMENDATIONS] Failed to get details for movie ${favorite.movie_id}:`,
					error
				);
			}
		}

		// Get top 3 genres sorted by score
		const topGenres = Array.from(genreScores.entries())
			.sort(([, a], [, b]) => b - a)
			.slice(0, 3)
			.map(([genreId]) => genreId);

		return { topGenres, genreScores };
	}

	/**
	 * Get recommendations based on preferred genres
	 */
	private async getGenreBasedRecommendations(
		preferredGenres: number[],
		excludeMovieIds: number[]
	): Promise<Movie[]> {
		const excludeSet = new Set(excludeMovieIds);
		const allRecommendations: Movie[] = [];

		// Get movies for each preferred genre
		for (const genreId of preferredGenres) {
			try {
				const response = await clientTMDB.discoverMovies({
					with_genres: genreId.toString(),
					sort_by: 'vote_average.desc',
					'vote_count.gte': this.MIN_VOTE_COUNT,
					'vote_average.gte': this.MIN_RATING,
					page: 1
				});

				// Filter out user's existing favorites
				const filteredMovies = response.results.filter((movie: Movie) => !excludeSet.has(movie.id));
				allRecommendations.push(...filteredMovies.slice(0, 6)); // 6 per genre
			} catch (error) {
				console.warn(
					`[RECOMMENDATIONS] Failed to get recommendations for genre ${genreId}:`,
					error
				);
			}
		}

		// Remove duplicates and return unique recommendations
		const uniqueMovies = Array.from(
			new Map(allRecommendations.map((movie: Movie) => [movie.id, movie])).values()
		);

		return uniqueMovies;
	}

	/**
	 * Fallback to popular movies when no preferences available
	 */
	private async getPopularMovies(): Promise<Movie[]> {
		try {
			$inspect('[RECOMMENDATIONS] Falling back to popular movies');
			const response = await clientTMDB.getPopularMovies(1);
			return response.results.slice(0, 12);
		} catch (error) {
			console.error('[RECOMMENDATIONS] Error getting popular movies:', error);
			return [];
		}
	}

	/**
	 * Get similar movies to a specific movie (for individual movie pages)
	 */
	async getSimilarMovies(movieId: number, excludeIds: number[] = []): Promise<Movie[]> {
		try {
			$inspect('[RECOMMENDATIONS] Getting similar movies for', movieId);
			const response = await clientTMDB.getSimilarMovies(movieId);
			const excludeSet = new Set(excludeIds);

			return response.results.filter((movie: Movie) => !excludeSet.has(movie.id)).slice(0, 6);
		} catch (error) {
			console.error('[RECOMMENDATIONS] Error getting similar movies:', error);
			return [];
		}
	}
}

// Export singleton instance
export const recommendationService = new RecommendationService();
