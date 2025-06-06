/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClientTMDBService } from './client-tmdb.js';
import type { Movie, TMDBResponse } from '$lib/types/movie.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ClientTMDBService', () => {
	let service: ClientTMDBService;

	beforeEach(() => {
		service = new ClientTMDBService();
		vi.clearAllMocks();
	});

	describe('getPopularMovies', () => {
		it('should fetch popular movies successfully', async () => {
			const mockMovies: Movie[] = [
				{
					id: 1,
					title: 'Test Movie 1',
					overview: 'Test overview 1',
					poster_path: '/poster1.jpg',
					backdrop_path: '/backdrop1.jpg',
					release_date: '2023-01-01',
					vote_average: 8.5,
					vote_count: 1000,
					genre_ids: [28, 12],
					adult: false,
					original_language: 'en',
					original_title: 'Test Movie 1',
					popularity: 100.5,
					video: false
				},
				{
					id: 2,
					title: 'Test Movie 2',
					overview: 'Test overview 2',
					poster_path: '/poster2.jpg',
					backdrop_path: '/backdrop2.jpg',
					release_date: '2023-02-01',
					vote_average: 7.8,
					vote_count: 800,
					genre_ids: [35, 18],
					adult: false,
					original_language: 'en',
					original_title: 'Test Movie 2',
					popularity: 85.3,
					video: false
				}
			];

			const mockResponse: TMDBResponse<Movie> = {
				page: 1,
				results: mockMovies,
				total_pages: 10,
				total_results: 200
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					success: true,
					data: mockResponse
				})
			});

			const result = await service.getPopularMovies(1);

			expect(mockFetch).toHaveBeenCalledWith('/api/movies/popular?page=1');
			expect(result).toEqual(mockResponse);
			expect(result.results).toHaveLength(2);
		});

		it('should handle API errors', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error',
				json: async () => ({
					success: false,
					error: 'TMDB API error'
				})
			});

			await expect(service.getPopularMovies()).rejects.toThrow();
		});
	});

	describe('searchMovies', () => {
		it('should search movies successfully', async () => {
			const mockMovies: Movie[] = [
				{
					id: 3,
					title: 'Search Result 1',
					overview: 'Search overview 1',
					poster_path: '/search1.jpg',
					backdrop_path: '/search_backdrop1.jpg',
					release_date: '2023-03-01',
					vote_average: 9.0,
					vote_count: 1500,
					genre_ids: [14, 12],
					adult: false,
					original_language: 'en',
					original_title: 'Search Result 1',
					popularity: 120.8,
					video: false
				}
			];

			const mockResponse: TMDBResponse<Movie> = {
				page: 1,
				results: mockMovies,
				total_pages: 5,
				total_results: 50
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					success: true,
					data: mockResponse
				})
			});
			const result = await service.searchMovies('test query', 1);

			expect(mockFetch).toHaveBeenCalledWith('/api/movies/search?q=test+query&page=1');
			expect(result).toEqual(mockResponse);
		});
	});

	describe('getMovieDetails', () => {
		it('should fetch movie details successfully', async () => {
			const mockMovieDetails = {
				id: 1,
				title: 'Test Movie Details',
				original_title: 'Test Movie Details',
				overview: 'Detailed overview',
				tagline: 'Test tagline',
				poster_path: '/details_poster.jpg',
				backdrop_path: '/details_backdrop.jpg',
				release_date: '2023-04-01',
				runtime: 120,
				vote_average: 8.2,
				vote_count: 2000,
				popularity: 150.5,
				adult: false,
				video: false,
				original_language: 'en',
				status: 'Released' as const,
				budget: 50000000,
				revenue: 150000000,
				homepage: 'https://example.com',
				imdb_id: 'tt1234567',
				genres: [
					{ id: 28, name: 'Action' },
					{ id: 12, name: 'Adventure' }
				],
				production_companies: [],
				production_countries: [],
				spoken_languages: [],
				belongs_to_collection: null
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					success: true,
					data: mockMovieDetails
				})
			});

			const result = await service.getMovieDetails(1);

			expect(mockFetch).toHaveBeenCalledWith('/api/movies/1');
			expect(result).toEqual(mockMovieDetails);
		});
	});

	describe('private methods', () => {
		it('should call getPopularMovies method', async () => {
			const mockResponse: TMDBResponse<Movie> = {
				page: 1,
				results: [],
				total_pages: 1,
				total_results: 0
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					success: true,
					data: mockResponse
				})
			});

			const result = await (service as any).getPopularMovies();
			expect(result).toEqual(mockResponse);
		});
	});
});
