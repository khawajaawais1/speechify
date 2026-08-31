"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Flame, Leaf, Search, SlidersHorizontal, X } from "lucide-react";
import { PageHero } from "../PageHero";
import { ProductCard } from "../ProductCard";
import { useLocale, useT } from "@/lib/useLocale";
import { CATEGORIES, PRODUCTS, type CategoryId } from "@/data/products";
import { HERO_ART, SITE } from "@/data/site";
import { money } from "@/lib/i18n";
import { EASE } from "@/lib/motion";

type Diet = "veg" | "vegan" | "spicy";

export function ShopView() {
  const t = useT();
  const locale = useLocale();
  const params = useSearchParams();
  const initialCat = params.get("c") as CategoryId | null;

  const [cat, setCat] = useState<CategoryId | "all">(() =>
    initialCat && CATEGORIES.some((c) => c.id === initialCat) ? initialCat : "all",
  );
  const [q, setQ] = useState("");
  const [diets, setDiets] = useState<Diet[]>([]);

  const toggleDiet = (d: Diet) =>
    setDiets((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (cat !== "all" && p.cat !== cat) return false;
      if (diets.length && !diets.every((d) => p.tags?.includes(d))) return false;
      if (!needle) return true;
      return [p.name, p.nameFi, p.desc, p.descFi]
        .filter(Boolean)
        .some((s) => s!.toLowerCase().includes(needle));
    });
  }, [cat, q, diets]);

  const chips: { id: CategoryId | "all"; label: string }[] = [
    { id: "all", label: t("shop.all") },
    ...CATEGORIES.map((c) => ({ id: c.id, label: c.label[locale] })),
  ];

  return (
    <>
      <PageHero eyebrow={t("nav.shop")} title={t("shop.title")} sub={t("shop.sub")} image={HERO_ART.shop} />

      {/* Order info strip */}
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-card sm:grid-cols-3">
          {[
            { k: t("shop.deliveryLabel"), v: `0–5 km ${t("cart.free")} · 7 km ${money(5, locale)}` },
            { k: t("shop.minLabel"), v: `${t("cart.pickup")} ${money(SITE.order.minPickup, locale)} · ${t("cart.deliver")} ${money(SITE.order.minDelivery, locale)}` },
            { k: t("shop.etaLabel"), v: `${SITE.order.etaMinutes} min` },
          ].map((x) => (
            <div key={x.k} className="bg-card px-5 py-4">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-crimson-500">{x.k}</p>
              <p className="mt-1 text-[0.85rem] font-medium text-ink">{x.v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="sticky top-[var(--nav-h)] z-40 mt-8 border-y border-line bg-canvas/97 lg:bg-canvas/92 lg:backdrop-blur-xl">
        <div className="mx-auto max-w-[88rem] px-5 py-3 sm:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("shop.search")}
                className="w-full rounded-full border border-line bg-card py-3 pl-11 pr-10 text-[0.85rem] text-ink shadow-card placeholder:text-faint focus:border-crimson-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson-500"
              />
              {q && (
                <button
                  onClick={() => setQ("")} aria-label={t("a11y.clear")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-ink-soft"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="hidden h-4 w-4 text-faint sm:block" />
              {([
                { id: "veg" as Diet, Icon: Leaf, label: t("tag.veg") },
                { id: "vegan" as Diet, Icon: Leaf, label: t("tag.vegan") },
                { id: "spicy" as Diet, Icon: Flame, label: t("tag.hot") },
              ]).map(({ id, Icon, label }) => (
                <button
                  key={id}
                  onClick={() => toggleDiet(id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[0.74rem] font-semibold transition-colors ${
                    diets.includes(id)
                      ? "border-crimson-500 bg-crimson-500 text-white shadow-glow-red"
                      : "border-line bg-card text-muted hover:border-crimson-500/40 hover:text-ink"
                  }`}
                >
                  <Icon className="h-3 w-3" />{label}
                </button>
              ))}
            </div>
          </div>

          <div className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto pb-1">
            {chips.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`relative whitespace-nowrap rounded-full px-4 py-2 text-[0.76rem] font-medium transition-colors ${
                  cat === c.id ? "text-white" : "text-muted hover:text-ink"
                }`}
              >
                {cat === c.id && (
                  <motion.span
                    layoutId="shop-chip"
                    className="bg-crimson-grad absolute inset-0 rounded-full"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-[88rem] px-5 py-12 sm:px-8 sm:py-16">
        <p className="mb-6 text-[0.78rem] font-medium text-muted">
          {results.length} {results.length === 1 ? t("cart.item") : t("cart.items")}
        </p>
        <AnimatePresence mode="popLayout">
          {results.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="py-24 text-center font-display text-xl text-white/80"
            >
              {t("shop.empty")}
            </motion.p>
          ) : (
            <motion.div
              key={`${cat}-${q}-${diets.join()}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {results.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
