"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { Photo } from "../Photo";
import { SplitText } from "../SplitText";
import { Reveal } from "../Reveal";
import { Btn } from "../Button";
import { useLocale, useT } from "@/lib/useLocale";
import { PHOTOS, SITE } from "@/data/site";
import { money } from "@/lib/i18n";

export function Buffet() {
  const t = useT();
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  const bullets = locale === "fi"
    ? ["Uusi menu joka päivä", "Kerro tulisuustoive — sisältyy hintaan", "Erikoiskasvisannokset pyynnöstä", "Lapsille pizzaa ja ranskalaisia"]
    : ["A new menu every single day", "Ask for it hotter — included in the price", "Special vegetable dishes on request", "Pizza and fries for the kids"];

  return (
    <section ref={ref} className="relative mx-auto max-w-[88rem] px-5 py-24 sm:px-8 sm:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Images */}
        <div className="relative order-2 h-[26rem] sm:h-[34rem] lg:order-1">
          <motion.div style={{ y: y1 }} className="absolute left-0 top-0 h-[72%] w-[68%]">
            <Photo
              src={PHOTOS.buffet1}
              alt=""
              className="h-full w-full rounded-[2rem] border-4 border-white shadow-lift"
              sizes="(max-width:1024px) 70vw, 32vw"
            />
          </motion.div>
          <motion.div style={{ y: y2 }} className="absolute bottom-0 right-0 h-[62%] w-[56%]">
            <Photo
              src={PHOTOS.buffet2}
              alt=""
              className="h-full w-full rounded-[2rem] border-4 border-white shadow-lift"
              sizes="(max-width:1024px) 58vw, 26vw"
            />
          </motion.div>

          {/* Price medallion */}
          <div
            className="bg-sun rotate-[-6deg] absolute left-[46%] top-[52%] z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full text-white shadow-lift ring-4 ring-white sm:h-32 sm:w-32"
          >
            <span className="text-[0.58rem] uppercase tracking-[0.2em] text-white/80">
              {locale === "fi" ? "Alkaen" : "From"}
            </span>
            <span className="font-display text-3xl font-semibold sm:text-4xl">
              {money(SITE.buffet.weekday.price, locale).replace(",00", "").replace(".00", "")}
            </span>
            <span className="text-[0.58rem] uppercase tracking-[0.16em] text-white/80">
              {locale === "fi" ? "/ hlö" : "/ person"}
            </span>
          </div>
        </div>

        {/* Copy */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-crimson-500/60" />
              {t("sec.buffet.eyebrow")}
            </p>
          </Reveal>
          <h2 className="display-lg mt-4 text-ink">
            <SplitText text={t("sec.buffet.title")} stagger={0.045} />
          </h2>
          <Reveal delay={0.12}>
            <p className="mt-6 text-[0.95rem] leading-relaxed text-muted">{t("sec.buffet.body")}</p>
          </Reveal>

          <ul className="mt-8 space-y-3">
            {bullets.map((b, i) => (
              <Reveal as="li" key={b} delay={0.18 + i * 0.07} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-crimson-500">
                  <Check className="h-3 w-3 text-white" />
                </span>
                <span className="text-[0.88rem] text-ink-soft">{b}</span>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.4}>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Btn href={`/${locale}/buffet`}>
                {t("sec.buffet.cta")}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Btn>
              <div className="text-[0.78rem] text-white/80">
                <p>{SITE.buffet.weekend.days[locale]} · {money(SITE.buffet.weekend.price, locale)}</p>
                <p className="mt-0.5">
                  {SITE.buffet.kids.map((k) => `${k.label[locale]} ${money(k.price, locale)}`).join(" · ")}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
