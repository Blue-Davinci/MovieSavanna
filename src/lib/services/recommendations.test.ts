/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RecommendationService } from './recommendations.js';
import type { Movie, MovieDetails, TMDBResponse } from '$lib/types/movie.js';
import type { UserFavorite } from '$lib/types/favorites.js';

// Mock the clientTMDB service
vi.mock('$lib/api/client-tmdb.js', () => ({
	clientTMDB: {
		getPopularMovies: vi.fn(),
		getMovieDetailsSimple: vi.fn(),
		discoverMovies: vi.fn()
	}
}));

import { clientTMDB } from '$lib/api/client-tmdb.js';

describe('RecommendationService', () => {
	let service: RecommendationService;

	beforeEach(() => {
		service = new RecommendationService();
		vi.clearAllMocks();
	});

	describe('getRecommendationsFromFavorites', () => {
		it('should return popular movies when no favorites provided', async () => {
			const mockPopularMovies: Movie[] = [
				{
					id: 1,
					title: 'Popular Movie 1',
					overview: 'Popular overview 1',
					poster_path: '/popular1.jpg',
					backdrop_path: '/popular_backdrop1.jpg',
					release_date: '2023-01-01',
					vote_average: 8.0,
					vote_count: 1000,
					genre_ids: [28, 12],
					adult: false,
					original_language: 'en',
					original_title: 'Popular Movie 1',
					popularity: 100.0,
					video: false
				}
			];

			const mockResponse: TMDBResponse<Movie> = {
				page: 1,
				results: mockPopularMovies,
				total_pages: 1,
				total_results: 1
			};

			(clientTMDB.getPopularMovies as any).mockResolvedValue(mockResponse);

			const result = await service.getRecommendationsFromFavorites([]);

			expect(clientTMDB.getPopularMovies).toHaveBeenCalled();
			expect(result).toEqual(mockPopularMovies);
		});

		it('should generate recommendations based on user favorites', async () => {
			const mockFavorites: UserFavorite[] = [
				{
					id: '1',
					user_id: 'user123',
					movie_id: 550,
					movie_title: 'Fight Club',
					movie_poster: '/fight_club.jpg',
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
					movie_poster: '/pulp_fiction.jpg',
					movie_release_date: '1994-10-14',
					movie_rating: 8.9,
					created_at: '2023-01-02T00:00:00Z',
					updated_at: '2023-01-02T00:00:00Z'
				}
			];

			const mockMovieDetails: MovieDetails = {
				id: 550,
				title: 'Fight Club',
				original_title: 'Fight Club',
				overview: 'Movie overview',
				tagline: 'Movie tagline',
				poster_path: '/fight_club.jpg',
				backdrop_path: '/fight_club_backdrop.jpg',
				release_date: '1999-10-15',
				runtime: 139,
				vote_average: 8.8,
				vote_count: 5000,
				popularity: 150.0,
				adult: false,
				video: false,
				original_language: 'en',
				status: 'Released',
				budget: 63000000,
				revenue: 100853753,
				homepage: null,
				imdb_id: 'tt0137523',
				genres: [
					{ id: 18, name: 'Drama' },
					{ id: 53, name: 'Thriller' }
				],
				production_companies: [],
				production_countries: [],
				spoken_languages: [],
				belongs_to_collection: null
			};

			const mockRecommendedMovies: Movie[] = [
				{
					id: 807,
					title: 'Se7en',
					overview: 'Recommended movie overview',
					poster_path: '/se7en.jpg',
					backdrop_path: '/se7en_backdrop.jpg',
					release_date: '1995-09-22',
					vote_average: 8.6,
					vote_count: 4000,
					genre_ids: [18, 53],
					adult: false,
					original_language: 'en',
					original_title: 'Se7en',
					popularity: 120.0,
					video: false
				}
			];

			const mockDiscoverResponse: TMDBResponse<Movie> = {
				page: 1,
				results: mockRecommendedMovies,
				total_pages: 1,
				total_results: 1
			};

			(clientTMDB.getMovieDetailsSimple as any).mockResolvedValue(mockMovieDetails);
			(clientTMDB.discoverMovies as any).mockResolvedValue(mockDiscoverResponse);

			const result = await service.getRecommendationsFromFavorites(mockFavorites);

			expect(clientTMDB.getMovieDetailsSimple).toHaveBeenCalledWith(550);
			expect(result).toHaveLength(1);
			expect(result[0].id).toBe(807);
		});

		it('should handle errors and fallback to popular movies', async () => {
			const mockFavorites: UserFavorite[] = [
				{
					id: '1',
					user_id: 'user123',
					movie_id: 550,
					movie_title: 'Fight Club',
					movie_poster: '/fight_club.jpg',
					movie_release_date: '1999-10-15',
					movie_rating: 8.8,
					created_at: '2023-01-01T00:00:00Z',
					updated_at: '2023-01-01T00:00:00Z'
				}
			];

			const mockPopularMovies: Movie[] = [
				{
					id: 999,
					title: 'Fallback Movie',
					overview: 'Fallback overview',
					poster_path: '/fallback.jpg',
					backdrop_path: '/fallback_backdrop.jpg',
					release_date: '2023-01-01',
					vote_average: 7.5,
					vote_count: 500,
					genre_ids: [28],
					adult: false,
					original_language: 'en',
					original_title: 'Fallback Movie',
					popularity: 80.0,
					video: false
				}
			];

			const mockPopularResponse: TMDBResponse<Movie> = {
				page: 1,
				results: mockPopularMovies,
				total_pages: 1,
				total_results: 1
			};

			(clientTMDB.getMovieDetailsSimple as any).mockRejectedValue(new Error('API Error'));
			(clientTMDB.getPopularMovies as any).mockResolvedValue(mockPopularResponse);

			const result = await service.getRecommendationsFromFavorites(mockFavorites);

			expect(result).toEqual(mockPopularMovies);
		});
	});
	describe('private methods', () => {
		it('should call getPopularMovies method', async () => {
			const mockPopularMovies: Movie[] = [
				{
					id: 1,
					title: 'Popular Movie',
					overview: 'Popular overview',
					poster_path: '/popular.jpg',
					backdrop_path: '/popular_backdrop.jpg',
					release_date: '2023-01-01',
					vote_average: 8.0,
					vote_count: 1000,
					genre_ids: [28],
					adult: false,
					original_language: 'en',
					original_title: 'Popular Movie',
					popularity: 100.0,
					video: false
				}
			];

			const mockResponse: TMDBResponse<Movie> = {
				page: 1,
				results: mockPopularMovies,
				total_pages: 1,
				total_results: 1
			};

			(clientTMDB.getPopularMovies as any).mockResolvedValue(mockResponse);

			const result = await (service as any).getPopularMovies();
			expect(result).toEqual(mockPopularMovies);
		});
	});
});
