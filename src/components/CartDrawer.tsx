"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Bike, Loader2, Minus, Plus, ShoppingBag, Store, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useLocale, useT } from "@/lib/useLocale";
import { money } from "@/lib/i18n";
import { SITE } from "@/data/site";
import { EASE } from "@/lib/motion";
import { Photo } from "./Photo";

export function CartDrawer() {
  const c = useCart();
  const t = useT();
  const locale = useLocale();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: c.state.lines,
          mode: c.state.mode,
          note: c.state.note,
          locale,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (data.url) { window.location.href = data.url; return; }
      // The route already localises its errors; the key is the fallback for a
      // response that never reached it (a 502 from the host, say).
      setError(data.error ?? t("cart.errGeneric"));
    } catch {
      setError(t("cart.errNetwork"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {c.open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => c.setOpen(false)}
            className="fixed inset-0 z-[80] bg-ink/45 backdrop-blur-sm"
          />
          <motion.aside
            role="dialog" aria-label={t("cart.title")}
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 38 }}
            className="fixed inset-y-0 right-0 z-[81] flex w-full max-w-[27rem] flex-col border-l border-line bg-canvas shadow-lift"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <div>
                <h2 className="font-display text-xl font-semibold text-ink">{t("cart.title")}</h2>
                <p className="text-[0.72rem] text-faint">
                  {c.count} {c.count === 1 ? t("cart.item") : t("cart.items")}
                </p>
              </div>
              <button
                onClick={() => c.setOpen(false)} aria-label={t("a11y.close")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {c.lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-crimson-50">
                  <ShoppingBag className="h-7 w-7 text-crimson-400" />
                </div>
                <div>
                  <p className="font-display text-lg text-ink">{t("cart.empty")}</p>
                  <p className="mt-1 text-sm text-faint">{t("cart.emptySub")}</p>
                </div>
                <Link
                  href={`/${locale}/shop`} onClick={() => c.setOpen(false)}
                  className="rounded-full bg-crimson-500 px-6 py-3 text-sm font-bold text-white"
                >
                  {t("cart.browse")}
                </Link>
              </div>
            ) : (
              <>
                {/* Mode toggle */}
                <div className="px-6 pt-5">
                  <div className="relative grid grid-cols-2 rounded-full border border-line bg-card p-1 shadow-card">
                    {(["delivery", "pickup"] as const).map((m) => (
                      <button
                        key={m} onClick={() => c.setMode(m)}
                        className={`relative z-10 flex items-center justify-center gap-2 rounded-full py-2.5 text-[0.78rem] font-bold transition-colors ${
                          c.state.mode === m ? "text-white" : "text-muted hover:text-ink"
                        }`}
                      >
                        {c.state.mode === m && (
                          <motion.span
                            layoutId="mode-pill"
                            className="absolute inset-0 rounded-full bg-[linear-gradient(100deg,#ffb63f,#f5a524_50%,#e4572e)]"
                            transition={{ type: "spring", stiffness: 400, damping: 34 }}
                          />
                        )}
                        <span className="relative flex items-center gap-2">
                          {m === "delivery" ? <Bike className="h-3.5 w-3.5" /> : <Store className="h-3.5 w-3.5" />}
                          {m === "delivery" ? t("cart.deliver") : t("cart.pickup")}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lines */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <ul className="space-y-3">
                    <AnimatePresence initial={false}>
                      {c.lines.map((l) => {
                        const name = (locale === "fi" && l.product.nameFi) || l.product.name;
                        return (
                          <motion.li
                            key={l.product.id}
                            layout
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.32, ease: EASE }}
                            className="flex gap-3 overflow-hidden rounded-2xl border border-line bg-card p-3 shadow-card"
                          >
                            {l.product.img && (
                              <Photo
                                src={l.product.img} alt={name}
                                // Same reason as the product card: cropping a can
                                // to a 64px square leaves an unreadable middle band.
                                fit={l.product.packshot ? "contain" : "cover"}
                                grade={!l.product.packshot}
                                overlay={l.product.packshot ? "none" : "tint"}
                                className={`h-16 w-16 shrink-0 rounded-xl ${
                                  l.product.packshot ? "bg-white p-1.5" : ""
                                }`}
                                sizes="64px"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[0.85rem] font-semibold text-ink">{name}</p>
                              <p className="text-[0.72rem] text-faint">{money(l.unit, locale)} / {t("cart.each")}</p>
                              <div className="mt-2 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1 rounded-full border border-line p-0.5">
                                  <button
                                    onClick={() => c.dec(l.product.id)} aria-label={t("a11y.decrease")}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-sand-2"
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>
                                  <span className="w-5 text-center text-[0.78rem] font-bold tabular-nums text-ink">
                                    {l.qty}
                                  </span>
                                  <button
                                    onClick={() => c.add(l.product.id)} aria-label={t("a11y.increase")}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-sand-2"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                <span className="text-[0.85rem] font-bold tabular-nums text-crimson-600">
                                  {money(l.total, locale)}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => c.remove(l.product.id)} aria-label={t("a11y.remove")}
                              className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center self-start rounded-full text-faint transition-colors hover:bg-crimson-50 hover:text-crimson-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ul>

                  <label className="mt-5 block">
                    <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-widest text-faint">
                      {t("cart.note")}
                    </span>
                    <textarea
                      value={c.state.note}
                      onChange={(e) => c.setNote(e.target.value.slice(0, 300))}
                      placeholder={t("cart.notePlaceholder")}
                      rows={2}
                      className="w-full resize-none rounded-2xl border border-line bg-card px-4 py-3 text-[0.82rem] text-ink placeholder:text-faint focus:border-crimson-500/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson-500"
                    />
                  </label>

                  <button
                    onClick={c.clear}
                    className="mt-3 text-[0.72rem] font-semibold text-faint underline-offset-4 transition-colors hover:text-crimson-500 hover:underline"
                  >
                    {t("cart.clear")}
                  </button>
                </div>

                {/* Summary */}
                <div className="border-t border-line bg-card px-6 py-5 shadow-[0_-8px_24px_-16px_rgba(93,52,32,.25)]">
                  {c.freeDeliveryGap > 0 && (
                    <div className="mb-3 overflow-hidden rounded-xl border border-saffron-500/30 bg-saffron-100 px-3 py-2">
                      <p className="text-[0.72rem] font-medium text-saffron-700">
                        {t("cart.freeHint", { amount: money(c.freeDeliveryGap, locale) })}
                      </p>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white">
                        <motion.div
                          className="h-full bg-[linear-gradient(90deg,#f5a524,#e4572e)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (c.subtotal / SITE.order.freeDeliveryOver) * 100)}%` }}
                          transition={{ duration: 0.6, ease: EASE }}
                        />
                      </div>
                    </div>
                  )}

                  <dl className="space-y-1.5 text-[0.82rem]">
                    <div className="flex justify-between text-muted">
                      <dt>{t("cart.subtotal")}</dt>
                      <dd className="tabular-nums">{money(c.subtotal, locale)}</dd>
                    </div>
                    {c.state.mode === "delivery" && (
                      <div className="flex justify-between text-muted">
                        <dt>{t("cart.delivery")}</dt>
                        <dd className="tabular-nums">
                          {c.deliveryFee === 0 ? (
                            <span className="text-cardamom-400">{t("cart.free")}</span>
                          ) : money(c.deliveryFee, locale)}
                        </dd>
                      </div>
                    )}
                    <div className="flex justify-between text-muted">
                      <dt>{t("cart.service")}</dt>
                      <dd className="tabular-nums">{money(c.serviceFee, locale)}</dd>
                    </div>
                    <div className="!mt-3 flex justify-between border-t border-line pt-3 font-display text-lg font-semibold text-ink">
                      <dt>{t("cart.total")}</dt>
                      <dd className="tabular-nums text-crimson-600">{money(c.total, locale)}</dd>
                    </div>
                  </dl>

                  {!c.meetsMinimum && (
                    <p className="mt-3 rounded-xl border border-ember-500/40 bg-ember-100 px-3 py-2 text-[0.74rem] font-medium text-ember-600">
                      {t("cart.minWarn", {
                        amount: money(c.minimum - c.subtotal, locale),
                        mode: c.state.mode === "pickup" ? t("cart.pickup") : t("cart.deliver"),
                      })}
                    </p>
                  )}

                  {error && (
                    <p className="mt-3 rounded-xl border border-ember-500/40 bg-ember-100 px-3 py-2 text-[0.74rem] font-medium text-ember-600">
                      {error}
                    </p>
                  )}

                  <motion.button
                    whileHover={{ scale: c.meetsMinimum && !busy ? 1.02 : 1 }}
                    whileTap={{ scale: c.meetsMinimum && !busy ? 0.98 : 1 }}
                    disabled={!c.meetsMinimum || busy}
                    onClick={checkout}
                    className="relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full py-4 text-sm font-bold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="absolute inset-0 bg-[linear-gradient(100deg,#ffb63f,#f5a524_42%,#e4572e)]" />
                    <span className="relative flex items-center gap-2">
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {busy ? t("cart.processing") : t("cart.checkout")}
                    </span>
                  </motion.button>

                  <p className="mt-2.5 text-center text-[0.66rem] text-faint">
                    {SITE.order.etaMinutes} min · Visa · Mastercard · Apple&nbsp;Pay · Google&nbsp;Pay
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/** Sticky mobile bar that surfaces the basket on small screens. */
export function CartBar() {
  const c = useCart();
  const t = useT();
  const locale = useLocale();
  return (
    <AnimatePresence>
      {c.count > 0 && !c.open && (
        <motion.button
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 32 }}
          onClick={() => c.setOpen(true)}
          className="fixed inset-x-4 bottom-4 z-[62] flex items-center justify-between gap-4 rounded-full border border-crimson-500/40 bg-card/95 px-5 py-3.5 shadow-lift backdrop-blur-xl sm:hidden"
        >
          <span className="flex items-center gap-2 text-sm font-bold text-white">
            <ShoppingBag className="h-4 w-4" />
            {c.count} {c.count === 1 ? t("cart.item") : t("cart.items")}
          </span>
          <span className="font-display text-base font-semibold text-white tabular-nums">
            {money(c.total, locale)}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
