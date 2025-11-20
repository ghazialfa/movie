"use client";
import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { getGenres } from "@/actions/movies";
import type { Genre } from "@/types/movies";
import { Skeleton } from "@/components/ui/skeleton";

export default function GenresPage() {
	const token =
		useAuthStore((s) => s.token) ||
		(typeof window !== "undefined" ? localStorage.getItem("token") || "" : "");
	const { data, isPending } = useQuery({
		queryKey: ["genres", token],
		queryFn: () => getGenres({ token: token || "" }),
		enabled: !!token,
	});

	const genres: Genre[] = data?.genres || [];

	function slugify(name: string) {
		return name.toLowerCase().replace(/\s+/g, "-");
	}

	return (
		<section className="w-full py-12 md:py-24 lg:py-32">
			<div className="container px-4 md:px-6">
				<h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl mb-6">
					Genres
				</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
					{isPending &&
						Array.from({ length: 10 }).map((_, i) => (
							<div key={`s-${i}`} className="group">
								<Skeleton className="h-24 w-full rounded-lg" />
							</div>
						))}
					{genres.map((g) => (
						<Link
							key={g.id}
							href={`/movie/genres/${slugify(g.name)}`}
							className="group"
						>
							<div className="rounded-lg border p-4 bg-white hover:shadow">
								<div className="text-center font-medium">{g.name}</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
