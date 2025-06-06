import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/helpers/auth/supabaseClient.js';

export const load: PageServerLoad = async (event) => {
	const supabase = createSupabaseServerClient(event);

	// Check authentication
	const {
		data: { user },
		error: authError
	} = await supabase.auth.getUser();

	if (authError || !user) {
		throw redirect(303, '/auth/login');
	}

	try {
		// Get user's favorites
		const { data: favorites, error: favoritesError } = await supabase
			.from('user_favorites')
			.select('*')
			.eq('user_id', user.id)
			.order('created_at', { ascending: false });

		if (favoritesError) {
			console.error('Failed to fetch favorites:', favoritesError);
			return {
				favorites: [],
				error: 'Failed to load favorites'
			};
		}

		return {
			favorites: favorites || [],
			user
		};
	} catch (error) {
		console.error('Favorites page load error:', error);
		return {
			favorites: [],
			error: 'Something went wrong'
		};
	}
};
