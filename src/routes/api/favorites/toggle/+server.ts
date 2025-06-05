import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSupabaseServerClient } from '$lib/helpers/auth/supabaseClient.js';
import { logError, logInfo } from '$lib/helpers/logger/logger.js';
import type { FavoriteRequest, FavoriteToggleResponse } from '$lib/types/favorites.js';

export const POST: RequestHandler = async (event) => {
  const startTime = Date.now();
  
  try {  
    const supabase = createSupabaseServerClient(event);
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      logError('FAVORITES_TOGGLE_UNAUTHORIZED', {
        error: authError?.message || 'No user found',
        duration: Date.now() - startTime
      });
      
      return json({
        success: false,
        is_favorited: false,
        error: 'Authentication required'
      } as FavoriteToggleResponse, { status: 401 });
    }

    // Parse request body
    let favoriteData: FavoriteRequest;
    try {
      favoriteData = await event.request.json();
    } catch (parseError) {
        logError('FAVORITES_TOGGLE_PARSE_ERROR', {
            error: parseError instanceof Error ? parseError.message : 'Unknown parse error',
            duration: Date.now() - startTime
        });
      return json({
        success: false,
        is_favorited: false,
        error: 'Invalid request data'
      } as FavoriteToggleResponse, { status: 400 });
    }
    
    if (!favoriteData.movie_id || !favoriteData.movie_title) {
      return json({
        success: false,
        is_favorited: false,
        error: 'Movie ID and title are required'
      } as FavoriteToggleResponse, { status: 400 });
    }

    const { data: testQuery, error: testError } = await supabase
      .from('user_favorites')
      .select('count')
      .limit(1);
    
    if (testError) {
        logError('FAVORITES_TOGGLE_DB_ERROR', {
            error: testError.message,
            message: "test query failed: " + testQuery,
            errorCode: testError.code,
            userId: user.id,
            movieId: favoriteData.movie_id,
            duration: Date.now() - startTime
        });
      return json({
        success: false,
        is_favorited: false,
        error: 'Database connection failed: ' + testError.message
      } as FavoriteToggleResponse, { status: 500 });
    }

    // Check if movie is already favorited
    logInfo('FAVORITES_TOGGLE_CHECK', {
      userId: user.id,
        movieId: favoriteData.movie_id,
        movieTitle: favoriteData.movie_title,
        duration: Date.now() - startTime
    });
    const { data: existing, error: checkError } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('movie_id', favoriteData.movie_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      logError('FAVORITES_TOGGLE_CHECK_ERROR', {
        error: checkError.message,
        errorCode: checkError.code,
        userId: user.id,
        movieId: favoriteData.movie_id,
        duration: Date.now() - startTime
      });
      
      return json({
        success: false,
        is_favorited: false,
        error: 'Failed to check favorite status: ' + checkError.message
      } as FavoriteToggleResponse, { status: 500 });
    }


    if (existing) {
      // Remove from favorites
      const { error: deleteError } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', favoriteData.movie_id);

      if (deleteError) {
        logError('FAVORITES_REMOVE_ERROR', {
          error: deleteError.message,
          errorCode: deleteError.code,
          userId: user.id,
          movieId: favoriteData.movie_id,
          duration: Date.now() - startTime
        });
        
        return json({
          success: false,
          is_favorited: true,
          error: 'Failed to remove from favorites: ' + deleteError.message
        } as FavoriteToggleResponse, { status: 500 });
      }

      logInfo('FAVORITES_REMOVED', {
        userId: user.id,
        movieId: favoriteData.movie_id,
        movieTitle: favoriteData.movie_title,
        duration: Date.now() - startTime
      });

      return json({
        success: true,
        is_favorited: false,
        message: 'Removed from favorites'
      } as FavoriteToggleResponse);

    } else {
      // Add to favorites
      const insertData = {
        user_id: user.id,
        movie_id: favoriteData.movie_id,
        movie_title: favoriteData.movie_title,
        movie_poster: favoriteData.movie_poster || null,
        movie_release_date: favoriteData.movie_release_date || null,
        movie_rating: favoriteData.movie_rating || null
      };
      
      
      const { error: insertError } = await supabase
        .from('user_favorites')
        .insert(insertData);

      if (insertError) {
        logError('FAVORITES_ADD_ERROR', {
          error: insertError.message,
          errorCode: insertError.code,
          errorDetails: insertError.details,
          errorHint: insertError.hint,
          insertData,
          userId: user.id,
          movieId: favoriteData.movie_id,
          duration: Date.now() - startTime
        });
        
        return json({
          success: false,
          is_favorited: false,
          error: 'Failed to add to favorites: ' + insertError.message + (insertError.details ? ' - ' + insertError.details : '')
        } as FavoriteToggleResponse, { status: 500 });
      }

      logInfo('FAVORITES_ADDED', {
        userId: user.id,
        movieId: favoriteData.movie_id,
        movieTitle: favoriteData.movie_title,
        duration: Date.now() - startTime
      });

      return json({
        success: true,
        is_favorited: true,
        message: 'Added to favorites'
      } as FavoriteToggleResponse);
    }

  } catch (error) {
    logError('FAVORITES_TOGGLE_ERROR', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration: Date.now() - startTime
    });
    
    return json({
      success: false,
      is_favorited: false,
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    } as FavoriteToggleResponse, { status: 500 });
  }
};