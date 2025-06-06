import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FavoritesService } from './favorites.js';
import type {
	UserFavorite,
	FavoriteRequest,
	FavoritesResponse,
	FavoriteToggleResponse
} from '$lib/types/favorites.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('FavoritesService', () => {
	let service: FavoritesService;

	beforeEach(() => {
		service = new FavoritesService();
		vi.clearAllMocks();
	});

	describe('getFavorites', () => {
		it('should fetch user favorites successfully', async () => {
			const mockFavorites: UserFavorite[] = [
				{
					id: '1',
					user_id: 'user123',
					movie_id: 550,
					movie_title: 'Fight Club',
					movie_poster: '/poster1.jpg',
					movie_release_date: '1999-10-15',
					movie_rating: 8.8,
					created_at: '2023-01-01T00:00:00Z',
					updated_at: '2023-01-01T00:00:00Z'
				},
				{
					id: '2',
					user_id: 'user123',
					movie_id: 680,
					movie_title: 'Pulp Fiction',
					movie_poster: '/poster2.jpg',
					movie_release_date: '1994-10-14',
					movie_rating: 8.9,
					created_at: '2023-01-02T00:00:00Z',
					updated_at: '2023-01-02T00:00:00Z'
				}
			];

			const mockResponse: FavoritesResponse = {
				success: true,
				favorites: mockFavorites
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse
			});

			const result = await service.getFavorites();

			expect(mockFetch).toHaveBeenCalledWith('/api/favorites');
			expect(result).toEqual(mockFavorites);
			expect(result).toHaveLength(2);
		});

		it('should handle getFavorites API errors', async () => {
			const mockResponse: FavoritesResponse = {
				success: false,
				error: 'Failed to fetch favorites'
			};

			mockFetch.mockResolvedValueOnce({
				ok: false,
				json: async () => mockResponse
			});

			await expect(service.getFavorites()).rejects.toThrow('Failed to fetch favorites');
		});

		it('should return empty array when no favorites', async () => {
			const mockResponse: FavoritesResponse = {
				success: true,
				favorites: []
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse
			});

			const result = await service.getFavorites();

			expect(result).toEqual([]);
		});
	});

	describe('isFavorited', () => {
		it('should check if movie is favorited successfully', async () => {
			const mockResponse = {
				success: true,
				is_favorited: true
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse
			});

			const result = await service.isFavorited(550);

			expect(mockFetch).toHaveBeenCalledWith('/api/favorites/550');
			expect(result).toBe(true);
		});

		it('should return false when movie is not favorited', async () => {
			const mockResponse = {
				success: true,
				is_favorited: false
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse
			});

			const result = await service.isFavorited(999);

			expect(result).toBe(false);
		});

		it('should return false on API error', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				json: async () => ({
					success: false,
					error: 'Movie not found'
				})
			});

			const result = await service.isFavorited(999);

			expect(result).toBe(false);
		});
	});

	describe('toggleFavorite', () => {
		it('should toggle favorite successfully', async () => {
			const favoriteData: FavoriteRequest = {
				movie_id: 550,
				movie_title: 'Fight Club',
				movie_poster: '/poster.jpg',
				movie_release_date: '1999-10-15',
				movie_rating: 8.8
			};

			const mockResponse: FavoriteToggleResponse = {
				success: true,
				is_favorited: true,
				message: 'Movie added to favorites'
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse
			});

			const result = await service.toggleFavorite(favoriteData);

			expect(mockFetch).toHaveBeenCalledWith('/api/favorites/toggle', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(favoriteData)
			});
			expect(result).toBe(true);
		});

		it('should handle toggle favorite API errors', async () => {
			const favoriteData: FavoriteRequest = {
				movie_id: 550,
				movie_title: 'Fight Club'
			};

			const mockResponse: FavoriteToggleResponse = {
				success: false,
				is_favorited: false,
				error: 'Failed to toggle favorite'
			};

			mockFetch.mockResolvedValueOnce({
				ok: false,
				json: async () => mockResponse
			});

			await expect(service.toggleFavorite(favoriteData)).rejects.toThrow(
				'Failed to toggle favorite'
			);
		});

		it('should remove from favorites when toggling off', async () => {
			const favoriteData: FavoriteRequest = {
				movie_id: 680,
				movie_title: 'Pulp Fiction',
				movie_poster: '/pulp_fiction.jpg',
				movie_release_date: '1994-10-14',
				movie_rating: 8.9
			};

			const mockResponse: FavoriteToggleResponse = {
				success: true,
				is_favorited: false,
				message: 'Movie removed from favorites'
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse
			});

			const result = await service.toggleFavorite(favoriteData);

			expect(result).toBe(false);
		});
	});
});
