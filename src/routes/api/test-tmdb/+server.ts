import { json } from '@sveltejs/kit';
import { tmdbService } from '$lib/api/tmdb.js';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async () => {
  try {
    console.log('🧪 Testing TMDB API connection...');
    
    // Test popular movies
    const popularMovies = await tmdbService.getPopularMovies(1);
    
    return json({
      success: true,
      message: 'TMDB API connection successful!',
      sample_data: {
        total_results: popularMovies.total_results,
        total_pages: popularMovies.total_pages,
        sample_movie: popularMovies.results[0]
      },
      cache_stats: tmdbService.getCacheStats()
    });
  } catch (error) {
    console.error('TMDB API test failed:', error);
    
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'TMDB API test failed'
    }, { status: 500 });
  }
};