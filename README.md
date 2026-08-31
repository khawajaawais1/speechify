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

3. **Changing an image `quality` value.** Next 16 only serves quality levels
   declared in `images.qualities` in `next.config.ts` (currently `[45, 75, 82]`).
   Pass anything else to `<Photo quality={…} />` and the optimizer returns 400
   and logs `next-image-unconfigured-qualities`. Add the value to that array.

### Hydration warning mentioning `<body>`

If the diff shows an attribute like `cz-shortcut-listen`, `data-gr-…` or
`data-new-gr-c-s-check-loaded`, that is a browser extension (ColorZilla,
Grammarly, a password manager) editing the page before React hydrates — not a
bug in the site. `<body>` carries `suppressHydrationWarning` for exactly this.
It only silences body's own attributes, so real hydration bugs still surface.

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

### The fire → dish scroll sequence

`<FireStory />` is a 320svh section with a `sticky` stage inside, so **scroll
position is the timeline**: scroll down and the flames build, keep going and
they burn down to the finished dish. Scrolling back rewinds it.

**What keeps it smooth.** Everything here is about doing as little as possible
per frame:

- Progress runs through `useSpring`. A mouse wheel moves scroll in large
  discrete jumps; mapping those straight to opacity reads as a flicker. Damping
  turns the same input into a continuous glide. This is the single biggest win.
- Only `opacity` and `transform` animate — both compositor properties, so no
  layout and no paint.
- Every layer carries `.fire-layer` (`will-change` + `translateZ(0)`) so the
  browser holds it as a texture instead of re-rasterising a full-screen image on
  each scroll tick.
- **No `mix-blend-mode` and no animated `filter: blur()`** over full-screen
  elements. Both force a repaint of the entire stage every frame and were the
  main source of jank in the first version.
- The zoom is applied once to a wrapper, never per-frame.
- Embers are desktop-only (`hidden sm:block`) and capped at six.

**Why the copy is a keyed swap, not a cross-fade.** Two overlapping blocks whose
opacities must stay perfectly complementary will show *both* captions at once if
the motion values fail to attach — which is exactly what happened. A single
`late` flag now renders one block or the other, so overlap is structurally
impossible.

Tuning: `SCROLL_LENGTH_VH` at the top of the file controls pace — larger is
slower and calmer. The spring config on `p` controls how much the scrub lags
behind the wheel.

**Do not wrap this section in the `.defer` helper.** `content-visibility` and
any ancestor `overflow: hidden` both break `position: sticky`. It is also why
`body` uses `overflow-x: clip` rather than `hidden` — `clip` does not create a
scroll container. The section height is set inline for the same reason: if that
class ever failed to generate, the section would collapse onto its sticky child
and the scrub would silently stop working.

Fallbacks: `prefers-reduced-motion` and `<noscript>` both render a single static
panel with the finished dish. The frames are not `priority` — the section is
below the fold and eager-loading them would compete with the hero for
largest-contentful-paint.

The hero itself is a single static image (the final frame). Two competing fire
animations on one page fought each other, and a static hero keeps LCP fast.

### Images — where they live, and hosting them yourself

`public/` is the folder the site serves files from. Today it holds only the logo
SVGs and the app icon — **every photo is loaded from somewhere else**:

| Source | What | Defined in |
|---|---|---|
| `pasargadseppala.fi` | 15 real restaurant photos, from the old WordPress media library | `PHOTOS` in `src/data/site.ts` |
| Higgsfield CDN | 4 generated dish shots + 4 fire-sequence frames | `GEN` and `FIRE_FRAMES`, same file |

That is fine for review but neither is a URL you control. If the old WordPress
site comes down, or the generation CDN expires a file, images start 404-ing in
production.

### Dishes without a photo

Leave `img` off a product and `<DishTile />` renders a branded gradient tile
with a category icon instead. **No dish is on a tile right now** — all 79 have a
photo. The component stays as the safety net: add a product without an `img` and
it gets a branded tile rather than a broken frame or a borrowed picture.

The rule the tile exists to enforce: **never borrow another dish's photo.** A
customer orders expecting what they saw, so a wrong photo is worse than no photo.
A tile reads as intentional, keeps the grid rhythm and costs nothing to load.

To fill one, drop a photo in `public/menu/` and add `img: "/menu/<id>.jpg"`.

### Packshots (`packshot: true`)

The six drinks are not plated dishes — they are supplier product shots: a tall
can or bottle cut out on a white studio ground. Cropping one to fill the card's
4:3 frame slices the lid and base off and leaves an unreadable middle band, so
these opt out with `packshot: true`:

- the image is **contained** and padded rather than cropped;
- the frame is **white**, so it meets the shot's own background seamlessly;
- **colour grading is skipped** — the site's warm tint pushes Pepsi blue green.

Set it on any future bottle, can or packaged product. Both the product card and
the cart thumbnail honour it. Note these are brand-owned images; ask your drinks
supplier for their official press pack if you want them on firmer footing.

### Adding your own dish photos

Drop a photo in `public/menu/` named after the product id (see `src/data/products.ts`)
and set `img: "/menu/<id>.jpg"` on that product. Anything under `public/` is served
from the root, so `public/menu/palak-paneer.jpg` is `/menu/palak-paneer.jpg`.

**Resize before committing.** Straight-from-camera files are 3–18 MB each. Next
resizes them on request, but the originals still ship in the repo and in the
deploy, and very large sources are slow (and on some hosts fail) to optimise.
2000px on the long edge at quality 82 is plenty — the biggest place any dish
photo renders is about 1600px. That took the first batch from 52 MB to 3 MB with
no visible difference.

**To pull everything local, run:**

```bash
npm run images:local
```

It downloads all 23 files into `public/photos/`, `public/menu/` and
`public/hero/`, then prints a ready-made `PHOTOS` / `GEN` / `FIRE_FRAMES` block
to paste over the originals. After that, delete the `pasargadseppala.fi` and
`cloudfront.net` entries from `images.remotePatterns` in `next.config.ts` —
nothing remote will be left.

`GEN` exists because several dishes were showing a photo of something else:
Murgh Makhni had a biryani, Lamb Tikka Masala had a whole lamb shank, and every
pizza had a skewer grill. The shank photo was not discarded — it stayed on Gosht
Tar Kalia, which genuinely is a lamb shank dish. **The swap was done per
category, not globally**: `PHOTOS.food5` and `food6` are still used by beef
vindaloo, dal tadka, beef sali boti and subz dum biryani.


## 7. Photography

Images are the restaurant's own files, served through the Next.js image
optimizer: original heavy JPEGs are re-encoded to **AVIF/WebP** at nine
responsive widths and colour-graded to the palette via the `.grade` layer. That
alone is the single biggest speed and quality win over the old WordPress site.

To move to new photography, drop files into `public/` and change the paths in
`PHOTOS` in `src/data/site.ts`. Allowed remote hosts are listed in
`next.config.ts`.

## 8. Deploy

### Pre-flight

```bash
npm run preflight     # the launch checklist, exits non-zero on a blocker
npm run check         # types + lint + preflight, all three
```

`preflight` checks the things that are invisible in development and expensive in
production: images still served from a domain you do not own, a missing Stripe
key or site URL, oversized files in `public/`, a `/menu/…` path that points at a
file that isn't there, translation drift between the two dictionaries, a `t()`
call whose key does not exist, duplicate product ids, and any discount that is
larger than its own list price.

Run it until it prints **Ready for production**.

### The one blocker it will report today

Twenty-eight images still load from `pasargadseppala.fi` and the Higgsfield CDN
— domains that can disappear without warning, taking the photography with them.

```bash
npm run images:local          # downloads all of them into public/
```

Paste the block it prints over `PHOTOS` / `GEN` / `FIRE_FRAMES` in
`src/data/site.ts`, then delete the two remote hosts from `images.remotePatterns`
in `next.config.ts`. Re-run `npm run preflight` to confirm.

### Then

```bash
npm run build && npm start
```

**Vercel** — import the repo, add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_SITE_URL`
as environment variables, deploy. Point the `pasargadseppala.fi` DNS at Vercel
when you're happy with it. Any Node host works too, behind a reverse proxy.

`NEXT_PUBLIC_SITE_URL` is not optional in production: canonical URLs, the
sitemap and Stripe's return URLs are all built from it, and without it the
checkout route falls back to trusting the request's `Origin` header — which the
caller controls.

### What is served

| Path | What it is |
|---|---|
| `/sitemap.xml` | Both language trees, with hreflang pairing |
| `/robots.txt` | Allows everything except `/api/` and the checkout return pages |
| JSON-LD | `Restaurant` — hours, address, menu, socials, and the reviews shown on the page |

Security headers (`nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS,
`X-Frame-Options`) are set in `next.config.ts`. There is deliberately no strict
Content-Security-Policy: this app and Next both emit inline scripts, so a strict
CSP needs per-request nonces, and that forces every page out of static rendering.

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
