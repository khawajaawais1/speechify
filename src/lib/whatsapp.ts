export type OrderItem = { name: string; qty: number; amount: number };

type OrderAlertParams = {
  orderId: string;
  mode: "delivery" | "pickup";
  name?: string;
  email?: string;
  phone?: string;
  note?: string;
  items: OrderItem[];
  total: number;
};

/**
 * Posts a plain-text alert to WHATSAPP_TO_NUMBER via the Meta WhatsApp Cloud
 * API. Freeform text like this only delivers within the 24-hour window after
 * that number last messaged the business number — fine for a restaurant
 * owner who messages their own bot number occasionally, but if alerts start
 * silently failing after a day of inactivity, the fix is an approved message
 * template (Meta Business Manager), not a code change here.
 */
export async function sendWhatsAppOrderAlert(p: OrderAlertParams) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = process.env.WHATSAPP_TO_NUMBER;
  if (!token || !phoneNumberId || !to) {
    console.error(
      "[whatsapp] WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_TO_NUMBER not set — skipping order alert.",
    );
    return;
  }

  const orderNumber = p.orderId.slice(-8).toUpperCase();
  const lines = [
    `New order #${orderNumber}`,
    p.mode === "pickup" ? "Pickup" : "Delivery",
    "",
    ...p.items.map((i) => `${i.qty} x ${i.name} - EUR ${i.amount.toFixed(2)}`),
    "",
    `Total: EUR ${p.total.toFixed(2)}`,
    p.name ? `Customer: ${p.name}` : "",
    p.phone ? `Phone: ${p.phone}` : "",
    p.email ? `Email: ${p.email}` : "",
    p.note ? `Note: ${p.note}` : "",
  ].filter((l) => l !== "");

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: lines.join("\n"), preview_url: false },
      }),
    });
    if (!res.ok) {
      console.error("[whatsapp] send failed:", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("[whatsapp] send failed:", err instanceof Error ? err.message : err);
  }
}
