import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PRODUCTS, effectivePrice } from "@/data/products";
import { SITE } from "@/data/site";

export const runtime = "nodejs";

type Body = {
  lines: { id: string; qty: number }[];
  mode: "delivery" | "pickup";
  note?: string;
  locale?: "en" | "fi";
};

const cents = (n: number) => Math.round(n * 100);

/**
 * Errors reach a customer mid-purchase, so they are localised and written for
 * a person rather than a developer. Stripe's own message is deliberately not
 * forwarded: it is English-only, often mentions API objects, and can echo
 * account configuration back to the browser. It is logged instead.
 */
const MSG = {
  unconfigured: {
    fi: "Verkkomaksu ei ole vielä käytössä. Soita meille, niin otamme tilauksen vastaan puhelimitse.",
    en: "Online payment isn't switched on yet. Give us a call and we'll take your order by phone.",
  },
  malformed: {
    fi: "Tilausta ei voitu lukea. Päivitä sivu ja yritä uudelleen.",
    en: "We couldn't read that order. Refresh the page and try again.",
  },
  empty: {
    fi: "Ostoskori on tyhjä.",
    en: "Your basket is empty.",
  },
  failed: {
    fi: "Maksun avaaminen epäonnistui. Yritä hetken kuluttua uudelleen tai soita meille.",
    en: "We couldn't open the payment page. Try again in a moment, or give us a call.",
  },
} as const;

const minimumMsg = (l: "en" | "fi", mode: "delivery" | "pickup", min: number) =>
  l === "fi"
    ? `${mode === "pickup" ? "Noudon" : "Kotiinkuljetuksen"} minimitilaus on ${min
        .toFixed(2)
        .replace(".", ",")} €.`
    : `Minimum order for ${mode} is €${min.toFixed(2)}.`;

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: MSG.malformed.fi }, { status: 400 });
  }

  const mode = body.mode === "pickup" ? "pickup" : "delivery";
  const locale = body.locale === "en" ? "en" : "fi";

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // 503, not 501: the endpoint exists and will work once the key is set.
    console.error("[checkout] STRIPE_SECRET_KEY is not set — no session created.");
    return NextResponse.json({ error: MSG.unconfigured[locale] }, { status: 503 });
  }

  // Re-price everything server-side. Never trust prices from the client.
  const items = (body.lines ?? [])
    .map(({ id, qty }) => {
      const product = PRODUCTS.find((p) => p.id === id);
      if (!product) return null;
      const q = Math.max(1, Math.min(50, Math.floor(Number(qty) || 0)));
      return { product, qty: q, unit: effectivePrice(product) };
    })
    .filter(Boolean) as { product: (typeof PRODUCTS)[number]; qty: number; unit: number }[];

  if (items.length === 0) {
    return NextResponse.json({ error: MSG.empty[locale] }, { status: 400 });
  }

  const subtotal = +items.reduce((s, i) => s + i.unit * i.qty, 0).toFixed(2);
  const minimum = mode === "pickup" ? SITE.order.minPickup : SITE.order.minDelivery;
  if (subtotal < minimum) {
    return NextResponse.json({ error: minimumMsg(locale, mode, minimum) }, { status: 400 });
  }

  const deliveryFee =
    mode === "pickup" || subtotal >= SITE.order.freeDeliveryOver ? 0 : SITE.order.zones[1].fee;

  /**
   * Where Stripe sends the customer back to.
   *
   * `NEXT_PUBLIC_SITE_URL` is preferred over the Origin header, which is
   * attacker-controlled: anyone can POST here with `Origin: https://evil.test`
   * and receive a Stripe session whose success_url points at their own site.
   * The header is only used as a development fallback.
   */
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const origin = configured ?? req.headers.get("origin") ?? "http://localhost:3000";
  const isPublic = /^https:\/\//.test(origin) && !/localhost|127\.0\.0\.1/.test(origin);

  /**
   * Stripe requires absolute URLs for product images and rejects the whole
   * session if it gets a relative path — which is what most of the catalogue
   * holds (`/menu/kebab.jpg`). Stripe also fetches them from its own servers,
   * so a localhost URL is useless: images are omitted in development.
   */
  const absolute = (src?: string) => {
    if (!src) return undefined;
    if (/^https?:\/\//.test(src)) return src;
    return isPublic ? `${origin}${src}` : undefined;
  };

  const stripe = new Stripe(key);

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((i) => {
    const image = absolute(i.product.img);
    return {
      quantity: i.qty,
      price_data: {
        currency: "eur",
        unit_amount: cents(i.unit),
        product_data: {
          name: (locale === "fi" && i.product.nameFi) || i.product.name,
          description: ((locale === "fi" && i.product.descFi) || i.product.desc)?.slice(0, 240),
          ...(image ? { images: [image] } : {}),
        },
      },
    };
  });

  lineItems.push({
    quantity: 1,
    price_data: {
      currency: "eur",
      unit_amount: cents(SITE.order.serviceFee),
      product_data: { name: locale === "fi" ? "Palvelumaksu" : "Service fee" },
    },
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Left unset, Checkout falls back to the account's default payment
      // method configuration, which ships with a grab-bag of regional
      // methods switched on (Bancontact, EPS, MB WAY, BLIK, KakaoPay,
      // NaverPay, Pix…) — none relevant to a Finnish restaurant. `card` also
      // surfaces Apple Pay / Google Pay automatically as an express-checkout
      // button when the browser and domain are eligible, so this is not a
      // loss of those options.
      payment_method_types: ["card"],
      line_items: lineItems,
      locale: locale === "fi" ? "fi" : "en",
      customer_creation: "always",
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      success_url: `${origin}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/checkout/cancel`,
      metadata: {
        fulfilment: mode,
        note: (body.note ?? "").slice(0, 480),
        restaurant: SITE.fullName,
        locale,
      },
      ...(mode === "delivery"
        ? {
            shipping_address_collection: { allowed_countries: ["FI"] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] },
            shipping_options: [
              {
                shipping_rate_data: {
                  type: "fixed_amount" as const,
                  fixed_amount: { amount: cents(deliveryFee), currency: "eur" },
                  display_name:
                    deliveryFee === 0
                      ? locale === "fi" ? "Ilmainen kotiinkuljetus" : "Free delivery"
                      : locale === "fi" ? "Kotiinkuljetus" : "Delivery",
                  delivery_estimate: {
                    minimum: { unit: "hour" as const, value: 1 },
                    maximum: { unit: "hour" as const, value: 1 },
                  },
                },
              },
            ],
          }
        : {}),
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    // Log the real reason; hand the customer something they can act on.
    console.error("[checkout] Stripe session failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: MSG.failed[locale] }, { status: 502 });
  }
}
