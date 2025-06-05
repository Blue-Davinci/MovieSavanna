import type { LayoutServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/helpers/auth/supabaseClient.js';

export const load: LayoutServerLoad = async (event) => {
  try {
    const supabase = createSupabaseServerClient(event);
    
    // Get user session
    const { data: { user } } = await supabase.auth.getUser();

    return {
      userInformation: {
        isAuthenticated: !!user,
        isAdmin: user?.app_metadata?.role === 'admin' || false,
        user: user ? {
          id: user.id,
          email: user.email,
          // Additional safe properties with null checks
          emailConfirmed: user.email_confirmed_at ? true : false,
          avatar: user.user_metadata?.avatar_url || null
        } : null
      }
    };
  } catch (error) {
    // When auth error occurs, return unauthenticated state
    console.error('Layout server load error:', error);
    
    return {
      userInformation: {
        isAuthenticated: false,
        isAdmin: false,
        user: null
      }
    };
  }
};