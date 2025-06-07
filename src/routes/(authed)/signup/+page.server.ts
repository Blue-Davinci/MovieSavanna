import { superValidate, message } from 'sveltekit-superforms';
import { ACTIVATION_URL } from '$env/static/private';
import { zod } from 'sveltekit-superforms/adapters';
import { signupSchema } from '$lib/schemas/schema';
import { fail, type RequestEvent } from '@sveltejs/kit'; //redirect
import { createSupabaseServerClient } from '$lib/helpers/auth/supabaseClient.js';
import { dev } from '$app/environment';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { logAuth, logSecurity, logError, generateErrorId } from '$lib/helpers/logger/logger.js';

// Types for better code organization
interface SignupResult {
	success: boolean;
	user?: User | null;
	session?: Session | null;
	error?: string;
	requiresVerification?: boolean;
}

interface ProcessedSignupData {
	email: string;
	firstName: string;
	lastName: string;
	phone?: string;
	uid?: string;
	provider: string;
	created_at?: string;
}

// Rate limiting storage for signup attempts (in production, use Redis)
const signupAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_SIGNUP_ATTEMPTS = 3;
const SIGNUP_LOCKOUT_DURATION = 60 * 60 * 1000; // 1 hour

export const load = async ({ url, locals }) => {
	// Check if user is already logged in
	/*if (locals.user) {
    const redirectTo = url.searchParams.get('redirectTo') || '/dashboard';
    throw redirect(303, redirectTo);
  }
*/
	logSecurity('SIGNUP_PAGE_ACCESS', {
		timestamp: new Date().toISOString(),
		locals_vars: locals
	});
	const form = await superValidate(zod(signupSchema));
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
		const form = await superValidate(request, zod(signupSchema));

		if (!form.valid) {
			logSecurity('INVALID_SIGNUP_FORM_DATA', { clientIP, errors: form.errors });
			return fail(400, { form });
		}

		try {
			const { firstName, lastName, email, password, phone, termsAccepted } = form.data;

			// Additional server-side validation
			if (!termsAccepted) {
				return message(form, {
					success: false,
					message: 'You must accept the terms and conditions to continue.'
				});
			}

			// Rate limiting check
			const rateLimitResult = checkSignupRateLimit(email, clientIP);
			if (!rateLimitResult.allowed) {
				logSecurity('SIGNUP_RATE_LIMIT_EXCEEDED', {
					email,
					clientIP,
					attempts: rateLimitResult.attempts
				});
				return message(form, {
					success: false,
					message: `Too many signup attempts. Please try again in ${Math.ceil(rateLimitResult.waitTime / 60000)} minutes.`
				});
			}

			// Input sanitization and validation
			const sanitizedEmail = email.toLowerCase().trim();
			const sanitizedFirstName = firstName.trim();
			const sanitizedLastName = lastName.trim();
			const sanitizedPhone = phone?.trim() || undefined;

			logAuth('SIGNUP_ATTEMPT', {
				email: sanitizedEmail,
				clientIP,
				userAgent: request.headers.get('user-agent'),
				hasPhone: !!sanitizedPhone
			});

			// Attempt signup with Supabase
			const signupResult = await registerUser(event, {
				email: sanitizedEmail,
				password,
				firstName: sanitizedFirstName,
				lastName: sanitizedLastName,
				phone: sanitizedPhone
			});

			// Handle signup result
			if (!signupResult.success) {
				recordFailedSignupAttempt(sanitizedEmail, clientIP);

				if (signupResult.requiresVerification) {
					logAuth('SIGNUP_VERIFICATION_SENT', { email: sanitizedEmail, clientIP });
					return message(form, {
						success: true,
						message: 'verification_required',
						data: { email: sanitizedEmail }
					});
				}

				logAuth('SIGNUP_FAILED', {
					email: sanitizedEmail,
					clientIP,
					error: signupResult.error
				});
				return message(form, {
					success: false,
					message: signupResult.error || 'Signup failed. Please try again.'
				});
			}

			// Success - clear failed attempts
			clearFailedSignupAttempts(sanitizedEmail, clientIP);

			// Process user data
			const userData = processSignupData(signupResult.user!, {
				firstName: sanitizedFirstName,
				lastName: sanitizedLastName,
				phone: sanitizedPhone
			});

			// Log successful signup
			logAuth('SIGNUP_SUCCESS', {
				userId: userData.uid,
				email: sanitizedEmail,
				clientIP,
				provider: userData.provider,
				duration: Date.now() - startTime,
				hasPhone: !!sanitizedPhone
			});

			// Send welcome analytics event (optional)
			await trackSignupEvent(userData);

			return message(form, {
				success: true,
				message: signupResult.requiresVerification
					? 'Please check your email to verify your account.'
					: 'Account created successfully! Welcome to MovieSavanna!',
				data: userData
			});
		} catch (error) {
			const errorId = generateErrorId();

			logError('UNEXPECTED_SIGNUP_ERROR', {
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

async function registerUser(
	event: RequestEvent,
	userData: {
		email: string;
		password: string;
		firstName: string;
		lastName: string;
		phone?: string;
	}
): Promise<SignupResult> {
	try {
		const supabase = createSupabaseServerClient(event);

		logAuth('SUPABASE_SIGNUP_ATTEMPT', {
			email: userData.email,
			hasPhone: !!userData.phone,
			timestamp: new Date().toISOString()
		});

		const { data, error } = await supabase.auth.signUp({
			email: userData.email,
			password: userData.password,
			phone: userData.phone,
			options: {
				data: {
					first_name: userData.firstName,
					last_name: userData.lastName,
					full_name: `${userData.firstName} ${userData.lastName}`,
					display_name: `${userData.firstName} ${userData.lastName}`
				},
				emailRedirectTo: ACTIVATION_URL
			}
		});

		logAuth('SUPABASE_SIGNUP_RESPONSE', {
			hasUser: !!data.user,
			hasSession: !!data.session,
			hasError: !!error,
			errorMessage: error?.message || 'No error',
			errorStatus: error?.status || 'No status',
			userConfirmed: data.user?.email_confirmed_at ? true : false,
			timestamp: new Date().toISOString()
		});

		if (error) {
			logError('SUPABASE_SIGNUP_ERROR_DETAILS', {
				message: error.message,
				status: error.status,
				name: error.name,
				// Add any other error properties
				errorData: JSON.stringify(error, null, 2)
			});
			return handleSignupError(error);
		}

		if (!data.user) {
			return { success: false, error: 'Registration failed - no user data returned' };
		}

		// Check if user needs email verification
		const requiresVerification = !data.session && data.user && !data.user.email_confirmed_at;

		return {
			success: true,
			user: data.user,
			session: data.session,
			requiresVerification
		};
	} catch (error) {
		logError('SUPABASE_SIGNUP_UNEXPECTED_ERROR', {
			message: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			errorType: typeof error,
			errorData: JSON.stringify(error, null, 2)
		});
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Registration service error'
		};
	}
}

function handleSignupError(error: AuthError): SignupResult {
	logError('SIGNUP_ERROR_HANDLER', {
		message: error.message,
		status: error.status,
		name: error.name,
		timestamp: new Date().toISOString()
	});

	const errorMap: Record<string, { message: string; requiresVerification?: boolean }> = {
		'User already registered': {
			message: 'An account with this email already exists. Please try logging in instead.'
		},
		'Email address is already registered': {
			message: 'An account with this email already exists. Please try logging in instead.'
		},
		'Email already exists': {
			message: 'An account with this email already exists. Please try logging in instead.'
		},
		'Password should be at least 6 characters': {
			message: 'Password must be at least 6 characters long.'
		},
		'Password should be at least 8 characters': {
			message: 'Password must be at least 8 characters long.'
		},
		'Invalid email': {
			message: 'Please enter a valid email address.'
		},
		'Signup not allowed': {
			message: 'Account registration is currently disabled.'
		},
		'Email rate limit exceeded': {
			message: 'Too many emails sent. Please try again later.'
		},
		'Phone number is invalid': {
			message: 'Please enter a valid phone number.'
		},
		'Weak password': {
			message: 'Please choose a stronger password.'
		},
		'Invalid phone number format': {
			message: 'Please enter a valid phone number.'
		},
		'Phone number already registered': {
			message: 'This phone number is already registered to another account.'
		}
	};

	let errorInfo = errorMap[error.message];

	// Try pattern matching for dynamic email errors like john.doe@gmail.com
	if (
		!errorInfo &&
		error.message.includes('Email address') &&
		error.message.includes('is invalid')
	) {
		errorInfo = {
			message: 'This email address is not allowed. Please try a different email address.'
		};
	}

	if (errorInfo) {
		return {
			success: false,
			error: errorInfo.message,
			requiresVerification: errorInfo.requiresVerification || false
		};
	}

	// For unknown errors, include the actual error message in development
	const fallbackMessage = dev
		? `Registration failed: ${error.message}`
		: 'Registration failed. Please try again.';

	return {
		success: false,
		error: fallbackMessage,
		requiresVerification: false
	};
}

function processSignupData(
	user: User,
	originalData: { firstName: string; lastName: string; phone?: string }
): ProcessedSignupData {
	return {
		email: user.email || '',
		firstName: originalData.firstName,
		lastName: originalData.lastName,
		phone: originalData.phone,
		uid: user.id,
		provider: user.app_metadata?.provider || 'email',
		created_at: user.created_at
	};
}

async function trackSignupEvent(userData: ProcessedSignupData): Promise<void> {
	try {
		// ToDo: In production, integrate with analytics service
		// await analytics.track('user_signup', {
		//   userId: userData.uid,
		//   provider: userData.provider,
		//   hasPhone: !!userData.phone
		// });

		logAuth('SIGNUP_ANALYTICS', {
			userId: userData.uid,
			provider: userData.provider,
			hasPhone: !!userData.phone
		});
	} catch (error) {
		// Non-critical error, don't fail the signup
		logError('SIGNUP_ANALYTICS_ERROR', {
			error: error instanceof Error ? error.message : 'Unknown error',
			userId: userData.uid
		});
	}
}

// Rate Limiting Functions

function checkSignupRateLimit(
	email: string,
	clientIP: string
): { allowed: boolean; attempts: number; waitTime: number } {
	const key = `${email}:${clientIP}`;
	const now = Date.now();
	const attempt = signupAttempts.get(key);

	if (!attempt) {
		return { allowed: true, attempts: 0, waitTime: 0 };
	}

	// Reset if lockout period has passed
	if (now - attempt.lastAttempt > SIGNUP_LOCKOUT_DURATION) {
		signupAttempts.delete(key);
		return { allowed: true, attempts: 0, waitTime: 0 };
	}

	if (attempt.count >= MAX_SIGNUP_ATTEMPTS) {
		const waitTime = SIGNUP_LOCKOUT_DURATION - (now - attempt.lastAttempt);
		return { allowed: false, attempts: attempt.count, waitTime };
	}

	return { allowed: true, attempts: attempt.count, waitTime: 0 };
}

function recordFailedSignupAttempt(email: string, clientIP: string): void {
	const key = `${email}:${clientIP}`;
	const now = Date.now();
	const attempt = signupAttempts.get(key);

	if (!attempt) {
		signupAttempts.set(key, { count: 1, lastAttempt: now });
	} else {
		signupAttempts.set(key, { count: attempt.count + 1, lastAttempt: now });
	}
}

function clearFailedSignupAttempts(email: string, clientIP: string): void {
	const key = `${email}:${clientIP}`;
	signupAttempts.delete(key);
}
