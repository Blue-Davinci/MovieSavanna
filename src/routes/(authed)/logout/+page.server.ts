import { redirect, type RequestEvent } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/helpers/auth/supabaseClient.js';
import { logAuth, logError, generateErrorId } from '$lib/helpers/logger/logger.js';

export const actions = {
  default: async (event: RequestEvent) => {
    const { getClientAddress } = event;
    const clientIP = getClientAddress();
    
    try {
      const supabase = createSupabaseServerClient(event);
      
      // Get current session before logout for logging
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      const userEmail = session?.user?.email;

      // Perform logout
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        const errorId = generateErrorId();
        
        logError('LOGOUT_ERROR', {
          errorId,
          userId,
          clientIP,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        
        // Even if logout fails, redirect to home for security
        return redirect(303, '/?logout=failed');
      }
      // ToDo: Implement actions in our Home Page to handle logout success/failure messages
      // Log successful logout
      logAuth('USER_LOGOUT_SUCCESS', {
        userId,
        email: userEmail,
        clientIP,
        timestamp: new Date().toISOString()
      });

      // Clear any additional cookies if needed
      event.cookies.delete('user-remember-preference', { path: '/' });
      
      // Redirect to home page with success message
      return redirect(303, '/?logout=success');

    } catch (error) {
      // If it's already a redirect, re-throw it
      if (error instanceof Response) {
        return error;
      }

      const errorId = generateErrorId();
      
      logError('LOGOUT_UNEXPECTED_ERROR', {
        errorId,
        clientIP,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });

      // For security, always redirect even on unexpected errors
      return redirect(303, '/?logout=error');
    }
  }
};