import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { enhancedLoginSchema } from '$lib/schemas/schema';
import { fail, type RequestEvent } from '@sveltejs/kit'; // redirect
import { createSupabaseServerClient } from '$lib/helpers/auth/supabaseClient.js';
import { dev } from '$app/environment';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { logAuth, logSecurity, logError, generateErrorId } from '$lib/helpers/logger/logger.js';

// Types for better code organization
interface AuthResult {
  success: boolean;
  user?: User | null;
  session?: Session | null;
  error?: string;
  requiresMFA?: boolean;
  requiresActivation?: boolean;
}

interface ProcessedUserData {
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  uid: string;
  display_name?: string;
  phone?: string;
  provider: string;
  created_at?: string;
  last_sign_in_at?: string;
}

// Rate limiting storage (in production, use Redis)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const load = async ({ url, locals }) => {
  // Check if user is already logged in
  /*if (locals.user) {
    const redirectTo = url.searchParams.get('redirectTo') || '/dashboard';
    redirect(303, redirectTo);
  }
  */
 console.log("Locals: ", locals);
  const form = await superValidate(zod(enhancedLoginSchema));
  return { 
    form,
    redirectTo: url.searchParams.get('redirectTo') || '/'
  };
};

export const actions = {
  default: async (event: RequestEvent) => {
    const startTime = Date.now();
    const { request, getClientAddress } = event;
    const clientIP = getClientAddress();
      // Validate form data
      const form = await superValidate(request, zod(enhancedLoginSchema));
      
      if (!form.valid) {
        logSecurity('INVALID_FORM_DATA', { clientIP, errors: form.errors });
        return fail(400, { form });
      }
          
    try {

      const { email, password, rememberMe } = form.data;

      // Rate limiting check
      const rateLimitResult = checkRateLimit(email, clientIP);
      if (!rateLimitResult.allowed) {
        logSecurity('RATE_LIMIT_EXCEEDED', { email, clientIP, attempts: rateLimitResult.attempts });
        return message(form, {
          success: false,
          message: `Too many login attempts. Please try again in ${Math.ceil(rateLimitResult.waitTime / 60000)} minutes.`
        });
      }

      // Input sanitization and validation
      const sanitizedEmail = email.toLowerCase().trim();
      
      logAuth('LOGIN_ATTEMPT', { email: sanitizedEmail, clientIP, userAgent: request.headers.get('user-agent') });

      // Authenticate with Supabase
      const authResult = await authenticateUser(event, sanitizedEmail, password, rememberMe);

      // Handle authentication result
      if (!authResult.success) {
        recordFailedAttempt(sanitizedEmail, clientIP);
        
        if (authResult.requiresActivation) {
          logAuth('LOGIN_ACTIVATION_REQUIRED', { email: sanitizedEmail, clientIP });
          return message(form, {
            success: false,
            message: 'activation_required'
          });
        }

        if (authResult.requiresMFA) {
          logAuth('LOGIN_MFA_REQUIRED', { email: sanitizedEmail, clientIP });
          return message(form, {
            success: false,
            message: 'mfa_required',
            email: sanitizedEmail,
            token: authResult.session?.access_token
          });
        }

        logAuth('LOGIN_FAILED', { email: sanitizedEmail, clientIP, error: authResult.error });
        return message(form, {
          success: false,
          message: authResult.error || 'Login failed. Please try again.'
        });
      }

      // Success - clear failed attempts
      clearFailedAttempts(sanitizedEmail, clientIP);

      // Process user data
      const userData = processUserData(authResult.user!);
      
      // Log successful login
      logAuth('LOGIN_SUCCESS', {
        userId: userData.uid,
        email: sanitizedEmail,
        clientIP,
        provider: userData.provider,
        duration: Date.now() - startTime,
        rememberMe
      });

      return message(form, {
        success: true,
        message: 'Login successful!',
        data: userData
      });

    } catch (error) {
      const errorId = generateErrorId();
      
      logError('UNEXPECTED_LOGIN_ERROR', {
        errorId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        clientIP,
        timestamp: new Date().toISOString()
      });

      return message(form, {
        success: false,
        message: dev 
          ? `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}` 
          : 'An unexpected error occurred. Please try again.'
      });
    }
  }
};

// Helper Functions

async function authenticateUser(event: RequestEvent, email: string, password: string, rememberMe: boolean): Promise<AuthResult> {
  try {
    const supabase = createSupabaseServerClient(event);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return handleAuthError(error);
    }

    if (!data.user || !data.session) {
      return { success: false, error: 'Authentication failed - no user data returned' };
    }

    // Store remember preference
    if (rememberMe) {
      event.cookies.set('user-remember-preference', 'true', {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365 // 1 year
      });
    } else {
      event.cookies.delete('user-remember-preference', { path: '/' });
    }

    // Check for MFA
    if (data.user.factors && data.user.factors.length > 0) {
      return {
        success: false,
        requiresMFA: true,
        session: data.session
      };
    }

    return {
      success: true,
      user: data.user,
      session: data.session
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication service error'
    };
  }
}

function handleAuthError(error: AuthError): AuthResult {
  const errorMap: Record<string, { message: string; requiresActivation?: boolean }> = {
    'Invalid login credentials': { message: 'Invalid email or password' },
    'Email not confirmed': { message: 'activation_required', requiresActivation: true },
    'Too many requests': { message: 'Too many login attempts. Please try again later.' },
    'User not found': { message: 'Invalid email or password' },
    'Wrong password': { message: 'Invalid email or password' },
    'Signup not allowed': { message: 'Account registration is currently disabled' },
  };

  const errorInfo = errorMap[error.message] || { message: 'Login failed. Please try again.' };
  
  return {
    success: false,
    error: errorInfo.message,
    requiresActivation: errorInfo.requiresActivation || false
  };
}

function processUserData(user: User): ProcessedUserData {
  const displayName = user.user_metadata?.display_name ||
                     user.user_metadata?.full_name ||
                     user.user_metadata?.name;

  let firstName = 'User';
  let lastName = '';

  if (displayName && typeof displayName === 'string') {
    const nameParts = displayName.trim().split(' ');
    firstName = nameParts[0] || 'User';
    lastName = nameParts.slice(1).join(' ') || '';
  } else {
    const emailPrefix = user.email?.split('@')[0] || 'user';
    firstName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
  }

  return {
    first_name: firstName,
    last_name: lastName,
    full_name: displayName || `${firstName} ${lastName}`.trim(),
    email: user.email || '',
    uid: user.id,
    display_name: displayName,
    phone: user.phone || undefined,
    provider: user.app_metadata?.provider || 'email',
    created_at: user.created_at,
    last_sign_in_at: user.last_sign_in_at
  };
}

// Rate Limiting Functions

function checkRateLimit(email: string, clientIP: string): { allowed: boolean; attempts: number; waitTime: number } {
  const key = `${email}:${clientIP}`;
  const now = Date.now();
  const attempt = loginAttempts.get(key);

  if (!attempt) {
    return { allowed: true, attempts: 0, waitTime: 0 };
  }

  // Reset if lockout period has passed
  if (now - attempt.lastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(key);
    return { allowed: true, attempts: 0, waitTime: 0 };
  }

  if (attempt.count >= MAX_ATTEMPTS) {
    const waitTime = LOCKOUT_DURATION - (now - attempt.lastAttempt);
    return { allowed: false, attempts: attempt.count, waitTime };
  }

  return { allowed: true, attempts: attempt.count, waitTime: 0 };
}

function recordFailedAttempt(email: string, clientIP: string): void {
  const key = `${email}:${clientIP}`;
  const now = Date.now();
  const attempt = loginAttempts.get(key);

  if (!attempt) {
    loginAttempts.set(key, { count: 1, lastAttempt: now });
  } else {
    loginAttempts.set(key, { count: attempt.count + 1, lastAttempt: now });
  }
}

function clearFailedAttempts(email: string, clientIP: string): void {
  const key = `${email}:${clientIP}`;
  loginAttempts.delete(key);
}