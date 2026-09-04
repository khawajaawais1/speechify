import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendOrderConfirmationEmail, type OrderItem } from "@/lib/email";
import { sendWhatsAppOrderAlert } from "@/lib/whatsapp";

export const runtime = "nodejs";

/**
 * Fires once Stripe confirms payment — not when the customer's browser
 * reaches /checkout/success, which they might close before it ever loads.
 * Needs the raw request body (not the parsed JSON) because Stripe signs the
 * exact bytes it sent; re-serialising a parsed object would break the
 * signature check.
 */
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !webhookSecret) {
    console.error("[webhook] STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET is not set.");
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();
  const stripe = new Stripe(key);

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("missing stripe-signature header");
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[webhook] signature verification failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Errors here are logged, not thrown: the payment already succeeded, and
    // there is no event store to de-duplicate a Stripe retry, so responding
    // with a non-200 here would risk a second attempt sending the customer a
    // duplicate confirmation email rather than fixing anything.
    try {
      const full = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items"],
      });

      const locale: "en" | "fi" = full.metadata?.locale === "en" ? "en" : "fi";
      const mode: "delivery" | "pickup" = full.metadata?.fulfilment === "pickup" ? "pickup" : "delivery";
      const note = full.metadata?.note || undefined;
      const email = full.customer_details?.email ?? undefined;
      const name = full.customer_details?.name ?? undefined;
      const phone = full.customer_details?.phone ?? undefined;

      const items: OrderItem[] = (full.line_items?.data ?? []).map((li) => ({
        name: li.description ?? "Item",
        qty: li.quantity ?? 1,
        amount: (li.amount_total ?? 0) / 100,
      }));
      if (full.shipping_cost?.amount_total) {
        items.push({
          name: locale === "fi" ? "Kotiinkuljetus" : "Delivery",
          qty: 1,
          amount: full.shipping_cost.amount_total / 100,
        });
      }
      const total = (full.amount_total ?? 0) / 100;

      await Promise.allSettled([
        email
          ? sendOrderConfirmationEmail({ to: email, name, locale, mode, note, items, total, orderId: full.id })
          : Promise.resolve(),
        sendWhatsAppOrderAlert({ orderId: full.id, mode, name, email, phone, note, items, total }),
      ]);
    } catch (err) {
      console.error("[webhook] processing checkout.session.completed failed:", err instanceof Error ? err.message : err);
    }
  }

  return NextResponse.json({ received: true });
}
