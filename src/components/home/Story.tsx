"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Flame, Leaf, Soup } from "lucide-react";
import { Photo } from "../Photo";
import { SplitText } from "../SplitText";
import { Reveal } from "../Reveal";
import { Btn } from "../Button";
import { Jali } from "../Ambient";
import { useLocale, useT } from "@/lib/useLocale";
import { PHOTOS } from "@/data/site";

export function Story() {
  const t = useT();
  const locale = useLocale();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  const craft = [
    { Icon: Flame, en: "Whole spices roasted and ground in-house", fi: "Mausteet paahdetaan ja jauhetaan itse" },
    { Icon: Soup, en: "Onions browned slowly, never rushed", fi: "Sipulit ruskistetaan hitaasti, ei kiirehditä" },
    { Icon: Leaf, en: "Meat marinated overnight before the tandoor", fi: "Liha marinoituu yön yli ennen tandooria" },
  ];

  return (
    <section ref={ref} className="relative overflow-hidden border-y border-line bg-canvas-2">
      <Jali opacity={0.05} />
      <div className="relative mx-auto grid max-w-[88rem] items-center gap-14 px-5 py-24 sm:px-8 sm:py-28 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-crimson-500/50" />
              {t("sec.story.eyebrow")}
            </p>
          </Reveal>
          <h2 className="display-lg mt-4">
            <SplitText text={t("sec.story.title")} stagger={0.045} />
          </h2>
          <Reveal delay={0.12}>
            <p className="mt-6 text-[0.98rem] leading-relaxed text-ink-soft">{t("sec.story.body")}</p>
          </Reveal>

          <ul className="mt-8 space-y-3">
            {craft.map((c, i) => (
              <Reveal as="li" key={c.en} delay={0.18 + i * 0.08} className="flex items-center gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-crimson-50 text-crimson-500">
                  <c.Icon className="h-4 w-4" />
                </span>
                <span className="text-[0.9rem] font-medium text-ink">{locale === "fi" ? c.fi : c.en}</span>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.42}>
            <p className="mt-8 text-[0.92rem] leading-relaxed text-muted">{t("sec.story.body2")}</p>
          </Reveal>
          <Reveal delay={0.5}>
            <div className="mt-8">
              <Btn href={`/${locale}/contact`} variant="ghost">
                {t("sec.story.cta")}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Btn>
            </div>
          </Reveal>
        </div>

        <div className="relative h-[26rem] sm:h-[34rem]">
          <motion.div style={{ y: y1 }} className="absolute right-0 top-0 h-[74%] w-[70%]">
            <Photo
              src={PHOTOS.interior1}
              alt=""
              className="h-full w-full rounded-[2rem] border-4 border-white shadow-lift"
              sizes="(max-width:1024px) 72vw, 32vw"
            />
          </motion.div>
          <motion.div style={{ y: y2 }} className="absolute bottom-0 left-0 h-[58%] w-[54%]">
            <Photo
              src={PHOTOS.food4}
              alt=""
              className="h-full w-full rounded-[2rem] border-4 border-white shadow-lift"
              sizes="(max-width:1024px) 56vw, 25vw"
            />
          </motion.div>
          <div
            aria-hidden
            className="bg-crimson-grad absolute bottom-[8%] right-[6%] h-24 w-24 rounded-full opacity-15 blur-2xl"
          />
        </div>
      </div>
    </section>
  );
}
