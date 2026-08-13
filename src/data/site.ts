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
  rating: { score: 5.0, count: 4 },
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
    zones: [
      { km: 5, fee: 0 },
      { km: 7, fee: 5 },
    ],
  },
  buffet: {
    weekday: { price: 14, days: { en: "Mon – Fri", fi: "Ma – Pe" }, time: "10:30 – 20:00" },
    weekend: { price: 17, days: { en: "Sat & Sun", fi: "La & Su" }, time: "10:30 – 20:00 / 12:00 – 20:00" },
    kids: [
      { label: { en: "Under 5 years", fi: "Alle 5-vuotiaat" }, price: 5 },
      { label: { en: "5 – 10 years", fi: "5 – 10-vuotiaat" }, price: 10 },
    ],
  },
} as const;

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
