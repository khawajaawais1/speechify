# Pasargad Indian Cuisine — 2026 rebrand

A full rebuild of **pasargadseppala.fi**: new brand system, motion-led marketing
site and a built-in online shop with Stripe checkout.

| | |
|---|---|
| **Stack** | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion (Framer Motion) · Stripe |
| **Languages** | Finnish (default) + English, at `/fi` and `/en` |
| **Routes** | 23 prerendered pages + 1 API route |
| **Hosting** | Vercel (zero-config), or any Node host |

---

## 1. Run it

```bash
npm install
cp .env.example .env.local     # then paste your Stripe test key
npm run dev                    # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

### If the build fails

Almost always one of two things:

1. **Stale `.next` cache — by far the most common.** Next writes a type
   validator into `.next/types` listing every route. Delete or rename a page
   and that file still references the old one, so `tsc` fails with
   `Cannot find module '../../src/app/.../page.js'` even though the code is
   fine. Any time a route is added or removed, delete the folder:
   `rmdir /s /q .next` on Windows, `rm -rf .next` elsewhere.
2. **No network at build time.** Fonts are self-hosted via `next/font`, which
   downloads Fraunces and Inter from Google *during the build*. Behind a proxy,
   set `HTTPS_PROXY`, or the build fails with "Failed to fetch Fraunces".

## 2. Turn on payments

1. Create a Stripe account → **Developers → API keys**.
2. Put the **secret** key in `.env.local` as `STRIPE_SECRET_KEY`.
   Start with `sk_test_…`; swap to `sk_live_…` when you're ready to take real money.
3. In Stripe → **Settings → Payment methods**, enable Cards, Apple Pay, Google Pay
   and Klarna. MobilePay is available for Finnish accounts.
4. Test with card `4242 4242 4242 4242`, any future expiry, any CVC.

Checkout is **Stripe Checkout** (hosted, PCI-compliant). Card details never touch
this site.

### Security note
`src/app/api/checkout/route.ts` **re-prices every basket from the server-side
catalogue**. Prices, delivery fees and order minimums sent by the browser are
ignored. Tampering with the client cannot change what a customer is charged.

## 3. Where things live

```
src/
  data/
    site.ts        Address, hours, delivery zones, fees, photo URLs
    products.ts    The full catalogue (86 items, 11 categories) — edit prices here
    buffet.ts      The 7-day buffet rotation
  lib/
    i18n.ts        FI/EN dictionary + € formatting
    cart.tsx       Cart state, localStorage persistence, fee maths
    motion.ts      Shared easings and animation variants
  components/
    home/          The animated home-page sections
    pages/         Menu, Shop, Buffet, Gallery, Reservations, Contact views
    …              Nav, Footer, CartDrawer, ProductCard, SplitText, Magnetic…
  app/
    [locale]/      All pages, per language
    api/checkout/  Stripe Checkout session creation
```

### Changing a price
Open `src/data/products.ts`, edit `price` (list price) or `offer` (campaign
price). The menu, the shop, the cart and Stripe all read from that one place.

### Changing hours, fees or the address
`src/data/site.ts`. The footer, contact page, shop banner, cart maths and the
Google structured data all derive from it.

## 4. Brand system

Warm cream canvas, logo crimson and gold, saffron heat. Every surface and text
colour is a **semantic token** — change the six values at the top of
`src/app/globals.css` and the whole site re-themes.

| Token | Value | Use |
|---|---|---|
| `canvas` | `#fdf8f0` | Page background (warm ivory, not white) |
| `canvas-2` | `#f8efdf` | Alternating band |
| `card` | `#ffffff` | Raised cards |
| `ink` | `#221310` | Headings |
| `ink-soft` | `#4a332b` | Body copy |
| `muted` | `#7b6156` | Secondary copy |
| `faint` | `#806a59` | Captions, meta |
| `line` | `#ead9c0` | Hairlines |
| `crimson-500` | `#c1272d` | Logo red — eyebrows, active pills, prices |
| `gold-600` | `#a4741d` | Rating stars, hairline accents |
| `saffron-500` | `#f5a524` | Heat, primary CTA gradient |
| `ember-500` | `#e4572e` | Chilli / discount |
| `cardamom-500` | `#3c8248` | Veg & vegan markers |

Two brand gradients do the heavy lifting: `.bg-sun` (saffron → ember) on primary
CTAs, and `.bg-crimson-grad` (logo red) on the ticker, closing panels and
category chips.

**Contrast is checked, not guessed.** Every text/background pair in the palette
meets WCAG AA (4.5:1 for body, 3:1 for meaningful graphics) — including the
tinted diet tags, the free-delivery hint and the rating stars.

Display type **Fraunces**, UI type **Inter** — both self-hosted through
`next/font`, so no requests go to Google's CDN (GDPR-friendly for EU visitors).

## 5. Logo

A single crimson stroke draws the "P" — stem down the left, bowl sweeping up and
round. A saffron fork sits in the counter, with two saffron leaves on the
shoulder. Wordmark in Fraunces, tagline letterspaced beneath.

| File | Use |
|---|---|
| `public/brand/pasargad-mark.svg` | Symbol on its own |
| `public/brand/pasargad-horizontal.svg` | Default lockup |
| `public/brand/pasargad-stacked.svg` | Signage, social avatars, menus |
| `public/brand/pasargad-reversed.svg` | On crimson, ink or photography |
| `public/brand/pasargad-icon.svg` | Favicon / app icon (also `src/app/icon.svg`) |

In React use `<Monogram />` or `<Wordmark />` from `src/components/Logo.tsx`.
Both take `tone="brand" | "reversed"`; `<Wordmark tagline />` adds
TASTE. QUALITY. TRADITION. (the footer uses it, the nav does not).

**Why the icon is a different drawing.** The hairline strokes stop reading below
about 24 px, so the favicon uses a heavier weight of the P and fork on a crimson
tile rather than a shrunken version of the main mark.

Colours: crimson `#C1272D` for the letterform and name, saffron `#F5A524` for
the fork and both leaves.

The lockups use live text so the wordmark stays crisp on the web — **convert to
outlines before sending anything to a printer or sign maker**, otherwise
Fraunces has to be installed on their machine. Clear space: one leaf-height on
every side. Minimum mark height 24 px on screen, 10 mm in print.

## 6. Motion

Built with **Motion** (the Framer Motion package). Highlights:

- Scroll-linked parallax in the hero, buffet and story sections (`useScroll` / `useTransform`)
- Per-word masked text reveals (`SplitText`)
- Shared-layout pills on the nav, category chips, buffet days and cart mode toggle (`layoutId`)
- Magnetic, cursor-following primary buttons
- Animated count-up statistics
- Dual-direction gallery marquees
- Spring-physics cart drawer with animated line-item add/remove
- Shared-element gallery lightbox

Everything respects `prefers-reduced-motion`.

## 7. Photography

Images are the restaurant's own files, served through the Next.js image
optimizer: original heavy JPEGs are re-encoded to **AVIF/WebP** at nine
responsive widths and colour-graded to the palette via the `.grade` layer. That
alone is the single biggest speed and quality win over the old WordPress site.

To move to new photography, drop files into `public/` and change the paths in
`PHOTOS` in `src/data/site.ts`. Allowed remote hosts are listed in
`next.config.ts`.

## 8. Deploy

**Vercel** — import the repo, add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_SITE_URL`
as environment variables, deploy. Point the `pasargadseppala.fi` DNS at Vercel
when you're happy with it.

Any Node host works too: `npm run build && npm start` behind a reverse proxy.

## 9. Google reviews

`src/data/reviews.ts` drives the reviews carousel. Everything in it is real:
the Google reviews were transcribed from the restaurant's Google listing, and
the Tripadvisor ones link back to the review they came from.

- `GOOGLE.count` — 441, from the live listing.
- `GOOGLE.rating` — deliberately `null`. The badge shows the word and the stars
  (the way Google's own summary widget does) rather than a number I could not
  verify. Put your real score here and the header prints it as well.
- `REVIEWS` — add or reorder freely; each entry carries its own source, so the
  card picks the right badge.

**To pull Google reviews live instead of pasting them:**

1. Google Cloud console → enable **Places API** → create an API key.
2. Add `GOOGLE_PLACES_API_KEY` and your `GOOGLE_PLACE_ID` to `.env.local`.
3. Add an API route calling Place Details with
   `fields=rating,userRatingCount,reviews`, cached with
   `next: { revalidate: 86400 }` (Google's terms don't allow storing reviews
   long-term), and pass the result into `<Reviews />` with this file as fallback.

The Places API only ever returns five reviews, so a curated list is worth
keeping either way.

## 10. Worth doing next

- Stripe **webhook** (`checkout.session.completed`) to print tickets in the kitchen or email orders
- Opening-hours guard so the shop closes itself outside delivery hours
- Real reservation backend (the form currently opens a pre-filled email)
- Swap the à la carte descriptions for photographed dish shots
