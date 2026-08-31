import type { Metadata } from "next";
import { LOCALES, type Locale } from "./i18n";

/**
 * One place for everything a search engine reads.
 *
 * The site is bilingual, so the two things that matter most are (a) every page
 * declaring a canonical URL for its own locale and (b) every page pointing at
 * its counterpart with hreflang. Without those, Google picks one of the two
 * language versions and treats the other as duplicate content — which for a
 * restaurant in Finland with an English menu means losing whichever half of the
 * audience it decides against.
 */

/** Public origin. Set NEXT_PUBLIC_SITE_URL in the host's env before launch. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pasargadseppala.fi"
).replace(/\/$/, "");

/** Routes that exist under both locales, in nav order. `""` is the home page. */
export const ROUTES = ["", "/menu", "/buffet", "/shop", "/reservations", "/contact"] as const;
export type Route = (typeof ROUTES)[number];

type Copy = { title: string; description: string };

/**
 * Per-page title and description in both languages.
 *
 * These are deliberately NOT in the UI dictionary: they are marketing copy
 * aimed at a search result, they are read on the server only, and they want to
 * be written and reviewed as a set. `<title>` should be under ~60 characters
 * and the description under ~155 or Google truncates it.
 */
const COPY: Record<Route, Record<Locale, Copy>> = {
  "": {
    fi: {
      title: "Pasargad Indian Cuisine — intialainen ravintola Jyväskylässä",
      description:
        "Aito intialainen keittiö Jyväskylän Seppälässä. Päivittäinen buffet, à la carte, kiviuunipizzat ja kebab. Tilaa verkosta — kotiin noin 30 minuutissa.",
    },
    en: {
      title: "Pasargad Indian Cuisine — Indian restaurant in Jyväskylä",
      description:
        "Authentic Indian cooking in Seppälä, Jyväskylä. Daily buffet, à la carte, stone-baked pizza and kebab. Order online — at your door in about 30 minutes.",
    },
  },
  "/menu": {
    fi: {
      title: "Ruokalista — à la carte, pizzat ja kebab",
      description:
        "Koko ruokalista: intialaiset pääruoat, biryanit, alkupalat, kiviuunipizzat, kebabit, vegaaniset vöner- ja falafelannokset sekä salaatit. Hinnat ja allergeenitiedot.",
    },
    en: {
      title: "Menu — à la carte, pizza and kebab",
      description:
        "The full menu: Indian mains, biryanis, starters, stone-baked pizza, kebabs, vegan vöner and falafel plates, and salads. Prices and dietary markers included.",
    },
  },
  "/buffet": {
    fi: {
      title: "Buffet joka päivä Jyväskylässä",
      description:
        "Lounasbuffet joka päivä: eri pöytä joka viikonpäivä, kasvis- ja vegaanivaihtoehdot mukana. Katso viikon kierto, hinnat ja aukioloajat.",
    },
    en: {
      title: "Daily buffet in Jyväskylä",
      description:
        "A buffet every day, with a different table each day of the week and vegetarian and vegan options throughout. See this week's rotation, prices and times.",
    },
  },
  "/shop": {
    fi: {
      title: "Tilaa verkosta — kotiinkuljetus tai nouto",
      description:
        "Tilaa suoraan ravintolasta: valitse annokset, nouto tai kotiinkuljetus ja maksa turvallisesti. Ilmainen kuljetus 5 km säteellä.",
    },
    en: {
      title: "Order online — delivery or pickup",
      description:
        "Order straight from the restaurant: pick your dishes, choose pickup or delivery, and pay securely. Free delivery within 5 km.",
    },
  },
  "/reservations": {
    fi: {
      title: "Varaa pöytä",
      description:
        "Varaa pöytä Pasargadista Jyväskylän Seppälästä. Yli 10 hengen ryhmille ja yksityistilaisuuksille suunnittelemme oman menun.",
    },
    en: {
      title: "Reserve a table",
      description:
        "Book a table at Pasargad in Seppälä, Jyväskylä. For groups of ten or more and private events we'll build a menu with you.",
    },
  },
  "/contact": {
    fi: {
      title: "Yhteystiedot ja sijainti",
      description:
        "Ahjokatu 12, 40320 Jyväskylä. Pysäköinti oven edessä. Puhelin, sähköposti, aukioloajat ja kartta.",
    },
    en: {
      title: "Find us — address and opening hours",
      description:
        "Ahjokatu 12, 40320 Jyväskylä. Parking right outside. Phone, email, opening hours and a map.",
    },
  },
};

/**
 * Metadata for one page in one locale.
 *
 * `title.absolute` is used on the home page so it is not suffixed with the
 * restaurant name twice; every other page takes the layout's `%s · Pasargad`
 * template.
 */
export function pageMeta(route: Route, locale: Locale): Metadata {
  const copy = COPY[route][locale];
  const path = `/${locale}${route}`;
  const languages = Object.fromEntries(
    LOCALES.map((l) => [l === "fi" ? "fi-FI" : "en-GB", `/${l}${route}`]),
  );

  return {
    title: route === "" ? { absolute: copy.title } : copy.title,
    description: copy.description,
    alternates: {
      canonical: path,
      // x-default points at Finnish: the restaurant is in Finland, so an
      // unmatched language should land on the local one.
      languages: { ...languages, "x-default": `/fi${route}` },
    },
    openGraph: {
      type: "website",
      url: path,
      title: copy.title,
      description: copy.description,
      siteName: "Pasargad Indian Cuisine",
      locale: locale === "fi" ? "fi_FI" : "en_GB",
      alternateLocale: locale === "fi" ? "en_GB" : "fi_FI",
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
    },
  };
}
