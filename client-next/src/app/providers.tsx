"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

export default function Providers({ children }: { children: React.ReactNode }) {
	const [client] = React.useState(() => new QueryClient());
	const router = useRouter();
	const pathname = usePathname();

	React.useEffect(() => {
		const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
		const isProtected = pathname.startsWith("/movie") || pathname.startsWith("/user");
		if (isProtected && !token) {
			router.replace("/login");
		}
	}, [pathname, router]);

	const hideNavbar =
		pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/register");
	return (
		<QueryClientProvider client={client}>
			{!hideNavbar && <Navbar />}
			{children}
		</QueryClientProvider>
	);
}
