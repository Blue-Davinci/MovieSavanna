import { redirect, error, type Handle } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/helpers/auth/supabaseClient.js';
import { logAuth, logSecurity, logError, generateErrorId } from '$lib/helpers/logger/logger.js';
import { dev } from '$app/environment';
import type { User } from '@supabase/supabase-js';
import type { RequestEvent } from '@sveltejs/kit';

// Define route categories
const PROTECTED_ROUTES = [
  '/dashboard',
  '/logout'
];

const AUTH_ROUTES = [
  '/login',
  '/signup'
  //'/verify-email'
];

const ADMIN_ROUTES = [
  '/admin'
];

/*Public routes that both authenticated and non-authenticated users can access
const PUBLIC_ROUTES = [
  '/',
  '/movies',
  '/search',
  '/about',
  '/contact',
  '/help',
  '/terms',
  '/privacy',
  '/status'
];*/

// Interface for authentication result
interface AuthResult {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  isVerified: boolean;
}

// Custom response interface to avoid try/catch issues
interface RouteAction {
  type: 'redirect' | 'error' | 'continue';
  status?: number;
  location?: string;
  message?: string;
}

export const handle: Handle = async ({ event, resolve }) => {
  const startTime = Date.now();
  const requestedPath = event.url.pathname;
  const userAgent = event.request.headers.get('user-agent') || 'Unknown';
  
  // Get client IP address with fallback
  let clientIP: string;
  try {
    clientIP = event.getClientAddress();
  } catch (err) {
    const forwardedFor = event.request.headers.get('x-forwarded-for');
    clientIP = forwardedFor ? forwardedFor.split(',')[0].trim() : 'Unknown';
    
    logError('CLIENT_IP_ERROR', {
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }

  // Log the incoming request
  logAuth('REQUEST_RECEIVED', {
    path: requestedPath === '/' ? '/home' : requestedPath,
    clientIP,
    userAgent: userAgent.substring(0, 100),
    timestamp: new Date().toISOString()
  });

  // Declare variables outside try block to avoid scope issues allowing
  // us to avoid the catch triggering on redirects
  let authResult: AuthResult;
  let routeAction: RouteAction = { type: 'continue' };

  try {
    // Check authentication status
    authResult = await checkAuthentication(event);
    
    // Set locals with proper typing
    event.locals.user = authResult.user;
    event.locals.isAuthenticated = authResult.isAuthenticated;
    event.locals.isAdmin = authResult.isAdmin;
    event.locals.isVerified = authResult.isVerified;
    
    // Get route action but don't execute redirects/errors yet
    routeAction = handleRouteProtection(
      requestedPath, 
      authResult, 
      clientIP, 
      event.url.searchParams
    );

  } catch (err) {
    const errorId = generateErrorId();
    
    logError('HOOKS_SERVER_ERROR', {
      errorId,
      path: requestedPath,
      clientIP,
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString()
    });

    // Return a generic error response
    if (dev) {
      return error(500, `Server error: ${err instanceof Error ? err.message : 'Unknown error'} (ID: ${errorId})`);
    }

    return error(500, `An internal server error occurred. Please try again later. (ID: ${errorId})`);
  }

  // Handle redirects and errors OUTSIDE the try block
  if (routeAction.type === 'redirect' && routeAction.location) {
    return redirect(routeAction.status || 303, routeAction.location);
  }
  
  if (routeAction.type === 'error') {
    return error(routeAction.status || 500, routeAction.message || 'Access denied');
  }

  // Continue with the request
  try {
    const response = await resolve(event);
    
    // Log successful request completion
    const duration = Date.now() - startTime;
    logAuth('REQUEST_COMPLETED', {
      path: requestedPath,
      duration,
      status: response.status,
      authenticated: authResult.isAuthenticated,
      userId: authResult.user?.id || 'anonymous'
    });

    return response;

  } catch (err) {
    const errorId = generateErrorId();
    
    logError('RESOLVE_ERROR', {
      errorId,
      path: requestedPath,
      clientIP,
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString()
    });

    if (dev) {
      error(500, `Resolve error: ${err instanceof Error ? err.message : 'Unknown error'} (ID: ${errorId})`);
    }

    error(500, `An internal server error occurred. Please try again later. (ID: ${errorId})`);
  }

};

/**
 * Check if user is authenticated using secure getUser() method
 * Fixes the initial get session issue
 */
async function checkAuthentication(event: RequestEvent): Promise<AuthResult> {
  try {
    const supabase = createSupabaseServerClient(event);
    
    // Use getUser() instead of getSession() for proper auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      logError('USER_CHECK_ERROR', {
        error: userError.message,
        timestamp: new Date().toISOString()
      });
      return {
        isAuthenticated: false,
        user: null,
        isAdmin: false,
        isVerified: false
      };
    }

    if (!user) {
      return {
        isAuthenticated: false,
        user: null,
        isAdmin: false,
        isVerified: false
      };
    }

    // ToDo: Remove this if i'll have not implemented it -->> Get user profile data for additional checks
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, email_verified, first_name, last_name')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no rows returned
      logError('PROFILE_CHECK_ERROR', {
        userId: user.id,
        error: profileError.message,
        timestamp: new Date().toISOString()
      });
    }

    const isAdmin = profile?.role === 'admin' || user.app_metadata?.role === 'admin';
    const isVerified = user.email_confirmed_at !== null || profile?.email_verified === true;

    logAuth('USER_AUTHENTICATED', {
      userId: user.id,
      email: user.email,
      isAdmin,
      isVerified,
      provider: user.app_metadata?.provider || 'email',
      timestamp: new Date().toISOString()
    });

    return {
      isAuthenticated: true,
      user: user,
      isAdmin,
      isVerified
    };

  } catch (err) {
    logError('AUTH_CHECK_ERROR', {
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString()
    });

    return {
      isAuthenticated: false,
      user: null,
      isAdmin: false,
      isVerified: false
    };
  }
}

/**
 * Handle route protection and redirects
 * This function only returns Response objects, doesn't throw
 */
function handleRouteProtection(
  requestedPath: string,
  authResult: AuthResult,
  clientIP: string,
  searchParams: URLSearchParams
): RouteAction {
  const { isAuthenticated, user, isAdmin, isVerified } = authResult;

  // Check route types
  const requiresAuth = PROTECTED_ROUTES.some(route => requestedPath.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some(route => requestedPath.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some(route => requestedPath.startsWith(route));

  // Handle admin routes
  if (isAdminRoute) {
    if (!isAuthenticated) {
      logSecurity('UNAUTHORIZED_ADMIN_ACCESS', {
        path: requestedPath,
        clientIP,
        reason: 'Not authenticated'
      });
      return {
        type: 'redirect',
        status: 303,
        location: `/login?redirectTo=${encodeURIComponent(requestedPath)}`
      };
    }

    if (!isAdmin) {
      logSecurity('FORBIDDEN_ADMIN_ACCESS', {
        path: requestedPath,
        clientIP,
        userId: user?.id,
        reason: 'Not admin user'
      });
      
      return {
        type: 'error',
        status: 403,
        message: 'Access Denied: You do not have permission to access this page. Admin privileges required.'
      };
    }
  }

  // Handle protected routes
  if (requiresAuth && !isAuthenticated) {
    logSecurity('UNAUTHORIZED_ACCESS_ATTEMPT', {
      path: requestedPath,
      clientIP,
      reason: 'Not authenticated'
    });

    // Special handling for API routes
    if (requestedPath.startsWith('/api')) {
      return {
        type: 'error',
        status: 401,
        message: 'Authentication required. You must be logged in to access this resource.'
      };
    }

    // Redirect to login with return path
    const redirectTo = requestedPath === '/dashboard' ? '/dashboard' : requestedPath;
    return {
      type: 'redirect',
      status: 303,
      location: `/login?redirectTo=${encodeURIComponent(redirectTo)}`
    };
  }

  // Handle auth routes when already authenticated
  if (isAuthenticated && isAuthRoute) {
    const intendedDestination = searchParams.get('redirectTo') || '/dashboard';
    
    logAuth('AUTHENTICATED_USER_REDIRECT', {
      from: requestedPath,
      to: intendedDestination,
      userId: user?.id,
      reason: 'Already authenticated'
    });

    return {
      type: 'redirect',
      status: 303,
      location: intendedDestination
    };
  }

  // Handle email verification requirements for protected routes
  if (isAuthenticated && !isVerified && requiresAuth) {
    const verificationExemptPaths = [
      '/verify-email',
      '/logout',
      '/api/auth/verify',
      '/api/auth/resend-verification'
    ];

    const isExempt = verificationExemptPaths.some(path => requestedPath.startsWith(path));

    if (!isExempt) {
      logSecurity('UNVERIFIED_USER_ACCESS', {
        path: requestedPath,
        userId: user?.id,
        email: user?.email
      });

      return {
        type: 'redirect',
        status: 303,
        location: `/verify-email?email=${encodeURIComponent(user?.email || '')}`
      };
    }
  }

  // Continue normally - no action needed
  return { type: 'continue' };
}