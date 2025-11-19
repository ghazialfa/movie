"use client";
import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { getFavorites, deleteFavorite, updateFavoriteStatus } from "@/actions/movies";
import type { FavoriteItem } from "@/types/movies";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function UserFavoritesPage() {
  useParams<{ id: string }>();
  const token = useAuthStore((s) => s.token) || (typeof window !== "undefined" ? localStorage.getItem("token") || "" : "");
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery<FavoriteItem[]>({
    queryKey: ["favorites", token],
    queryFn: () => getFavorites({ token: token || "" }),
    enabled: !!token,
  });

  const items = useMemo(() => data || [], [data]);

  const removeMut = useMutation({
    mutationFn: (dbId: number) => deleteFavorite({ dbId, token: token || "" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", token] });
    },
  });

  const updateStatusMut = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateFavoriteStatus({ id, status, token: token || "" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", token] });
    },
  });

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl mb-6">Favorites</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {isPending && Array.from({ length: 10 }).map((_, i) => (
            <div key={`s-${i}`} className="group">
              <Skeleton className="w-full h-[450px] rounded-lg" />
              <Skeleton className="mt-2 h-4 w-3/4" />
            </div>
          ))}
          {items.map((fav) => (
            <div key={fav.dbId} className="group">
              <Link href={`/movie/detail/${fav.id}`}>
                <div className="rounded-lg overflow-hidden bg-black/5">
                  {fav.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500/${fav.poster_path}`}
                      alt={fav.title}
                      width={300}
                      height={450}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Skeleton className="w-full h-[450px]" />
                  )}
                </div>
              </Link>
              <div className="mt-2 text-sm font-medium line-clamp-2">{fav.title}</div>
              <div className="mt-2 flex gap-2">
                <Button variant="outline" onClick={() => removeMut.mutate(fav.dbId)}>Remove</Button>
                <select
                  className="border rounded-md px-2 py-1 text-sm"
                  defaultValue={fav.status || ""}
                  onChange={(e) => updateStatusMut.mutate({ id: fav.dbId, status: e.target.value })}
                >
                  <option value="">Set status</option>
                  <option value="watching">Watching</option>
                  <option value="watched">Watched</option>
                  <option value="planned">Planned</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}