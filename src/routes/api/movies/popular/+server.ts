import { json } from '@sveltejs/kit';
import { tmdbService } from '$lib/api/tmdb.js';
import type { RequestHandler } from './$types.js';
import { logError } from '$lib/helpers/logger/logger.js';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const page = parseInt(url.searchParams.get('page') || '1');
    
    if (page < 1 || page > 1000) {
      return json({ error: 'Page must be between 1 and 1000' }, { status: 400 });
    }

    const data = await tmdbService.getPopularMovies(page);
    
    return json({
      success: true,
      data,
      cache_stats: tmdbService.getCacheStats()
    });
  } catch (error) {
    logError('Popular movies API error', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch popular movies'
    }, { status: 500 });
  }
};