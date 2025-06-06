export interface UserFavorite {
	id: string;
	user_id: string;
	movie_id: number;
	movie_title: string;
	movie_poster: string | null;
	movie_release_date: string | null;
	movie_rating: number | null;
	created_at: string;
	updated_at: string;
}

export interface FavoriteRequest {
	movie_id: number;
	movie_title: string;
	movie_poster?: string | null;
	movie_release_date?: string | null;
	movie_rating?: number | null;
}

export interface FavoritesResponse {
	success: boolean;
	favorites?: UserFavorite[];
	message?: string;
	error?: string;
}

export interface FavoriteToggleResponse {
	success: boolean;
	is_favorited: boolean;
	message?: string;
	error?: string;
}

export interface FavoriteStatusResponse {
	success: boolean;
	is_favorited: boolean;
	message?: string;
	error?: string;
}
