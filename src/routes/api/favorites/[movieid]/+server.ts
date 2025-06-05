import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSupabaseServerClient } from '$lib/helpers/auth/supabaseClient.js';
import { logError, logInfo } from '$lib/helpers/logger/logger.js';

export const GET: RequestHandler = async (event) => {
  const startTime = Date.now();
  const movieId = parseInt(event.params.movieid);
  
  if (!movieId || isNaN(movieId)) {
    return json({
      success: false,
      is_favorited: false,
      error: 'Invalid movie ID'
    }, { status: 400 });
  }
  
  try {
    const supabase = createSupabaseServerClient(event);
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      // Return false for unauthenticated users (not an error)
      return json({
        success: true,
        is_favorited: false
      });
    }

    // Check if movie is favorited
    const { data: favorite, error: dbError } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('movie_id', movieId)
      .single();

    if (dbError && dbError.code !== 'PGRST116') {
      logError('FAVORITES_CHECK_ERROR', {
        error: dbError.message,
        userId: user.id,
        movieId,
        duration: Date.now() - startTime
      });
      
      return json({
        success: false,
        is_favorited: false,
        error: 'Failed to check favorite status'
      }, { status: 500 });
    }

    const isFavorited = !!favorite;

    logInfo('FAVORITES_CHECK_SUCCESS', {
      userId: user.id,
      movieId,
      isFavorited,
      duration: Date.now() - startTime
    });

    return json({
      success: true,
      is_favorited: isFavorited
    });

  } catch (error) {
    logError('FAVORITES_CHECK_ERROR', {
      error: error instanceof Error ? error.message : 'Unknown error',
      movieId,
      duration: Date.now() - startTime
    });
    
    return json({
      success: false,
      is_favorited: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
};