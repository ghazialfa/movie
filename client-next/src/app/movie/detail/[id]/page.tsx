"use client";
import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { getDetail } from "@/actions/movies";
import type { MovieDetail } from "@/types/movies";
import { Skeleton } from "@/components/ui/skeleton";

export default function MovieDetailPage() {
	const { id } = useParams<{ id: string }>();
	const token =
		useAuthStore((s) => s.token) ||
		(typeof window !== "undefined" ? localStorage.getItem("token") || "" : "");

	const { data } = useQuery<MovieDetail>({
		queryKey: ["movie-detail", id, token],
		queryFn: () => getDetail({ id: Number(id), token: token || "" }),
		enabled: !!id && !!token,
	});

	if (!data) {
		return (
			<section className="w-full py-12 md:py-24 lg:py-32">
				<div className="container px-4 md:px-6">
					<Skeleton className="w-full h-[50vh] mb-8 rounded-xl" />
					<div className="grid md:grid-cols-3 gap-8">
						<Skeleton className="h-[450px] w-full rounded-lg" />
						<div className="md:col-span-2 space-y-4">
							<Skeleton className="h-8 w-1/2" />
							<Skeleton className="h-4 w-1/3" />
							<div className="flex gap-2">
								{Array.from({ length: 4 }).map((_, i) => (
									<Skeleton key={`chip-${i}`} className="h-6 w-20" />
								))}
							</div>
							<Skeleton className="h-20 w-full" />
							<Skeleton className="h-4 w-1/4" />
						</div>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="w-full py-12 md:py-24 lg:py-32">
			<div className="container px-4 md:px-6">
				<div className="relative w-full h-[50vh] mb-8 rounded-xl overflow-hidden">
					{data.backdrop_path && (
						<Image
							src={`https://image.tmdb.org/t/p/w1280/${data.backdrop_path}`}
							alt={data.title}
							fill
							className="object-cover"
							priority
						/>
					)}
					<div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					<div>
						{data.poster_path && (
							<Image
								src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`}
								alt={data.title}
								width={300}
								height={450}
								className="rounded-lg shadow"
							/>
						)}
					</div>
					<div className="md:col-span-2 space-y-4">
						<h1 className="text-3xl font-bold">{data.title}</h1>
						<div className="text-sm text-gray-500">
							{data.release_date} • {data.original_language?.toUpperCase()}
						</div>
						<div className="flex flex-wrap gap-2">
							{(data.genres || []).map((g) => (
								<span key={g.id} className="text-xs px-2 py-1 rounded bg-gray-200">
									{g.name}
								</span>
							))}
						</div>
						<p className="text-gray-700">{data.overview}</p>
						<div className="text-sm text-gray-600">
							Rating: {data.vote_average} ({data.vote_count} votes)
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
