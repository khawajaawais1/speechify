"use client";

import { ArrowRight, Phone } from "lucide-react";
import { Btn } from "../Button";
import { SplitText } from "../SplitText";
import { Reveal } from "../Reveal";
import { useLocale, useT } from "@/lib/useLocale";
import { SITE } from "@/data/site";

export function FinalCTA() {
  const t = useT();
  const locale = useLocale();
  return (
    <section className="relative mx-auto max-w-[88rem] px-5 pb-28 sm:px-8">
      <Reveal className="bg-crimson-grad relative overflow-hidden rounded-[2.5rem] px-6 py-20 text-center shadow-lift sm:px-16 sm:py-28">
        <div className="relative">
          <h2 className="display-lg !text-white">
            <SplitText text={t("cta.final.title")} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-5 max-w-md text-[0.95rem] text-white/80">{t("cta.final.sub")}</p>
          </Reveal>
          <Reveal delay={0.28}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Btn href={`/${locale}/shop`}>
                {t("nav.order")}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Btn>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/35 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/12"
              >
                <Phone className="h-4 w-4" />
                {SITE.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </Reveal>
    </section>
  );
}
