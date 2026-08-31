import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n";
import { ROUTES, SITE_URL } from "@/lib/seo";

/**
 * Sitemap for both language trees.
 *
 * Each entry carries `alternates.languages`, which is how a sitemap expresses
 * hreflang. Search engines take the pairing from here as well as from the page
 * head, and having both is what stops the Finnish and English versions being
 * read as duplicates of each other.
 *
 * Checkout success and cancel are omitted deliberately — they are per-order
 * pages and are already marked `noindex`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // The home page should outrank the inner pages; the menu and ordering pages
  // are what people actually search for, so they sit above contact.
  const priority: Record<string, number> = {
    "": 1,
    "/menu": 0.9,
    "/shop": 0.9,
    "/buffet": 0.8,
    "/reservations": 0.7,
    "/contact": 0.6,
  };

  return LOCALES.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: `${SITE_URL}/${locale}${route}`,
      lastModified: now,
      // The menu and its prices change; the contact details do not.
      changeFrequency: (route === "/menu" || route === "/shop" || route === "/buffet"
        ? "weekly"
        : "monthly") as "weekly" | "monthly",
      priority: priority[route] ?? 0.5,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l === "fi" ? "fi-FI" : "en-GB", `${SITE_URL}/${l}${route}`]),
        ),
      },
    })),
  );
}
