"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Movie, PaginatedResponse } from "@/types/movies";
import { getMovies } from "@/actions/movies";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function MoviesPage() {
  const [search, setSearch] = useState("");
  const token = useAuthStore((s) => s.token) || (typeof window !== "undefined" ? localStorage.getItem("token") || "" : "");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isPending } = useInfiniteQuery<PaginatedResponse<Movie>>({
    queryKey: ["movies", search, token],
    queryFn: ({ pageParam = 1 }) => getMovies({ search: search || undefined, page: Number(pageParam), token: token || "" }),
    getNextPageParam: (lastPage) => {
      const next = lastPage.page + 1;
      return next <= lastPage.total_pages ? next : undefined;
    },
    enabled: !!token,
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
      if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="mb-6 flex gap-2">
          <Input
            placeholder="Search movies..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              refetch();
            }}
          />
          <Button onClick={() => refetch()}>Search</Button>
        </div>
        <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl mb-6">Latest Movies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {isPending && items.length === 0 && Array.from({ length: 10 }).map((_, i) => (
            <div key={`s-${i}`} className="group">
              <Skeleton className="w-full h-[450px] rounded-lg" />
              <Skeleton className="mt-2 h-4 w-3/4" />
            </div>
          ))}
          {items.map((movie: Movie) => (
            <Link key={movie.id} href={`/movie/detail/${movie.id}`} className="group">
              <div className="rounded-lg overflow-hidden bg-black/5">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title}
                    width={300}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Skeleton className="w-full h-[450px]" />
                )}
              </div>
              <div className="mt-2 text-sm font-medium line-clamp-2">{movie.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}