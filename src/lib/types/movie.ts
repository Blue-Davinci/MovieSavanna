export interface Movie {
	id: number;
	title: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	release_date: string;
	vote_average: number;
	vote_count: number;
	genre_ids: number[];
	adult: boolean;
	original_language: string;
	original_title: string;
	popularity: number;
	video: boolean;
}

export interface MovieDetails {
	id: number;
	title: string;
	original_title: string;
	overview: string;
	tagline: string;
	poster_path: string | null;
	backdrop_path: string | null;
	release_date: string;
	runtime: number;
	vote_average: number;
	vote_count: number;
	popularity: number;
	adult: boolean;
	video: boolean;
	original_language: string;
	status: 'Rumored' | 'Planned' | 'In Production' | 'Post Production' | 'Released' | 'Canceled';
	budget: number;
	revenue: number;
	homepage: string | null;
	imdb_id: string | null;
	genres: Genre[];
	production_companies: ProductionCompany[];
	production_countries: ProductionCountry[];
	spoken_languages: SpokenLanguage[];
	belongs_to_collection: Collection | null;
}

export interface Genre {
	id: number;
	name: string;
}

export interface ProductionCompany {
	id: number;
	logo_path: string | null;
	name: string;
	origin_country: string;
}

export interface ProductionCountry {
	iso_3166_1: string;
	name: string;
}

export interface SpokenLanguage {
	english_name: string;
	iso_639_1: string;
	name: string;
}

export interface Collection {
	id: number;
	name: string;
	poster_path: string | null;
	backdrop_path: string | null;
}

export interface CastMember {
	id: number;
	name: string;
	character: string;
	profile_path: string | null;
	order: number;
	cast_id: number;
	credit_id: string;
	adult: boolean;
	gender: number | null;
	known_for_department: string;
	original_name: string;
	popularity: number;
}

export interface CrewMember {
	id: number;
	name: string;
	job: string;
	department: string;
	profile_path: string | null;
	credit_id: string;
	adult: boolean;
	gender: number | null;
	known_for_department: string;
	original_name: string;
	popularity: number;
}

export interface MovieVideos {
	id: number;
	results: VideoResult[];
}

export interface VideoResult {
	id: string;
	iso_639_1: string;
	iso_3166_1: string;
	key: string;
	name: string;
	official: boolean;
	published_at: string;
	site: 'YouTube' | 'Vimeo';
	size: 360 | 480 | 720 | 1080;
	type: 'Trailer' | 'Teaser' | 'Clip' | 'Featurette' | 'Behind the Scenes' | 'Bloopers';
}

export interface MovieCredits {
	id: number;
	cast: CastMember[];
	crew: CrewMember[];
}

export interface TMDBResponse<T> {
	page: number;
	results: T[];
	total_pages: number;
	total_results: number;
}

export interface APIError {
	success: false;
	status_code: number;
	status_message: string;
}

export interface CacheEntry<T> {
	data: T;
	timestamp: number;
	expiry: number;
}

export interface CacheOptions {
	ttl?: number; // Time to live in milliseconds
	skipCache?: boolean;
}

export type PosterSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';
export type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original';
export type ProfileSize = 'w45' | 'w185' | 'h632' | 'original';
