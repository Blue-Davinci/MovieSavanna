import type { LayoutServerLoad } from './$types';

/**
 * Reads from `event.locals`, which is populated by `hooks.server.ts` on every
 * request. Avoids a duplicate `getUser()` round-trip and surfaces profile
 * fields (display name, avatar, role) to the client layout.
 */
export const load: LayoutServerLoad = async ({ locals }) => {
	const { user, profile, isAuthenticated, isAdmin } = locals;

	if (!user) {
		return {
			userInformation: {
				isAuthenticated: false,
				isAdmin: false,
				user: null
			}
		};
	}

	const fallbackDisplayName =
		profile?.display_name?.trim() ||
		[profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim() ||
		user.email?.split('@')[0] ||
		'';

	return {
		userInformation: {
			isAuthenticated,
			isAdmin,
			user: {
				id: user.id,
				email: user.email,
				emailConfirmed: user.email_confirmed_at !== null,
				avatar: profile?.avatar_url ?? user.user_metadata?.avatar_url ?? null,
				displayName: fallbackDisplayName,
				firstName: profile?.first_name ?? null,
				lastName: profile?.last_name ?? null,
				role: profile?.role ?? 'user'
			}
		}
	};
};
