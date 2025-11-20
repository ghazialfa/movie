"use client";
import React, { useEffect, useMemo } from "react";
// import Link from "next/link";
// import Image from "next/image";
import { useParams } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { getGenres, getMoviesByGenre } from "@/actions/movies";
import type { Movie, Genre, PaginatedResponse } from "@/types/movies";
import { Skeleton } from "@/components/ui/skeleton";
import { Movie_card } from "@/components/movie_card";

function slugify(name: string) {
	return name.toLowerCase().replace(/\s+/g, "-");
}

export default function GenreDetailPage() {
	const { slug } = useParams<{ slug: string }>();
	const token =
		useAuthStore((s) => s.token) ||
		(typeof window !== "undefined" ? localStorage.getItem("token") || "" : "");

	const { data: genresData, isPending: isGenresPending } = useQuery<{ genres: Genre[] }>({
		queryKey: ["genres", token],
		queryFn: () => getGenres({ token: token || "" }),
		enabled: !!token,
	});
	const genreId = genresData?.genres.find((g) => slugify(g.name) === slug)?.id;

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery<
		PaginatedResponse<Movie>
	>({
		queryKey: ["movies-genre", genreId, token],
		queryFn: ({ pageParam = 1 }) =>
			getMoviesByGenre({ id: Number(genreId), page: Number(pageParam), token: token || "" }),
		getNextPageParam: (lastPage) => {
			const next = lastPage.page + 1;
			return next <= lastPage.total_pages ? next : undefined;
		},
		enabled: !!genreId && !!token,
		initialPageParam: 1,
	});

	const items = useMemo(() => {
		const all = data?.pages.flatMap((p) => p.results) || [];
		const map = new Map<number, Movie>();
		for (const m of all) {
			if (!map.has(m.id)) map.set(m.id, m);
		}
		return Array.from(map.values());
	}, [data]);

	useEffect(() => {
		const onScroll = () => {
			if (
				window.innerHeight + document.documentElement.scrollTop + 1 >=
				document.documentElement.scrollHeight
			) {
				if (hasNextPage && !isFetchingNextPage) fetchNextPage();
			}
		};
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	if (isGenresPending) {
		return (
			<section className="w-full py-24">
				<div className="container px-4 md:px-6">
					<Skeleton className="h-8 w-48 mb-6" />
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
						{Array.from({ length: 10 }).map((_, i) => (
							<Skeleton key={`s-${i}`} className="w-full h-[450px] rounded-lg" />
						))}
					</div>
				</div>
			</section>
		);
	}

	if (!genreId) {
		return (
			<section className="w-full py-24">
				<div className="container px-4 md:px-6">Genre tidak ditemukan</div>
			</section>
		);
	}

	return (
		<section className="w-full py-12 md:py-24 lg:py-32">
			<div className="container px-4 md:px-6">
				<h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl mb-6">
					Genre Movies
				</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
					{isPending &&
						items.length === 0 &&
						Array.from({ length: 10 }).map((_, i) => (
							<div key={`s-${i}`} className="group">
								<Skeleton className="w-full h-[450px] rounded-lg" />
								<Skeleton className="mt-2 h-4 w-3/4" />
							</div>
						))}
                    {items.map((movie: Movie) => (
                        <Movie_card key={movie.id} item={movie} />
                    ))}
				</div>
			</div>
		</section>
	);
}
