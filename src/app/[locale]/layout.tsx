import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, LOCALES, type Locale } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CartBar, CartDrawer } from "@/components/CartDrawer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SITE } from "@/data/site";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const fi = locale === "fi";
  return {
    title: fi
      ? "Pasargad Indian Cuisine — intialainen ravintola Jyväskylässä"
      : "Pasargad Indian Cuisine — Indian restaurant in Jyväskylä",
    description: fi
      ? "Aito intialainen keittiö Jyväskylässä. Päivittäinen buffet, à la carte, kiviuunipizzat ja kebab. Tilaa verkosta — kotiin 30 minuutissa."
      : "Authentic Indian cuisine in Jyväskylä. Daily buffet, à la carte, stone-baked pizza and kebab. Order online — at your door in 30 minutes.",
    alternates: {
      canonical: `/${locale}`,
      languages: { fi: "/fi", en: "/en" },
    },
  };
}

const ldJson = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: SITE.fullName,
  servesCuisine: ["Indian", "Pizza", "Kebab"],
  priceRange: "€€",
  telephone: SITE.phone,
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    postalCode: SITE.address.postal,
    addressLocality: SITE.address.city,
    addressCountry: "FI",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: SITE.rating.score,
    reviewCount: SITE.rating.count,
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], opens: "10:30", closes: "21:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "12:00", closes: "21:00" },
  ],
};

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
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
