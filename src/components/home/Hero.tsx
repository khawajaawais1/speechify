"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowRight, Bike, ChevronDown, Star, UtensilsCrossed } from "lucide-react";
import { Photo } from "../Photo";
import { SplitText } from "../SplitText";
import { Btn } from "../Button";
import { useLocale, useT } from "@/lib/useLocale";
import { PHOTOS, SITE } from "@/data/site";

export function Hero() {
  const t = useT();
  const locale = useLocale();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // One scroll subscription, one transformed element. The copy column is no
  // longer parallaxed — moving a text layer every frame was the single most
  // expensive thing on this page and it fought the headline animation.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const artY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "10%"]);

  return (
    <section ref={ref} className="wash relative overflow-hidden pt-[var(--nav-h)]">

      {/* Decorative spice ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-18rem] top-[10rem] z-0 hidden h-[36rem] w-[36rem] lg:block"
      >
        <div className="spin-slow h-full w-full rounded-full border border-crimson-500/12">
          <div className="h-full w-full scale-[0.76] rounded-full border border-dashed border-saffron-500/25" />
        </div>
      </div>

      <div className="mx-auto grid max-w-[88rem] items-center gap-14 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[1.06fr_1fr] lg:gap-10 lg:pb-24 lg:pt-16">
        {/* ---------- Copy ---------- */}
        <div className="relative z-10">
          <p
            className="eyebrow stagger-in flex items-center gap-3"
            style={{ ["--d" as string]: "0.1s" }}
          >
            <span className="inline-block h-px w-10 bg-crimson-500/50" />
            {t("hero.eyebrow")}
          </p>

          <h1 className="display-xl mt-6">
            <span className="block"><SplitText text={t("hero.l1")} delay={0.22} /></span>
            <span className="block"><SplitText text={t("hero.l2")} delay={0.36} /></span>
            <span className="block text-gradient-sun">
              <SplitText text={t("hero.l3")} delay={0.52} />
            </span>
          </h1>

          <p
            className="stagger-in mt-7 max-w-xl text-[1rem] leading-relaxed text-muted"
            style={{ ["--d" as string]: "0.8s" }}
          >
            {t("hero.sub")}
          </p>

          <div
            className="stagger-in mt-9 flex flex-wrap items-center gap-3"
            style={{ ["--d" as string]: "0.95s" }}
          >
            <Btn href={`/${locale}/shop`}>
              {t("hero.cta1")}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Btn>
            <Btn href={`/${locale}/menu`} variant="ghost">
              <UtensilsCrossed className="h-4 w-4" />
              {t("hero.cta2")}
            </Btn>
          </div>

          <div
            className="stagger-in mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8rem] text-muted"
            style={{ ["--d" as string]: "1.1s" }}
          >
            <span className="flex items-center gap-1.5">
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-gold-600 text-gold-600" />
                ))}
              </span>
              <span className="font-semibold text-ink">{SITE.rating.score.toFixed(2)}</span>
            </span>
            <span className="h-3 w-px bg-line-strong" />
            <span>{SITE.order.etaMinutes} min {locale === "fi" ? "toimitus" : "delivery"}</span>
            <span className="h-3 w-px bg-line-strong" />
            <span>{locale === "fi" ? "Ilmainen toimitus 5 km" : "Free delivery within 5 km"}</span>
          </div>
        </div>

        {/* ---------- Art ---------- */}
        <motion.div style={{ y: artY }} className="relative">
          {/* Colour plate behind the photo */}
          <div
            aria-hidden
            className="bg-sun absolute -right-6 -top-6 bottom-10 left-10 rounded-[3rem] opacity-90"
          />
          <Photo
            src={PHOTOS.hero}
            alt=""
            priority
            className="relative aspect-[4/5] w-full rounded-[2.5rem] border-4 border-white shadow-lift sm:aspect-[5/5]"
            sizes="(max-width:1024px) 92vw, 44vw"
          />

          {/* Floating chips — solid surfaces, no backdrop-filter */}
          <div className="chip float-a absolute -left-3 top-10 flex items-center gap-3 rounded-2xl px-4 py-3 sm:-left-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-crimson-500 text-white">
              <Star className="h-4 w-4 fill-current" />
            </span>
            <span>
              <span className="block font-display text-lg font-semibold leading-none text-ink">
                {SITE.rating.score.toFixed(2)}
              </span>
              <span className="text-[0.68rem] uppercase tracking-widest text-faint">
                {locale === "fi" ? "Asiakasarvio" : "Guest rating"}
              </span>
            </span>
          </div>

          <div className="chip float-b absolute -bottom-5 right-2 w-[15rem] rounded-3xl p-2.5 sm:right-[-1.5rem]">
            <Photo src={PHOTOS.food1} alt="" className="aspect-[16/10] w-full rounded-2xl" sizes="240px" />
            <div className="px-2 pb-1 pt-3">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-crimson-500">
                {locale === "fi" ? "Talon suosikki" : "House favourite"}
              </p>
              <p className="mt-1 font-display text-[1.05rem] font-semibold leading-tight text-ink">
                Murgh Makhni
              </p>
            </div>
          </div>

          <div className="chip float-c absolute right-3 top-[-1rem] hidden items-center gap-2 rounded-full px-4 py-2.5 sm:flex">
            <Bike className="h-4 w-4 text-crimson-500" />
            <span className="text-[0.76rem] font-semibold text-ink">{SITE.order.etaMinutes} min</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div className="relative flex justify-center pb-8">
        <div className="float-c flex flex-col items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.3em] text-faint">
          {t("hero.scroll")}
          <ChevronDown className="h-3.5 w-3.5" />
        </div>
      </div>
    </section>
  );
}
