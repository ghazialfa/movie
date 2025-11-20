export interface Movie {
	id: number;
	title: string;
	backdrop_path: string | null;
	poster_path: string | null;
	overview: string;
	release_date?: string;
}

export interface PaginatedResponse<T> {
	page: number;
	results: T[];
	total_pages: number;
	total_results: number;
}

export interface MovieDetail {
	id: number;
	title: string;
	backdrop_path: string | null;
	poster_path: string | null;
	overview: string;
	release_date?: string;
	genres?: { id: number; name: string }[];
	original_language?: string;
	vote_count?: number;
	vote_average?: number;
	adult?: boolean;
}

export interface Genre {
	id: number;
	name: string;
}

export interface GenreList {
	genres: Genre[];
}

export interface AiMoviesResponse {
	response: MovieDetail[];
}

export interface Poster {
	backdrop_path: string;
	poster_path: string;
}

export interface FavoriteItem {
	dbId: number;
	id: number;
	title: string;
	backdrop_path: string | null;
	poster_path: string | null;
	overview: string;
	release_date?: string;
	genres?: { id: number; name: string }[];
	original_language?: string;
	vote_count?: number;
	vote_average?: number;
	adult?: boolean;
	status?: string | null;
}
