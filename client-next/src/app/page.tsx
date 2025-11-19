import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  
  return (
    <section className="w-full pt-12 md:pt-24 lg:pt-32">
      <div className="container space-y-10 xl:space-y-16">
        <div className="grid gap-4 px-10 md:grid-cols-2 md:gap-16">
          <div>
            <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
              MoviKing is a movie streaming platform.
            </h1>
          </div>
          <div className="flex flex-col items-start space-y-4">
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Experience the ultimate in effortless entertainment with our movie streaming app. Dive into a world of boundless enjoyment where streaming your favorite films is as simple and satisfying as enjoying your favorite meal.
            </p>
            <div className="space-x-4">
              <Link href="/login">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto aspect-3/1 overflow-hidden rounded-t-xl object-cover">
          <Image
            src="https://image.tmdb.org/t/p/w1280/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg"
            alt="Backdrop"
            width={1280}
            height={400}
            className="w-full h-full object-cover"
            priority
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-white dark:from-background" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-linear-to-l from-white dark:from-background" />
        </div>
      </div>
    </section>
  );
}
