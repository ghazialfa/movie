import Link from "next/link";
import Image from "next/image";
import type { Movie, PaginatedResponse } from "@/types/movies";
import { cookies } from "next/headers";
export const revalidate = 300;

export default async function PopularMoviesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  let items: Movie[] = [];
  if (token) {
    const res = await fetch(`http://localhost:3000/movies/popular?page=1`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate },
    });
    if (res.ok) {
      const data = (await res.json()) as PaginatedResponse<Movie>;
      items = data.results || [];
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl mb-6">Popular Movies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {items.length === 0 && (
            <div className="col-span-full text-center text-sm">Silakan login untuk melihat popular movies.</div>
          )}
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
                  <div className="w-full h-[450px] bg-black/10" />
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