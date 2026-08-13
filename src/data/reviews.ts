import { SITE } from "./site";

/**
 * Guest reviews.
 *
 * Everything here is real and traceable — nothing is written for effect.
 * The Google reviews were transcribed from the restaurant's own Google
 * listing; the Tripadvisor ones link back to the review they came from.
 *
 * ── Keeping this current ────────────────────────────────────────────────
 * Paste new reviews into REVIEWS. To pull them from Google automatically,
 * see "Google reviews" in the README — it is one API route plus a Places
 * API key, and this file becomes the fallback.
 */

export type ReviewSource = "google" | "tripadvisor";

export type Review = {
  author: string;
  /** Relative date exactly as the platform shows it. */
  when: { en: string; fi: string };
  quote: { en: string; fi: string };
  rating: number;
  source: ReviewSource;
  url?: string;
};

export const GOOGLE = {
  /** Verified count from the restaurant's Google listing. */
  count: 441,
  /**
   * Numeric score. Left null on purpose: the badge shows the word + stars
   * (exactly like Google's own summary widget) rather than a number I could
   * not verify. Set it from your Google Business Profile and the header
   * will display the score too.
   */
  rating: null as number | null,
  /** Google's own wording for the top band. */
  label: { en: "Excellent", fi: "Erinomainen" },
  stars: 5,
  url: SITE.social.google,
  /** Deep link that opens the "write a review" dialog. */
  writeUrl: SITE.social.google,
};

export const TRIPADVISOR = {
  rating: 4.8,
  count: 40,
  rank: { en: "#4 restaurant in Jyväskylä", fi: "Jyväskylän #4 ravintola" },
  url: "https://www.tripadvisor.com/Restaurant_Review-g189942-d32904926-Reviews-Pasargad_Indian_Cuisine-Jyvaskyla_Central_Finland.html",
};

const TA = "https://www.tripadvisor.com/ShowUserReviews-g189942-d32904926";
const yearAgo = { en: "1 year ago", fi: "vuosi sitten" };

export const REVIEWS: Review[] = [
  {
    author: "Miika Hokkanen",
    when: yearAgo,
    rating: 5,
    source: "google",
    quote: {
      fi: "Erinomainen ravintola, ruoka oli herkullista ja sitä oli riittävästi, henkilökunta kohteliasta ja avuliasta ja valikoima oli monipuolinen.",
      en: "Excellent restaurant. The food was delicious and there was plenty of it, the staff were polite and helpful, and the selection was varied.",
    },
  },
  {
    author: "Anniina Kortetmaa",
    when: yearAgo,
    rating: 5,
    source: "google",
    quote: {
      fi: "Ihana palvelu ja todella monipuolinen ja herkullinen lounasbuffet. Iso suositus tälle ravintolalle!",
      en: "Lovely service and a really varied, delicious lunch buffet. Big recommendation for this restaurant!",
    },
  },
  {
    author: "Iiro Surkka",
    when: yearAgo,
    rating: 5,
    source: "google",
    quote: {
      fi: "Aivan mahtava ruoka! Hinta tosi kohtuullinen ja tarjoilija oli ystävällinen. Tarjosi lopussa intialaista teetä!",
      en: "Absolutely amazing food! The price is very reasonable and the server was friendly. Offered Indian tea at the end!",
    },
  },
  {
    author: "Maija G",
    when: yearAgo,
    rating: 5,
    source: "google",
    quote: {
      fi: "Hyvä hinta-laatusuhde. Ystävällinen palvelu.",
      en: "Great value for money. Friendly service.",
    },
  },
  {
    author: "Sayeem",
    when: { en: "on Tripadvisor", fi: "Tripadvisorissa" },
    rating: 5,
    source: "tripadvisor",
    url: `${TA}-r1060818156-Pasargad_Indian_Cuisine-Jyvaskyla_Central_Finland.html`,
    quote: {
      en: "Pasargad has been the go-to restaurant for me ever since I landed in Finland. I have never had such an authentic and true taste of Indian food even though I come from Bangladesh myself.",
      fi: "Pasargad on ollut suosikkiravintolani siitä asti kun saavuin Suomeen. En ole koskaan maistanut näin aitoa intialaista ruokaa, vaikka olen itse kotoisin Bangladeshista.",
    },
  },
  {
    author: "Our go-to restaurant",
    when: { en: "on Tripadvisor", fi: "Tripadvisorissa" },
    rating: 5,
    source: "tripadvisor",
    url: `${TA}-r1061865514-Pasargad_Indian_Cuisine-Jyvaskyla_Central_Finland.html`,
    quote: {
      en: "Very warm and good service. A great buffet and they bring naan bread and special meat to the table. Ask for Indian chai for dessert — it is the best I have tasted.",
      fi: "Erittäin lämmin ja hyvä palvelu. Loistava buffet, ja naan-leipä sekä erikoisliha tuodaan pöytään. Pyydä jälkiruoaksi intialaista chaita — parasta mitä olen maistanut.",
    },
  },
  {
    author: "A Flavorful Escape to India",
    when: { en: "on Tripadvisor", fi: "Tripadvisorissa" },
    rating: 5,
    source: "tripadvisor",
    url: `${TA}-r1060986157-Pasargad_Indian_Cuisine-Jyvaskyla_Central_Finland.html`,
    quote: {
      en: "The lunch buffet is an incredible deal, and they even let you request a spicier dish or a special vegetable dish. That's such a thoughtful touch. A true hidden gem.",
      fi: "Lounasbuffet on uskomattoman hyvä diili, ja voit jopa pyytää tulisempaa tai erikoiskasvisannoksen. Se on todella huomaavaista. Aito helmi.",
    },
  },
  {
    author: "Excellent Food and Friendly Service!",
    when: { en: "on Tripadvisor", fi: "Tripadvisorissa" },
    rating: 5,
    source: "tripadvisor",
    url: `${TA}-r1036166376-Pasargad_Indian_Cuisine-Jyvaskyla_Central_Finland.html`,
    quote: {
      en: "Excellent value for money. Good and friendly service and location. Naan bread and freshly baked chicken were brought to the table separately. Comfortable interior, plenty of free parking.",
      fi: "Erinomainen vastine rahalle. Hyvä ja ystävällinen palvelu sekä sijainti. Naan-leipä ja tuore kana tuotiin pöytään erikseen. Viihtyisä sisustus ja runsaasti ilmaista pysäköintiä.",
    },
  },
];

/** Stable avatar tint per name — no random values, so SSR and client agree. */
export const avatarTint = (name: string) => {
  const palette = ["#c1272d", "#a4741d", "#3c8248", "#7d4a9c", "#1a6ea8", "#b8500f"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
};
