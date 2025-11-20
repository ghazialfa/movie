import { api } from "@/lib/axios";
import type {
	PaginatedResponse,
	Movie,
	MovieDetail,
	GenreList,
	AiMoviesResponse,
	FavoriteItem,
	Poster,
} from "@/types/movies";

export async function getMovies({
	search,
	page = 1,
	token,
}: {
	search?: string;
	page?: number;
	token: string;
}) {
	const { data } = await api.get<PaginatedResponse<Movie>>("/movies", {
		params: { search, page },
		headers: { Authorization: `Bearer ${token}` },
	});
	return data;
}

export async function getPopular({ page = 1, token }: { page?: number; token: string }) {
	const { data } = await api.get<PaginatedResponse<Movie>>("/movies/popular", {
		params: { page },
		headers: { Authorization: `Bearer ${token}` },
	});
	return data;
}

export async function getDetail({ id, token }: { id: number; token: string }) {
	const { data } = await api.get<MovieDetail>(`/movies/${id}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return data;
}

export async function getGenres({ token }: { token: string }) {
	const { data } = await api.get<GenreList>("/genres", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return data;
}

export async function getMoviesByGenre({
	id,
	page = 1,
	token,
}: {
	id: number;
	page?: number;
	token: string;
}) {
	const { data } = await api.get<PaginatedResponse<Movie>>(`/genres/${id}`, {
		params: { page },
		headers: { Authorization: `Bearer ${token}` },
	});
	return data;
}

export async function getAiMovies({ userRequest, token }: { userRequest: string; token: string }) {
	const { data } = await api.post<AiMoviesResponse>(
		"/movies/ai",
		{ userRequest },
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);
	return data.response;
}

export async function getFavorites({ token }: { token: string }) {
  const { data } = await api.get<FavoriteItem[]>("/favorites", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function addFavorite({ tmdbId, token }: { tmdbId: number; token: string }) {
  const { data } = await api.post(`/favorites/${tmdbId}`,
    null,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return data;
}

export async function deleteFavorite({ dbId, token }: { dbId: number; token: string }) {
	const { data } = await api.delete(`/favorites/${dbId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return data;
}

export async function updateFavoriteStatus({
	id,
	status,
	token,
}: {
	id: number;
	status: string;
	token: string;
}) {
	const { data } = await api.patch(
		`/favorites/${id}`,
		{ status },
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);
	return data;
}

export async function getPosters() {
	const { data } = await api.get<Poster[]>("/posters");
	return data;
}
