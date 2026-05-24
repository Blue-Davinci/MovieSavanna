/**
 * Application user profile, mirrored from `public.profiles` in Supabase.
 *
 * One row per `auth.users.id` (FK + ON DELETE CASCADE). Auto-created on
 * signup by the `on_auth_user_created` trigger; `email_verified` is kept
 * in sync by `on_auth_user_email_confirmed`.
 */

export type Role = 'user' | 'admin' | 'moderator';

export interface Profile {
	id: string;
	role: Role;
	first_name: string | null;
	last_name: string | null;
	display_name: string | null;
	avatar_url: string | null;
	email_verified: boolean;
	created_at: string;
	updated_at: string;
}

/** Subset of Profile typically attached to `event.locals` and the layout. */
export interface ProfileSummary {
	id: string;
	role: Role;
	display_name: string | null;
	first_name: string | null;
	last_name: string | null;
	avatar_url: string | null;
}

/** Fields a user may update on their own profile (matches the column-level GRANT). */
export type ProfileUpdate = Partial<
	Pick<Profile, 'first_name' | 'last_name' | 'display_name' | 'avatar_url'>
>;
