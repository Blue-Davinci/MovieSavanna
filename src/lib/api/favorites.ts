import type {
	UserFavorite,
	FavoriteRequest,
	FavoritesResponse,
	FavoriteToggleResponse
} from '$lib/types/favorites.js';

export class FavoritesService {
	private logError(event: string, data: Record<string, unknown>) {
		console.error(`[FAVORITES] ${event}:`, {
			timestamp: new Date().toISOString(),
			...data
		});
	}

	private logInfo(event: string, data: Record<string, unknown>) {
		if (import.meta.env.DEV) {
			$inspect(`[FAVORITES] ${event}:`, {
				timestamp: new Date().toISOString(),
				...data
			});
		}
	}

	/**
	 * Get all user favorites
	 */
	async getFavorites(): Promise<UserFavorite[]> {
		try {
			this.logInfo('GET_FAVORITES_REQUEST', {});

			const response = await fetch('/api/favorites');
			const result: FavoritesResponse = await response.json();

			if (!response.ok || !result.success) {
				throw new Error(result.error || 'Failed to fetch favorites');
			}

			this.logInfo('GET_FAVORITES_SUCCESS', {
				count: result.favorites?.length || 0
			});

			return result.favorites || [];
		} catch (error) {
			this.logError('GET_FAVORITES_ERROR', {
				error: error instanceof Error ? error.message : 'Unknown error'
			});
			throw error;
		}
	}

	/**
	 * Check if a movie is favorited
	 */
	async isFavorited(movieId: number): Promise<boolean> {
		try {
			this.logInfo('CHECK_FAVORITE_REQUEST', { movieId });

			const response = await fetch(`/api/favorites/${movieId}`);
			const result = await response.json();

			if (!response.ok || !result.success) {
				throw new Error(result.error || 'Failed to check favorite status');
			}

			this.logInfo('CHECK_FAVORITE_SUCCESS', {
				movieId,
				isFavorited: result.is_favorited
			});

			return result.is_favorited;
		} catch (error) {
			this.logError('CHECK_FAVORITE_ERROR', {
				movieId,
				error: error instanceof Error ? error.message : 'Unknown error'
			});
			return false; // Default to not favorited on error
		}
	}

	/**
	 * Toggle favorite status for a movie
	 */
	async toggleFavorite(favoriteData: FavoriteRequest): Promise<boolean> {
		try {
			this.logInfo('TOGGLE_FAVORITE_REQUEST', {
				movieId: favoriteData.movie_id,
				movieTitle: favoriteData.movie_title
			});

			const response = await fetch('/api/favorites/toggle', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(favoriteData)
			});

			const result: FavoriteToggleResponse = await response.json();

			if (!response.ok || !result.success) {
				throw new Error(result.error || 'Failed to toggle favorite');
			}

			this.logInfo('TOGGLE_FAVORITE_SUCCESS', {
				movieId: favoriteData.movie_id,
				isFavorited: result.is_favorited,
				message: result.message
			});

			return result.is_favorited;
		} catch (error) {
			this.logError('TOGGLE_FAVORITE_ERROR', {
				movieId: favoriteData.movie_id,
				error: error instanceof Error ? error.message : 'Unknown error'
			});
			throw error;
		}
	}
}

export const favoritesService = new FavoritesService();
