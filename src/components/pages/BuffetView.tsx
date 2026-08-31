"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, Leaf, Phone } from "lucide-react";
import { PageHero } from "../PageHero";
import { Photo } from "../Photo";
import { Reveal } from "../Reveal";
import { Btn } from "../Button";
import { useLocale, useT } from "@/lib/useLocale";
import { EVERY_DAY, WEEK } from "@/data/buffet";
import { HERO_ART, SITE } from "@/data/site";
import { money } from "@/lib/i18n";

export function BuffetView() {
  const t = useT();
  const locale = useLocale();
  const today = (new Date().getDay() + 6) % 7; // Mon = 0
  const [active, setActive] = useState(today);
  const day = WEEK[active];

  return (
    <>
      <PageHero eyebrow={t("sec.buffet.eyebrow")} title={t("buffet.title")} sub={t("buffet.sub")} image={HERO_ART.buffet} />

      {/* Pricing */}
      <section className="mx-auto max-w-[88rem] px-5 sm:px-8">
        {/* Four cards now that the weekday price splits at 15:00 — two up on a
            tablet, four across on a desktop. Three-across would leave the
            children's card orphaned on its own row. */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ...SITE.buffet.tiers.map((tier) => ({
              key: tier.id,
              title: tier.days[locale],
              price: tier.price as number | null,
              time: tier.time[locale],
              hi: tier.highlight,
            })),
            {
              key: "kids",
              title: t("buffet.children"),
              price: null,
              time: SITE.buffet.kids.map((k) => `${k.label[locale]} ${money(k.price, locale)}`).join(" · "),
              hi: false,
            },
          ].map((c, i) => (
            <Reveal
              key={c.key}
              delay={i * 0.09}
              className={`rounded-3xl border p-7 ${
                c.hi ? "border-saffron-500/40 bg-saffron-100 shadow-card" : "border-line bg-card shadow-card"
              }`}
            >
              <p className="eyebrow">{c.title}</p>
              {c.price != null && (
                <p className="mt-3 font-display text-4xl font-semibold text-gradient-sun sm:text-5xl">
                  {money(c.price, locale)}
                </p>
              )}
              <p className={`text-[0.82rem] text-muted ${c.price != null ? "mt-2" : "mt-3"}`}>{c.time}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-6 rounded-2xl border border-line bg-card px-6 py-5 text-[0.88rem] leading-relaxed text-ink-soft shadow-card">
            {t("sec.buffet.body")}
          </p>
        </Reveal>
      </section>

      {/* Weekly rotation */}
      <section className="mx-auto max-w-[88rem] px-5 py-20 sm:px-8">
        <h2 className="display-md text-ink">
          {t("buffet.rotation")}
        </h2>

        <div className="mt-8 flex gap-1.5 overflow-x-auto pb-2">
          {WEEK.map((d, i) => (
            <button
              key={d.day.en}
              onClick={() => setActive(i)}
              className={`relative whitespace-nowrap rounded-full px-5 py-2.5 text-[0.8rem] font-semibold transition-colors ${
                active === i ? "text-white" : "text-muted hover:text-ink"
              }`}
            >
              {active === i && (
                <motion.span
                  layoutId="buffet-day"
                  className="bg-crimson-grad absolute inset-0 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span className="relative">
                {d.day[locale]}
                {i === today && <span className="ml-1.5 text-[0.62rem] uppercase opacity-70">•</span>}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <ul
              key={active}
              className="rounded-3xl border border-line bg-card px-6 py-2 shadow-card sm:px-8"
            >
              {day.dishes.map((d, i) => (
                <li
                  key={d.name}
                  style={{ ["--d" as string]: `${(i * 0.06).toFixed(2)}s` }}
                  className="stagger-in flex items-start gap-4 border-b border-line py-5 last:border-0"
                >
                  <span className="mt-1 font-display text-sm font-semibold text-crimson-400 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="flex items-center gap-2 font-display text-[1.05rem] font-semibold text-ink">
                      {(locale === "fi" && d.nameFi) || d.name}
                      {d.veg && <Leaf className="h-3.5 w-3.5 text-cardamom-500" />}
                    </h3>
                    <p className="mt-1 text-[0.83rem] leading-relaxed text-muted">
                      {(locale === "fi" && d.descFi) || d.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

          <aside className="space-y-4">
            <Photo
              src="/menu/salad-falafel.jpg"
              alt=""
              className="aspect-[4/3] w-full rounded-3xl border-4 border-white shadow-lift"
              sizes="(max-width:1024px) 92vw, 352px"
            />
            <div className="rounded-3xl border border-line bg-card p-6 shadow-card">
              <p className="eyebrow">{t("buffet.everyDay")}</p>
              <ul className="mt-4 space-y-2.5">
                {EVERY_DAY.map((d) => (
                  <li key={d.name} className="flex items-start gap-2.5 text-[0.82rem] text-ink-soft">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cardamom-500" />
                    {(locale === "fi" && d.nameFi) || d.name}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Catering CTA */}
      <section className="mx-auto max-w-[88rem] px-5 pb-24 sm:px-8">
        <Reveal>
          <div className="bg-crimson-grad rounded-[2rem] px-8 py-12 text-center shadow-lift">
            <h3 className="display-md !text-white">
              {t("buffet.catering")}
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-[0.9rem] text-white/80">{t("sec.story.body2")}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Btn href={`/${locale}/contact`}>{t("nav.contact")}</Btn>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/35 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/12"
              >
                <Phone className="h-4 w-4" />{SITE.phone}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
