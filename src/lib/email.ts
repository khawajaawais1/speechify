import nodemailer from "nodemailer";
import { money } from "./i18n";
import { SITE } from "@/data/site";

export type OrderItem = { name: string; qty: number; amount: number };

type SendOrderEmailParams = {
  to: string;
  name?: string;
  locale: "en" | "fi";
  mode: "delivery" | "pickup";
  note?: string;
  items: OrderItem[];
  total: number;
  orderId: string;
};

const COPY = {
  en: {
    subject: "Your order is confirmed — Pasargad Indian Cuisine",
    hello: (name?: string) => (name ? `Hi ${name},` : "Hi,"),
    intro: "Thanks for your order! Here's what we're preparing:",
    mode: { delivery: "Delivery", pickup: "Pickup" },
    total: "Total",
    note: "Note to the kitchen",
    order: "Order",
  },
  fi: {
    subject: "Tilauksesi on vahvistettu — Pasargad Indian Cuisine",
    hello: (name?: string) => (name ? `Hei ${name},` : "Hei,"),
    intro: "Kiitos tilauksestasi! Tässä mitä valmistamme:",
    mode: { delivery: "Kotiinkuljetus", pickup: "Nouto" },
    total: "Yhteensä",
    note: "Viesti keittiölle",
    order: "Tilaus",
  },
} as const;

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Built lazily (not at module load) so a missing SMTP config fails loudly on
 * first send rather than crashing the whole route at import time, and so the
 * env vars are read fresh rather than baked in at build time.
 */
let transporter: ReturnType<typeof nodemailer.createTransport> | null | undefined;

function getTransporter() {
  if (transporter !== undefined) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    transporter = null;
    return transporter;
  }
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

export async function sendOrderConfirmationEmail(p: SendOrderEmailParams) {
  const t = COPY[p.locale];
  const tx = getTransporter();
  if (!tx) {
    console.error("[email] SMTP_HOST/SMTP_USER/SMTP_PASS not set — skipping order confirmation email.");
    return;
  }

  const orderNumber = p.orderId.slice(-8).toUpperCase();
  const footer = `${SITE.fullName} · ${SITE.address.street}, ${SITE.address.postal} ${SITE.address.city} · ${SITE.phone}`;

  const rows = p.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0">${i.qty} × ${escapeHtml(i.name)}</td><td style="padding:6px 0;text-align:right;white-space:nowrap">${money(i.amount, p.locale)}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:Georgia,'Times New Roman',serif;max-width:480px;margin:0 auto;color:#221310">
      <h2 style="color:#c1272d;margin-bottom:4px">${t.order} #${orderNumber}</h2>
      <p>${t.hello(p.name)}</p>
      <p>${t.intro}</p>
      <p style="font-weight:bold">${t.mode[p.mode]}</p>
      <table style="width:100%;border-collapse:collapse">${rows}</table>
      <p style="text-align:right;font-weight:bold;font-size:1.1em;border-top:1px solid #ead9c0;padding-top:8px;margin-top:4px">
        ${t.total}: ${money(p.total, p.locale)}
      </p>
      ${p.note ? `<p><strong>${t.note}:</strong> ${escapeHtml(p.note)}</p>` : ""}
      <hr style="border:none;border-top:1px solid #ead9c0;margin:24px 0" />
      <p style="font-size:0.8em;color:#7b6156">${footer}</p>
    </div>
  `;

  const text = [
    `${t.order} #${orderNumber}`,
    t.hello(p.name),
    t.intro,
    t.mode[p.mode],
    "",
    ...p.items.map((i) => `${i.qty} x ${i.name} — ${money(i.amount, p.locale)}`),
    "",
    `${t.total}: ${money(p.total, p.locale)}`,
    p.note ? `${t.note}: ${p.note}` : "",
    "",
    footer,
  ]
    .filter((l) => l !== "")
    .join("\n");

  try {
    await tx.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: p.to,
      subject: t.subject,
      text,
      html,
    });
  } catch (err) {
    console.error("[email] send failed:", err instanceof Error ? err.message : err);
  }
}
