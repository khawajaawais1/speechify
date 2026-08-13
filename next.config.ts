import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The restaurant's own media library. Routed through the Next image
    // optimizer so the original heavy JPEGs are served as responsive AVIF/WebP.
    remotePatterns: [
      { protocol: "https", hostname: "pasargadseppala.fi", pathname: "/wp-content/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 1920, 2560],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: { optimizePackageImports: ["lucide-react", "motion"] },
};

export default nextConfig;
