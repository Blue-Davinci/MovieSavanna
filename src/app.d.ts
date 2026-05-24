// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { User } from '@supabase/supabase-js';
import type { ProfileSummary } from '$lib/types/profile';

declare global {
	namespace App {
		interface Locals {
			user: User | null;
			profile: ProfileSummary | null;
			isAuthenticated: boolean;
			isAdmin: boolean;
			isVerified: boolean;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
