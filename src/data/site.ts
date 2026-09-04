export const SITE = {
  name: "Pasargad",
  fullName: "Pasargad Indian Cuisine",
  tagline: { en: "Indian Cuisine · Jyväskylä", fi: "Intialainen ravintola · Jyväskylä" },
  since: 2016,
  businessId: "2766765-7",
  address: { street: "Ahjokatu 12", postal: "40320", city: "Jyväskylä", country: "Finland" },
  phone: "+358 50 4757157",
  phoneHref: "tel:+358504757157",
  email: "pasargadjkl@gmail.com",
  maps: "https://maps.google.com/?q=Ahjokatu+12,+40320+Jyväskylä",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61551229883773",
    instagram: "https://www.instagram.com/pasargad.indian.cuisine/",
    google: "https://g.co/kgs/VEBRezg",
  },
  apps: {
    ios: "https://apps.apple.com/us/app/pasargad-indian-cusine/id6746831717",
    android: "https://play.google.com/store/apps/details?id=com.shahintech.pasargadind",
  },
  /**
   * The rating shown in the hero chip, the footer and the stats band.
   *
   * Sourced from Tripadvisor, where both the score and the count are public and
   * checkable — see TRIPADVISOR in src/data/reviews.ts, which links to the
   * listing. It replaced a 5.0 from 4 reviews that matched no source at all.
   *
   * Two reasons not to "improve" this to a 5.0: an unverifiable rating on a
   * commercial site is a marketing claim you would have to defend, and shoppers
   * read a unanimous score as fake. 4.8 from 40 sells harder than 5.0 from 4.
   *
   * It is deliberately NOT published as schema.org `aggregateRating` — see the
   * note in src/app/[locale]/layout.tsx.
   */
  rating: { score: 4.8, count: 40 },
  hours: {
    kitchen: [
      { d: { en: "Mon – Sat", fi: "Ma – La" }, t: "10:30 – 21:00" },
      { d: { en: "Sunday", fi: "Sunnuntai" }, t: "12:00 – 21:00" },
    ],
    delivery: [
      { d: { en: "Mon – Sat", fi: "Ma – La" }, t: "10:30 – 20:30" },
      { d: { en: "Sunday", fi: "Sunnuntai" }, t: "12:00 – 20:30" },
    ],
  },
  order: {
    currency: "eur",
    serviceFee: 0.9,
    freeDeliveryOver: 50,
    minPickup: 10,
    minDelivery: 23,
    etaMinutes: 30,
    // zones[1].fee is the flat fee for every delivery beyond the free radius —
    // there is no upper distance limit (orders come from well past 7 km), so
    // it deliberately carries no `km` upper bound. Don't reintroduce one in
    // customer-facing copy.
    zones: [
      { km: 5, fee: 0 },
      { fee: 5 },
    ],
  },
  /**
   * Buffet pricing.
   *
   * Three bands, not two: the weekday price now splits at 15:00, so lunch and
   * the evening sitting cost different amounts. Kept as an ordered array rather
   * than named `weekday` / `weekend` keys so a fourth band (a holiday price,
   * say) is a one-line addition rather than a refactor of every component.
   *
   * The array order is the order they are shown, cheapest first — which is also
   * the order a customer wants to read them in.
   */
  buffet: {
    tiers: [
      {
        id: "lunch",
        days: { en: "Mon – Fri", fi: "Ma – Pe" },
        time: { en: "10:30 – 15:00", fi: "10:30 – 15:00" },
        price: 14.99,
        /** The headline price — the one quoted as "from" everywhere else. */
        highlight: true,
      },
      {
        id: "evening",
        days: { en: "Mon – Fri", fi: "Ma – Pe" },
        time: { en: "15:00 – 20:00", fi: "15:00 – 20:00" },
        price: 17.99,
        highlight: false,
      },
      {
        id: "weekend",
        days: { en: "Sat & Sun", fi: "La & Su" },
        time: { en: "Sat 10:30 – 20:00 · Sun 12:00 – 20:00", fi: "La 10:30 – 20:00 · Su 12:00 – 20:00" },
        price: 18.99,
        highlight: false,
      },
    ],
    kids: [
      { label: { en: "Under 5 years", fi: "Alle 5-vuotiaat" }, price: 5 },
      { label: { en: "5 – 10 years", fi: "5 – 10-vuotiaat" }, price: 10 },
    ],
  },
} as const;

/**
 * The "from" price — the cheapest buffet band.
 *
 * Derived rather than written down a second time: the home page medallion and
 * the stats band both quote it, and a hardcoded copy is exactly the sort of
 * thing that survives a price change and quietly advertises last year's price.
 */
export const BUFFET_FROM = Math.min(...SITE.buffet.tiers.map((t) => t.price));

/** Photography served from the restaurant's own media library.
 *  Routed through next/image → responsive AVIF/WebP + brand colour-grade. */
export const PHOTOS = {
  hero: "https://pasargadseppala.fi/wp-content/uploads/2025/02/20241024_104254.jpg",
  interior1: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1554-min.jpg",
  interior2: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1470-min.jpg",
  interior3: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1454-min.jpg",
  food1: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1503-min.jpg",
  food2: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1500-min.jpg",
  food3: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1539-min.jpg",
  food4: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1546-min.jpg",
  food5: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1523-min.jpg",
  food6: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1478-min.jpg",
  food7: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1441-min.jpg",
  food8: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1464-min.jpg",
  food9: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1486-min.jpg",
  buffet1: "https://pasargadseppala.fi/wp-content/uploads/2024/09/IMG-20240910-WA0032.jpg",
  buffet2: "https://pasargadseppala.fi/wp-content/uploads/2024/09/IMG-20240910-WA0022.jpg",
} as const;

export const GALLERY = [
  PHOTOS.food1, PHOTOS.interior1, PHOTOS.food3, PHOTOS.buffet1,
  PHOTOS.food5, PHOTOS.interior2, PHOTOS.food7, PHOTOS.buffet2,
  PHOTOS.food2, PHOTOS.interior3, PHOTOS.food4, PHOTOS.food6,
  PHOTOS.food8, PHOTOS.food9, PHOTOS.hero,
];

/**
 * Hero reveal frames, in order: flames high → flames dying → dish emerging →
 * finished dish. Cross-faded by <FireDish />.
 *
 * Drop in fewer frames and the component still works — it always settles on
 * the last one, and a single-entry array renders as a plain photo.
 */
/**
 * Generated dish photography, for menu items the restaurant has no usable
 * photo of. Same pre-launch note as FIRE_FRAMES: download these into
 * `public/menu/` and point the paths locally before going live.
 */
export const GEN = {
  laalMaas: "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_192513_76bb5a00-d412-46d4-b214-21da795b2ace.png",
  kozhiVartha: "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_192513_d1314cc6-753c-4e83-ab69-728836c40ca1.png",
  beefVindaloo: "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_192513_b2487db4-affb-47ac-9ba3-14cb2b0ea649.png",
  lambTikkaMasala: "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_191215_04c107b2-291b-4b89-b42d-257dfe31b41e.png",
  murghMakhni: "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_190453_1409c12e-43ee-4ef0-aac4-a95c86f28085.png",
  pizzaClassic: "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_190453_e2a2e05f-fe3e-4d9a-8afb-f484adfa4e9d.png",
  pizzaVegan: "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_190453_c3ae9b59-382c-4cae-b549-a2f1a3c0f98f.png",
} as const;

export const FIRE_FRAMES: string[] = [
  // Stage 1 — flames high, dish hidden
  "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_183649_7fb7a63b-7fa7-4a32-9a0b-6a71227f08e0.png",
  // Stage 2 — flames receding
  "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_183649_ecccbf2a-2a6d-40cc-861d-e896ec219f91.png",
  // Stage 3 — embers, dish emerging through steam
  "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_183649_6d71947a-6314-4f4c-8f21-76ba9009c5c0.png",
  // Stage 4 — finished lamb tikka masala (settles here)
  "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_183649_5ae0730e-29b3-467c-9971-b91e5a3a8693.png",
];

/**
 * Backdrop for each inner page's cinematic <PageHero />.
 *
 * Kept together rather than scattered across the five view components so the
 * set can be judged as a set — the pages should read as one shoot, and the
 * three fire frames should not all land on adjacent pages in the nav.
 *
 * The order in the nav is menu · buffet · shop · reservations · contact, so
 * the sequence runs dish → fire → dish → embers → fire: never two of the same
 * kind back to back.
 */
export const HERO_ART = {
  menu: GEN.lambTikkaMasala,      // the plate, in full colour
  buffet: FIRE_FRAMES[0],         // flames high — the buffet's live grill
  shop: GEN.murghMakhni,          // the house favourite, appetite-first
  reservations: FIRE_FRAMES[2],   // embers and steam: the warm, low-lit room
  contact: FIRE_FRAMES[1],        // flames receding
} as const;
