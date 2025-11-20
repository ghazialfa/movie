"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { addFavorite } from "@/actions/movies";
import type { Movie, MovieDetail } from "@/types/movies";

export function Movie_card({ item }: { item: Movie | MovieDetail }) {
    const token =
        useAuthStore((s) => s.token) ||
        (typeof window !== "undefined" ? localStorage.getItem("token") || "" : "");
    const queryClient = useQueryClient();
    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: () => addFavorite({ tmdbId: item.id, token: token || "" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["favorites", token] });
        },
    });

    return (
        <Link href={`/movie/detail/${item.id}`} className="group">
            <div className="relative rounded-lg overflow-hidden bg-black/5">
                {item.poster_path ? (
                    <Image
                        src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                        alt={item.title}
                        width={300}
                        height={450}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-[450px] bg-black/10" />
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/70 hover:bg-white"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!isPending) mutate();
                    }}
                    disabled={!token || isPending}
                    aria-label="Add to favorites"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={isSuccess ? "currentColor" : "none"}
                        stroke="currentColor"
                        className="size-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 8.25c0-2.485-2.086-4.5-4.66-4.5-1.67 0-3.133.88-3.84 2.19-.707-1.31-2.17-2.19-3.84-2.19C6.086 3.75 4 5.765 4 8.25c0 4.63 6.69 8.38 8 9.5 1.31-1.12 8-4.87 8-9.5z"
                        />
                    </svg>
                </Button>
            </div>
            <div className="mt-2 text-sm font-medium line-clamp-2">{item.title}</div>
        </Link>
    );
}
