"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { Photo } from "../Photo";
import { SplitText } from "../SplitText";
import { Reveal } from "../Reveal";
import { Btn } from "../Button";
import { useLocale, useT } from "@/lib/useLocale";
import { BUFFET_FROM, SITE } from "@/data/site";
import { money } from "@/lib/i18n";

export function Buffet() {
  const t = useT();
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  const bullets = [t("buffet.b1"), t("buffet.b2"), t("buffet.b3"), t("buffet.b4")];

  return (
    <section ref={ref} className="relative mx-auto max-w-[88rem] px-5 py-24 sm:px-8 sm:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Images */}
        <div className="relative order-2 h-[26rem] sm:h-[34rem] lg:order-1">
          <motion.div style={{ y: y1 }} className="absolute left-0 top-0 h-[72%] w-[68%]">
            <Photo
              src="/menu/kebab-super.jpg"
              alt=""
              className="h-full w-full rounded-[2rem] border-4 border-white shadow-lift"
              sizes="(max-width:1024px) 70vw, 32vw"
            />
          </motion.div>
          <motion.div style={{ y: y2 }} className="absolute bottom-0 right-0 h-[62%] w-[56%]">
            <Photo
              src="/menu/awadhi-ghost-biryani.jpg"
              alt=""
              className="h-full w-full rounded-[2rem] border-4 border-white shadow-lift"
              sizes="(max-width:1024px) 58vw, 26vw"
            />
          </motion.div>

          {/* Price medallion */}
          <div
            className="bg-sun rotate-[-6deg] absolute left-[46%] top-[52%] z-10 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-0.5 rounded-full text-white shadow-lift ring-4 ring-white sm:h-36 sm:w-36"
          >
            <span className="text-[0.58rem] uppercase tracking-[0.2em] text-white/80">
              {t("buffet.from")}
            </span>
            <span className="whitespace-nowrap font-display text-2xl font-semibold tabular-nums sm:text-3xl">
              {money(BUFFET_FROM, locale)}
            </span>
            <span className="text-[0.58rem] uppercase tracking-[0.16em] text-white/80">
              {t("buffet.perPerson")}
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

          {/* No price table here.
              The medallion already says "from €14.99", and the full breakdown
              — three time bands plus children's pricing — belongs on the buffet
              page, which is one click away and is where someone comparing
              prices is heading anyway. Repeating it beside the button made the
              section read like a rate card instead of an invitation. */}
          <Reveal delay={0.4}>
            <div className="mt-8">
              <Btn href={`/${locale}/buffet`}>
                {t("sec.buffet.cta")}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Btn>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
