import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSupabaseServerClient } from '$lib/helpers/auth/supabaseClient.js';
import { logError, logInfo } from '$lib/helpers/logger/logger.js';
import type { FavoritesResponse } from '$lib/types/favorites.js';

export const GET: RequestHandler = async (event) => {
  const startTime = Date.now();
  
  try {
    const supabase = createSupabaseServerClient(event);
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      logError('FAVORITES_GET_UNAUTHORIZED', {
        error: authError?.message || 'No user found',
        duration: Date.now() - startTime
      });
      
      return json({
        success: false,
        error: 'Authentication required'
      } as FavoritesResponse, { status: 401 });
    }

    // Get user's favorites
    const { data: favorites, error: dbError } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (dbError) {
      logError('FAVORITES_GET_DB_ERROR', {
        error: dbError.message,
        userId: user.id,
        duration: Date.now() - startTime
      });
      
      return json({
        success: false,
        error: 'Failed to fetch favorites'
      } as FavoritesResponse, { status: 500 });
    }

    logInfo('FAVORITES_GET_SUCCESS', {
      userId: user.id,
      count: favorites?.length || 0,
      duration: Date.now() - startTime
    });

    return json({
      success: true,
      favorites: favorites || []
    } as FavoritesResponse);

  } catch (error) {
    logError('FAVORITES_GET_ERROR', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - startTime
    });
    
    return json({
      success: false,
      error: 'Internal server error'
    } as FavoritesResponse, { status: 500 });
  }
};