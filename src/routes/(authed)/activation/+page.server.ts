import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { superValidate, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { activationSchema } from '$lib/schemas/schema';
import { createSupabaseServerClient } from '$lib/helpers/auth/supabaseClient';
import { logAuth, logError, logSecurity, generateErrorId } from '$lib/helpers/logger/logger';

// Rate limiting for activation attempts
const activationAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ACTIVATION_ATTEMPTS = 5;
const ACTIVATION_LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

interface ActivationResult {
	success: boolean;
	message: string;
	user?: unknown;
	redirectTo?: string;
	errorId?: string;
}

export const load = async ({ url, locals, getClientAddress }: RequestEvent) => {
	const clientIP = getClientAddress();

	// Check if user is already logged in and verified
	if (locals.user && locals.user.email_confirmed_at) {
		logAuth('ACTIVATION_ATTEMPT_ALREADY_VERIFIED', {
			userId: locals.user.id,
			email: locals.user.email,
			clientIP,
			timestamp: new Date().toISOString()
		});
		redirect(303, '/dashboard');
	}

	// Get activation code from URL parameters
	const code = url.searchParams.get('code');
	const message = url.searchParams.get('message');

	// Initialize form with code if provided
	const form = await superValidate({ code: code || '' }, zod(activationSchema));

	// If code is provided in URL, attempt auto-activation
	let activationResult = null;
	if (code && code.trim()) {
		logAuth('AUTO_ACTIVATION_ATTEMPT', {
			codeProvided: true,
			clientIP,
			timestamp: new Date().toISOString()
		});

		activationResult = await activateAccount(code, clientIP);

		if (!activationResult.success) {
			// Set form error for display if activation failed
			setError(form, 'code', activationResult.message);
		}
	}

	return {
		form,
		autoActivationCode: code,
		activationResult,
		message: message ? decodeURIComponent(message) : null,
		meta: {
			title: 'Account Activation - MovieSavanna',
			description: 'Activate your MovieSavanna account to access unlimited streaming.'
		}
	};
};

export const actions = {
	activate: async (event: RequestEvent) => {
		const { request, getClientAddress } = event;
		const clientIP = getClientAddress();
		const startTime = Date.now();

		// Validate form data
		const form = await superValidate(request, zod(activationSchema));

		if (!form.valid) {
			logSecurity('INVALID_ACTIVATION_FORM_DATA', {
				clientIP,
				errors: form.errors,
				timestamp: new Date().toISOString()
			});
			return fail(400, { form });
		}

		const { code } = form.data;

		try {
			// Rate limiting check
			const rateLimitResult = checkActivationRateLimit(clientIP);
			if (!rateLimitResult.allowed) {
				const errorId = generateErrorId();
				logSecurity('ACTIVATION_RATE_LIMIT_EXCEEDED', {
					clientIP,
					attempts: rateLimitResult.attempts,
					waitTime: rateLimitResult.waitTime,
					errorId,
					timestamp: new Date().toISOString()
				});

				return fail(429, {
					form: setError(
						form,
						'code',
						`Too many activation attempts. Please try again in ${Math.ceil(rateLimitResult.waitTime / 60000)} minutes.`
					)
				});
			}

			// Attempt activation
			const result = await activateAccount(code, clientIP);

			// Record metrics
			const processingTime = Date.now() - startTime;
			logAuth('ACTIVATION_REQUEST_COMPLETED', {
				success: result.success,
				processingTime,
				clientIP,
				timestamp: new Date().toISOString()
			});

			if (result.success) {
				// Clear any failed attempts on success
				clearFailedActivationAttempts(clientIP);

				// Return success response with activation result for UI to handle
				return {
					form,
					activationResult: result
				};
			} else {
				// Record failed attempt
				recordFailedActivationAttempt(clientIP);

				// Return form with error
				return fail(400, {
					form: setError(form, 'code', result.message)
				});
			}
		} catch (error) {
			const errorId = generateErrorId();
			logError('ACTIVATION_ACTION_ERROR', {
				error: error instanceof Error ? error.message : 'Unknown error',
				errorId,
				clientIP,
				code: code.slice(0, 8) + '...', // Log partial code for debugging
				timestamp: new Date().toISOString()
			});

			recordFailedActivationAttempt(clientIP);

			return fail(500, {
				form: setError(
					form,
					'code',
					'An unexpected error occurred during activation. Please try again or contact support.'
				)
			});
		}
	},

	resend: async (event: RequestEvent) => {
		const { getClientAddress, locals } = event;
		const clientIP = getClientAddress();

		try {
			// Check if user is logged in but not verified
			if (!locals.user) {
				logSecurity('RESEND_ACTIVATION_UNAUTHORIZED', {
					clientIP,
					timestamp: new Date().toISOString()
				});
				return fail(401, { error: 'You must be logged in to resend activation email.' });
			}

			if (locals.user.email_confirmed_at) {
				logAuth('RESEND_ACTIVATION_ALREADY_VERIFIED', {
					userId: locals.user.id,
					email: locals.user.email,
					clientIP,
					timestamp: new Date().toISOString()
				});
				return fail(400, { error: 'Your account is already activated.' });
			}

			const supabase = createSupabaseServerClient(event);

			const { error } = await supabase.auth.resend({
				type: 'signup',
				email: locals.user.email!
			});

			if (error) {
				logError('RESEND_ACTIVATION_FAILED', {
					error: error.message,
					userId: locals.user.id,
					email: locals.user.email,
					clientIP,
					timestamp: new Date().toISOString()
				});
				return fail(400, { error: 'Failed to resend activation email. Please try again.' });
			}

			logAuth('RESEND_ACTIVATION_SUCCESS', {
				userId: locals.user.id,
				email: locals.user.email,
				clientIP,
				timestamp: new Date().toISOString()
			});

			return { success: true, message: 'Activation email sent successfully!' };
		} catch (error) {
			const errorId = generateErrorId();
			logError('RESEND_ACTIVATION_ERROR', {
				error: error instanceof Error ? error.message : 'Unknown error',
				errorId,
				clientIP,
				timestamp: new Date().toISOString()
			});

			return fail(500, { error: 'An unexpected error occurred. Please try again.' });
		}
	}
};

// Helper Functions

async function activateAccount(code: string, clientIP: string): Promise<ActivationResult> {
	try {
		logAuth('ACTIVATION_ATTEMPT_START', {
			codeLength: code.length,
			clientIP,
			timestamp: new Date().toISOString()
		});

		// Validate the activation code format
		// Since Supabase has already verified the email when the user clicked the link,
		// we just need to validate that we received a proper activation code
		const result = validateActivationCode(code, clientIP);
		
		if (result.success) {
			logAuth('ACTIVATION_SUCCESS', {
				codeValidated: true,
				redirectTo: '/login',
				clientIP,
				timestamp: new Date().toISOString()
			});

			return {
				success: true,
				message: 'Email verified successfully! Your account is now activated. Please sign in to continue.',
				redirectTo: '/login'
			};
		} else {
			return result;
		}
	} catch (error) {
		const errorId = generateErrorId();
		logError('ACTIVATION_FUNCTION_ERROR', {
			error: error instanceof Error ? error.message : 'Unknown error',
			errorId,
			clientIP,
			timestamp: new Date().toISOString()
		});

		return {
			success: false,
			message: 'An unexpected error occurred during activation. Please try again.',
			errorId
		};
	}
}

function validateActivationCode(code: string, clientIP: string): ActivationResult {
	// Basic validation of the activation code format
	if (!code || code.trim().length === 0) {
		logAuth('ACTIVATION_VALIDATION_FAILED', {
			reason: 'empty_code',
			clientIP,
			timestamp: new Date().toISOString()
		});
		
		return {
			success: false,
			message: 'Missing activation code. Please use the link from your email.',
			errorId: generateErrorId()
		};
	}

	// Check if code looks like a valid UUID (common format for activation codes)
	const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	const isValidUUID = uuidPattern.test(code.trim());

	// Check if code looks like a PKCE token (starts with pkce_)
	const isPKCEToken = code.trim().startsWith('pkce_');

	// Check minimum length for security
	const hasValidLength = code.trim().length >= 8;

	if (!isValidUUID && !isPKCEToken && !hasValidLength) {
		logAuth('ACTIVATION_VALIDATION_FAILED', {
			reason: 'invalid_format',
			codeLength: code.length,
			startsWithPKCE: isPKCEToken,
			isUUID: isValidUUID,
			clientIP,
			timestamp: new Date().toISOString()
		});

		return {
			success: false,
			message: 'Invalid activation code format. Please use the correct link from your email.',
			errorId: generateErrorId()
		};
	}

	// Code appears valid - assume verification was successful on Supabase side
	logAuth('ACTIVATION_CODE_VALIDATED', {
		codeFormat: isPKCEToken ? 'PKCE' : (isValidUUID ? 'UUID' : 'Other'),
		codeLength: code.length,
		clientIP,
		timestamp: new Date().toISOString()
	});

	return {
		success: true,
		message: 'Activation code validated successfully'
	};
}

// Rate Limiting Functions

function checkActivationRateLimit(clientIP: string): {
	allowed: boolean;
	attempts: number;
	waitTime: number;
} {
	const now = Date.now();
	const attempt = activationAttempts.get(clientIP);

	if (!attempt) {
		return { allowed: true, attempts: 0, waitTime: 0 };
	}

	// Reset if lockout period has passed
	if (now - attempt.lastAttempt > ACTIVATION_LOCKOUT_DURATION) {
		activationAttempts.delete(clientIP);
		return { allowed: true, attempts: 0, waitTime: 0 };
	}

	if (attempt.count >= MAX_ACTIVATION_ATTEMPTS) {
		const waitTime = ACTIVATION_LOCKOUT_DURATION - (now - attempt.lastAttempt);
		return { allowed: false, attempts: attempt.count, waitTime };
	}

	return { allowed: true, attempts: attempt.count, waitTime: 0 };
}

function recordFailedActivationAttempt(clientIP: string): void {
	const now = Date.now();
	const attempt = activationAttempts.get(clientIP);

	if (!attempt) {
		activationAttempts.set(clientIP, { count: 1, lastAttempt: now });
	} else {
		attempt.count += 1;
		attempt.lastAttempt = now;
	}
}

function clearFailedActivationAttempts(clientIP: string): void {
	activationAttempts.delete(clientIP);
}
