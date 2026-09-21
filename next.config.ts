import type { NextConfig } from "next";
import { UNSPLASH_SEARCH } from "./src/lib/unsplash";

const nextConfig: NextConfig = {
  images: {
    // Unsplash only (free license). Pinned host, path prefix and query string.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
        search: UNSPLASH_SEARCH,
      },
    ],
  },
};

export default nextConfig;
