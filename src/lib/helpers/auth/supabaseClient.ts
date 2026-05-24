import { createServerClient } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { RequestEvent } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { SUPABASE_URL, SUPABASE_KEY } from '$env/static/private';
import { env as privateEnv } from '$env/dynamic/private';

interface CookieSerializeOptions {
	domain?: string;
	encode?: (value: string) => string;
	expires?: Date;
	httpOnly?: boolean;
	maxAge?: number;
	path?: string;
	priority?: 'low' | 'medium' | 'high';
	sameSite?: boolean | 'lax' | 'strict' | 'none';
	secure?: boolean;
}

export function createSupabaseServerClient(event: RequestEvent) {
	// Validate environment variables
	if (!SUPABASE_URL || !SUPABASE_KEY) {
		throw new Error(
			'Missing Supabase environment variables. Check SUPABASE_URL and SUPABASE_KEY in your .env file.'
		);
	}

	return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
		cookies: {
			get: (key: string) => event.cookies.get(key),
			set: (key: string, value: string, options: CookieSerializeOptions = {}) => {
				event.cookies.set(key, value, {
					path: '/',
					httpOnly: true,
					secure: true,
					sameSite: 'lax',
					maxAge: 60 * 60 * 24 * 365, // 1 year
					...options
				});
			},
			remove: (key: string, options: CookieSerializeOptions = {}) => {
				event.cookies.delete(key, {
					path: '/',
					...options
				});
			}
		}
	});
}

/**
 * Server-only Supabase client that bypasses Row Level Security using the
 * service-role key. Use ONLY for trusted admin-side operations: listing all
 * users, force-confirming emails, deleting accounts, batch jobs, etc.
 *
 * Never import this from a `+page.svelte`, a `+layout.svelte`, or any module
 * that runs in the browser. The guard below throws loudly if you do.
 */
let cachedAdminClient: SupabaseClient | null = null;

export function createSupabaseAdminClient(): SupabaseClient {
	if (browser) {
		throw new Error(
			'createSupabaseAdminClient() must never be called from browser code. ' +
				'Move the call into a +page.server.ts, +server.ts, or hooks.server.ts.'
		);
	}

	const serviceRoleKey = privateEnv.SUPABASE_SERVICE_ROLE_KEY;

	if (!SUPABASE_URL || !serviceRoleKey) {
		throw new Error(
			'Missing Supabase admin env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
		);
	}

	if (!cachedAdminClient) {
		cachedAdminClient = createClient(SUPABASE_URL, serviceRoleKey, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
				detectSessionInUrl: false
			}
		});
	}

	return cachedAdminClient;
}
