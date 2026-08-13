"use client";

import { motion } from "motion/react";
import { Check, Flame, Leaf, Plus, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Photo } from "./Photo";
import { useCart } from "@/lib/cart";
import { useReveal } from "@/lib/reveal";
import { useLocale, useT } from "@/lib/useLocale";
import { money } from "@/lib/i18n";
import { effectivePrice, type Product } from "@/data/products";

function Tags({ p }: { p: Product }) {
  const t = useT();
  if (!p.tags?.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {p.tags.includes("chef") && (
        <span className="inline-flex items-center gap-1 rounded-full bg-saffron-100 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-crimson-500">
          <Star className="h-2.5 w-2.5 fill-current" /> {t("tag.chef")}
        </span>
      )}
      {(p.tags.includes("vegan") || p.tags.includes("veg")) && (
        <span className="inline-flex items-center gap-1 rounded-full bg-cardamom-100 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-cardamom-600">
          <Leaf className="h-2.5 w-2.5" /> {t(p.tags.includes("vegan") ? "tag.vegan" : "tag.veg")}
        </span>
      )}
      {p.tags.includes("spicy") && (
        <span className="inline-flex items-center gap-1 rounded-full bg-ember-100 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-ember-600">
          <Flame className="h-2.5 w-2.5" /> {t("tag.hot")}
        </span>
      )}
    </div>
  );
}

export function ProductCard({ p, index = 0 }: { p: Product; index?: number }) {
  const { add } = useCart();
  const locale = useLocale();
  const t = useT();
  const [done, setDone] = useState(false);
  const rv = useReveal<HTMLElement>(Math.min(index, 8) * 0.045);

  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => setDone(false), 1300);
    return () => clearTimeout(id);
  }, [done]);

  const name = (locale === "fi" && p.nameFi) || p.name;
  const desc = (locale === "fi" && p.descFi) || p.desc;
  const price = effectivePrice(p);
  const hasOffer = p.offer != null && p.offer < p.price;

  return (
    <article
      ref={rv}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className="rv card-sheen group flex flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:border-crimson-500/30 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {p.img && (
          <Photo
            src={p.img}
            alt={name}
            className="h-full w-full"
            imgClassName="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
            sizes="(max-width:640px) 92vw, (max-width:1024px) 45vw, 30vw"
          />
        )}
        {hasOffer && (
          <span className="bg-crimson-grad absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-wider text-white shadow-card">
            −{Math.round((1 - p.offer! / p.price) * 100)}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[1.12rem] font-semibold leading-snug text-ink">
            {name}
          </h3>
          <div className="shrink-0 text-right">
            {hasOffer && (
              <div className="text-[0.7rem] leading-none text-faint line-through">
                {money(p.price, locale)}
              </div>
            )}
            <div className="font-display text-lg font-semibold leading-tight text-crimson-600 tabular-nums">
              {money(price, locale)}
            </div>
          </div>
        </div>

        <p className="line-clamp-2 text-[0.82rem] leading-relaxed text-muted">{desc}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <Tags p={p} />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { add(p.id); setDone(true); }}
            aria-label={`${t("shop.add")} ${name}`}
            className={`relative flex h-10 shrink-0 items-center gap-1.5 overflow-hidden rounded-full px-4 text-[0.78rem] font-bold transition-colors duration-300 ${
              done
                ? "bg-cardamom-500 text-white"
                : "bg-sand text-ink hover:bg-crimson-500 hover:text-white"
            }`}
          >
            <span key={done ? "y" : "n"} className="pop flex items-center gap-1.5">
              {done ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {done ? t("shop.added") : t("shop.add")}
            </span>
          </motion.button>
        </div>
      </div>
    </article>
  );
}

/** Compact list row used on the à la carte page. */
export function MenuRow({ p, index = 0 }: { p: Product; index?: number }) {
  const { add } = useCart();
  const locale = useLocale();
  const [done, setDone] = useState(false);
  const rv = useReveal<HTMLLIElement>(Math.min(index, 10) * 0.035);
  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => setDone(false), 1200);
    return () => clearTimeout(id);
  }, [done]);

  const name = (locale === "fi" && p.nameFi) || p.name;
  const desc = (locale === "fi" && p.descFi) || p.desc;

  return (
    <li
      ref={rv}
      className="rv group relative flex items-start gap-5 border-b border-line py-5 last:border-0"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <h3 className="font-display text-[1.08rem] font-semibold text-ink transition-colors group-hover:text-crimson-500">
            {name}
          </h3>
          <span className="hidden h-px flex-1 translate-y-[-2px] bg-[repeating-linear-gradient(90deg,rgba(220,195,159,.9)_0_3px,transparent_3px_7px)] sm:block" />
          <span className="font-display text-base font-semibold tabular-nums text-crimson-600">
            {money(effectivePrice(p), locale)}
          </span>
        </div>
        <p className="mt-1.5 max-w-2xl text-[0.83rem] leading-relaxed text-muted">{desc}</p>
        <div className="mt-2"><Tags p={p} /></div>
      </div>
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => { add(p.id); setDone(true); }}
        aria-label={`Add ${name}`}
        className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
          done
            ? "border-cardamom-500 bg-cardamom-500 text-white"
            : "border-line-strong text-ink-soft hover:border-crimson-500 hover:bg-crimson-500 hover:text-white"
        }`}
      >
        {done ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      </motion.button>
    </li>
  );
}
