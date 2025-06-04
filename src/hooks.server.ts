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
  //'/reset-password',
];

const ADMIN_ROUTES = [
  '/admin' // Future update?
];

// We can determine if a route is public by checking if it's NOT in the other arrays

// Interface for authentication result
interface AuthResult {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  isVerified: boolean;
}

export const handle: Handle = async ({ event, resolve }) => {
  const startTime = Date.now();
  const requestedPath = event.url.pathname;
  const userAgent = event.request.headers.get('user-agent') || 'Unknown';
  console.log(`Handling request for: ${requestedPath} from ${userAgent}`);
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
  console.log(`Client IP: ${clientIP}`);
  // Log the incoming request
  logAuth('REQUEST_RECEIVED', {
    path: requestedPath === '/' ? '/home' : requestedPath,
    clientIP,
    userAgent: userAgent.substring(0, 100),
    timestamp: new Date().toISOString()
  });

  try {
    // Check authentication status
    const authResult = await checkAuthentication(event);
    
    // Set locals with proper typing
    event.locals.user = authResult.user;
    event.locals.isAuthenticated = authResult.isAuthenticated;
    event.locals.isAdmin = authResult.isAdmin;
    event.locals.isVerified = authResult.isVerified;

    // Handle route protection logic
    const redirectResponse = handleRouteProtection(
      requestedPath, 
      authResult, 
      clientIP, 
      event.url.searchParams
    );
    
    if (redirectResponse) {
      return redirectResponse;
    }

    // Continue with the request
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
    
    logError('HOOKS_SERVER_ERROR', {
      errorId,
      path: requestedPath,
      clientIP,
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString()
    });

    // Proper error handling for SvelteKit
    if (dev) {
      return error(500, `Server error: ${err instanceof Error ? err.message : 'Unknown error'} (ID: ${errorId})`);
    }

    return error(500, `An internal server error occurred. Please try again later. (ID: ${errorId})`);
  }
};

/**
 * Check if user is authenticated using Supabase
 */
async function checkAuthentication(event: RequestEvent): Promise<AuthResult> {
  try {
    const supabase = createSupabaseServerClient(event);
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      logError('SESSION_CHECK_ERROR', {
        error: sessionError.message,
        timestamp: new Date().toISOString()
      });
      return {
        isAuthenticated: false,
        user: null,
        isAdmin: false,
        isVerified: false
      };
    }

    if (!session || !session.user) {
      return {
        isAuthenticated: false,
        user: null,
        isAdmin: false,
        isVerified: false
      };
    }

    // Get user profile data for additional checks
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, email_verified, first_name, last_name')
      .eq('id', session.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no rows returned
      logError('PROFILE_CHECK_ERROR', {
        userId: session.user.id,
        error: profileError.message,
        timestamp: new Date().toISOString()
      });
    }

    const isAdmin = profile?.role === 'admin' || session.user.app_metadata?.role === 'admin';
    const isVerified = session.user.email_confirmed_at !== null || profile?.email_verified === true;

    logAuth('USER_AUTHENTICATED', {
      userId: session.user.id,
      email: session.user.email,
      isAdmin,
      isVerified,
      provider: session.user.app_metadata?.provider || 'email',
      timestamp: new Date().toISOString()
    });

    return {
      isAuthenticated: true,
      user: session.user,
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
 */
function handleRouteProtection(
  requestedPath: string,
  authResult: AuthResult,
  clientIP: string,
  searchParams: URLSearchParams
): Response | null {
  const { isAuthenticated, user, isAdmin, isVerified } = authResult;

  // Check if route requires authentication
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
      return redirect(303, `/login?redirectTo=${encodeURIComponent(requestedPath)}`);
    }

    if (!isAdmin) {
      logSecurity('FORBIDDEN_ADMIN_ACCESS', {
        path: requestedPath,
        clientIP,
        userId: user?.id,
        reason: 'Not admin user'
      });
      
      return error(403, 'Access Denied: You do not have permission to access this page. Admin privileges required.');
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
      return error(401, 'Authentication required. You must be logged in to access this resource.');
    }

    // Redirect to login with return path
    const redirectTo = requestedPath === '/dashboard' ? '/dashboard' : requestedPath;
    return redirect(303, `/login?redirectTo=${encodeURIComponent(redirectTo)}`);
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

    return redirect(303, intendedDestination);
  }

  // Handle email verification requirements
  if (isAuthenticated && !isVerified) {
    const verificationExemptPaths = [
      '/verify-email',
      '/logout',
      '/api/auth/verify',
      '/api/auth/resend-verification'
    ];

    const isExempt = verificationExemptPaths.some(path => requestedPath.startsWith(path));

    if (!isExempt && requiresAuth) {
      logSecurity('UNVERIFIED_USER_ACCESS', {
        path: requestedPath,
        userId: user?.id,
        email: user?.email
      });

      return redirect(303, `/verify-email?email=${encodeURIComponent(user?.email || '')}`);
    }
  }

  // Handle special redirects
  if (requestedPath === '/') {
    if (isAuthenticated) {
      // Authenticated users go to dashboard
      return redirect(303, '/dashboard');
    }
    // Non-authenticated users stay on landing page
  }

  // No redirect needed
  return null;
}