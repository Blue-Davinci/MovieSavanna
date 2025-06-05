import { json } from '@sveltejs/kit';
import { tmdbService } from '$lib/api/tmdb.js';
import type { RequestHandler } from './$types.js';
import { logError } from '$lib/helpers/logger/logger.js';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const query = url.searchParams.get('q');
    const page = parseInt(url.searchParams.get('page') || '1');
    
    if (!query || query.trim().length === 0) {
      return json({ error: 'Search query is required' }, { status: 400 });
    }

    if (query.trim().length < 2) {
      return json({ error: 'Search query must be at least 2 characters' }, { status: 400 });
    }

    if (page < 1 || page > 1000) {
      return json({ error: 'Page must be between 1 and 1000' }, { status: 400 });
    }

    const data = await tmdbService.searchMovies(query, page);
    
    return json({
      success: true,
      data,
      cache_stats: tmdbService.getCacheStats()
    });
  } catch (error) {
    logError('Movie search API error', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search movies'
    }, { status: 500 });
  }
};