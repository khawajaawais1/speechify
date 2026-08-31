import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The restaurant's own media library. Routed through the Next image
    // optimizer so the original heavy JPEGs are served as responsive AVIF/WebP.
    remotePatterns: [
      { protocol: "https", hostname: "pasargadseppala.fi", pathname: "/wp-content/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      // Higgsfield generation output. Swap for local /hero files before launch —
      // see FIRE_FRAMES in src/data/site.ts.
      { protocol: "https", hostname: "d8j0ntlcm91z4.cloudfront.net", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 1920, 2560],
    // Next 16 only serves quality values declared here — anything else warns
    // and falls back. 45 is for the hero's middle fire frames, which are on
    // screen for under a second; 82 is the default for real photography.
    qualities: [45, 75, 82],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  /**
   * Security headers.
   *
   * Deliberately not a full Content-Security-Policy: this app inlines a
   * `<script>` for the html lang attribute and Next injects its own inline
   * bootstrap, so a strict CSP needs per-request nonces, which forces every
   * page out of static rendering. These four are the ones that cost nothing.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Stops a browser second-guessing a declared Content-Type — the usual
          // route to turning an uploaded image into executable script.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Send the full URL within our own site, only the origin off-site, so
          // a customer's basket or checkout URL never leaks to a third party.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Nothing here needs a camera, microphone or location.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          // The site is only served over HTTPS; do not offer to downgrade.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
  // `experimental.optimizePackageImports` removed: it printed an "Experiments
  // (use with caution)" notice on every build for no real gain — Next already
  // tree-shakes lucide-react by default.
};

export default nextConfig;
