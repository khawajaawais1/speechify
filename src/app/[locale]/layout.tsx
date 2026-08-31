import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { CartProvider } from "@/lib/cart";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CartBar, CartDrawer } from "@/components/CartDrawer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SITE } from "@/data/site";
import { REVIEWS } from "@/data/reviews";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta("", isLocale(locale) ? locale : DEFAULT_LOCALE);
}

/**
 * Restaurant structured data — what fills the Google knowledge panel.
 *
 * Two deliberate omissions:
 *
 * • No `aggregateRating`. It previously published 5.0 from 4 reviews, a figure
 *   that matches nothing verifiable — the real Google listing has 441 reviews
 *   and Tripadvisor has 40. Publishing a self-declared aggregate that cannot be
 *   traced to reviews shown on the page is exactly what Google's review-snippet
 *   policy prohibits, and it risks a manual action on the whole domain. Google
 *   already has the genuine rating from the Business Profile; it does not need
 *   ours. The individual guest reviews rendered on the home page are emitted
 *   below instead, which is the compliant way to say the same thing.
 *
 * • No `menu` URL pointing at a PDF. `hasMenu` points at the live menu page.
 */
const ldJson = (locale: string) => ({
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": `${SITE_URL}/#restaurant`,
  name: SITE.fullName,
  url: `${SITE_URL}/${locale}`,
  image: [`${SITE_URL}/apple-icon.png`],
  logo: `${SITE_URL}/brand/pasargad-horizontal.svg`,
  servesCuisine: ["Indian", "Pizza", "Kebab", "Vegan"],
  priceRange: "€€",
  currenciesAccepted: "EUR",
  telephone: SITE.phone,
  email: SITE.email,
  hasMap: SITE.maps,
  sameAs: [SITE.social.facebook, SITE.social.instagram, SITE.social.google],
  hasMenu: `${SITE_URL}/${locale}/menu`,
  acceptsReservations: `${SITE_URL}/${locale}/reservations`,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    postalCode: SITE.address.postal,
    addressLocality: SITE.address.city,
    addressCountry: "FI",
  },
  areaServed: { "@type": "City", name: SITE.address.city },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], opens: "10:30", closes: "21:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "12:00", closes: "21:00" },
  ],
  // Only the reviews that are actually rendered on the page.
  review: REVIEWS.map((r) => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.author },
    reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    reviewBody: r.quote[locale === "fi" ? "fi" : "en"],
    ...(r.url ? { url: r.url } : {}),
  })),
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l: Locale = locale;

  return (
    <CartProvider>
      {/* Next requires <html> to live in the ROOT layout, which sits above the
          [locale] segment and so cannot know the language. Without this, every
          /en page would still announce itself as Finnish to screen readers and
          search engines. The script runs inline during streaming, before paint. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(l)}`,
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson(l)) }}
      />
      <ScrollProgress />
      <Nav />
      <main id="content" key={l} className="relative">{children}</main>
      <Footer />
      <CartDrawer />
      <CartBar />
    </CartProvider>
  );
}
