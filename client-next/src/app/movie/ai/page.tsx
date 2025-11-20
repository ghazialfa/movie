"use client";
import React, { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { getAiMovies } from "@/actions/movies";
// import Image from "next/image";
// import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { MovieDetail } from "@/types/movies";
import { Skeleton } from "@/components/ui/skeleton";
import { Movie_card } from "@/components/movie_card";

export default function AiMoviesPage() {
	const [prompt, setPrompt] = useState("");
	const token =
		useAuthStore((s) => s.token) ||
		(typeof window !== "undefined" ? localStorage.getItem("token") || "" : "");

	const { mutate, data, isPending } = useMutation({
		mutationKey: ["ai-movies", prompt, token],
		mutationFn: () => getAiMovies({ userRequest: prompt, token: token || "" }),
	});

	const items = useMemo(() => {
		const all = data || [];
		const map = new Map<number, MovieDetail>();
		for (const m of all) {
			if (!map.has(m.id)) map.set(m.id, m);
		}
		return Array.from(map.values());
	}, [data]);

	return (
		<section className="w-full py-12 md:py-24 lg:py-32">
			<div className="container px-4 md:px-6 space-y-6">
				<h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
					AI Recommendations
				</h2>
				<div className="flex gap-2">
					<input
						className="w-full rounded-md border px-3 py-2"
						placeholder="Tulis preferensi kamu, mis. anime studio ghibli"
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
					/>
					<Button onClick={() => mutate()} disabled={!prompt || isPending}>
						Kirim
					</Button>
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
					{isPending &&
						Array.from({ length: 10 }).map((_, i) => (
							<div key={`s-${i}`} className="group">
								<Skeleton className="w-full h-[450px] rounded-lg" />
								<Skeleton className="mt-2 h-4 w-3/4" />
							</div>
						))}
                    {items.map((movie: MovieDetail) => (
                        <Movie_card key={movie.id} item={movie} />
                    ))}
				</div>
			</div>
		</section>
	);
}
