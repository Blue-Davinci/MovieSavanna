import { createServerClient } from '@supabase/ssr';
import type { RequestEvent } from '@sveltejs/kit';
import { SUPABASE_URL, SUPABASE_KEY } from '$env/static/private';

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
