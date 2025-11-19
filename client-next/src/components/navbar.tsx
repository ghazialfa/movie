"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getGenres } from "@/actions/movies";
import { useAuthStore } from "@/store/auth";

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const token = useAuthStore((s) => s.token) || (typeof window !== "undefined" ? localStorage.getItem("token") || "" : "");
  const userId = useAuthStore((s) => s.userId) || (typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "");

  const { data } = useQuery({
    queryKey: ["genres", token],
    queryFn: () => getGenres({ token: token || "" }),
    enabled: !!token,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "userId=; path=/; max-age=0";
    useAuthStore.getState().clearAuth();
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between bg-gray-200 px-4 py-3 text-gray-900 md:px-6 dark:bg-gray-900 dark:text-white">
      <Link href={"/movie"} className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M7 3v18" />
          <path d="M3 7.5h4" />
          <path d="M3 12h18" />
          <path d="M3 16.5h4" />
          <path d="M17 3v18" />
          <path d="M17 7.5h4" />
          <path d="M17 16.5h4" />
        </svg>
        <span className="text-lg font-semibold">Moviking</span>
      </Link>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-gray">Movies</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-2 lg:w-[400px]">
                <div className="mt-2">
                  <Button asChild size="sm" className="w-full">
                    <Link href="/movie">Latest</Link>
                  </Button>
                </div>
                <div className="mt-2">
                  <Button asChild size="sm" className="w-full">
                    <Link href="/movie/popular">Popular</Link>
                  </Button>
                </div>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-gray">Genres</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-3 lg:w-[400px]">
                {(data?.genres || []).map(({ id, name }) => (
                  <div key={id} className="mt-2">
                    <Button asChild size="sm" className="w-full">
                      <Link href={`/movie/genres/${slugify(name)}`}>{name}</Link>
                    </Button>
                  </div>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="/movie/ai">Ai Recommendation</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href={userId ? `/user/${userId}/favorites` : "/movie"}>Favorites</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-2">
        {pathname === "/movie" && (
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            {/* <Input className="rounded-md bg-gray-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-gray-600" placeholder="Search movies..." type="text" /> */}
          </div>
        )}
        <Button onClick={handleLogout} className="rounded-md bg-red-300" variant="outline">Logout</Button>
      </div>
    </header>
  );
}