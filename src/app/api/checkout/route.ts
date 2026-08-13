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

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Payments are not configured yet. Add STRIPE_SECRET_KEY to .env.local." },
      { status: 501 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const mode = body.mode === "pickup" ? "pickup" : "delivery";
  const locale = body.locale === "en" ? "en" : "fi";

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
    return NextResponse.json({ error: "Your basket is empty." }, { status: 400 });
  }

  const subtotal = +items.reduce((s, i) => s + i.unit * i.qty, 0).toFixed(2);
  const minimum = mode === "pickup" ? SITE.order.minPickup : SITE.order.minDelivery;
  if (subtotal < minimum) {
    return NextResponse.json(
      { error: `Minimum order for ${mode} is €${minimum.toFixed(2)}.` },
      { status: 400 },
    );
  }

  const deliveryFee =
    mode === "pickup" || subtotal >= SITE.order.freeDeliveryOver ? 0 : SITE.order.zones[1].fee;

  const stripe = new Stripe(key);

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((i) => ({
    quantity: i.qty,
    price_data: {
      currency: "eur",
      unit_amount: cents(i.unit),
      product_data: {
        name: (locale === "fi" && i.product.nameFi) || i.product.name,
        description: ((locale === "fi" && i.product.descFi) || i.product.desc)?.slice(0, 240),
        ...(i.product.img ? { images: [i.product.img] } : {}),
      },
    },
  }));

  lineItems.push({
    quantity: 1,
    price_data: {
      currency: "eur",
      unit_amount: cents(SITE.order.serviceFee),
      product_data: { name: locale === "fi" ? "Palvelumaksu" : "Service fee" },
    },
  });

  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
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
                      : locale === "fi" ? "Kotiinkuljetus (enintään 7 km)" : "Delivery (up to 7 km)",
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
    const message = e instanceof Error ? e.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
