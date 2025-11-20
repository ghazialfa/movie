import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "image.tmdb.org",
				port: "",
				pathname: "/t/p/**",
			},
		],
	},
	async rewrites() {
		return [{ source: "/movie/genre/:slug", destination: "/movie/genres/:slug" }];
	},
};

export default nextConfig;
