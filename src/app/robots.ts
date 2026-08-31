import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * There was no robots.txt at all, which means crawlers were free to spend the
 * site's crawl budget on the checkout return pages and the Stripe API route.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          // Per-order pages. Nothing to index, and the success URL carries a
          // Stripe session id that should not end up in a search result.
          "/fi/checkout/",
          "/en/checkout/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
