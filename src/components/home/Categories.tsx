"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHead } from "./SectionHead";
import { Photo } from "../Photo";
import { Jali } from "../Ambient";
import { Reveal } from "../Reveal";
import { useLocale, useT } from "@/lib/useLocale";
import { CATEGORIES } from "@/data/products";

export function Categories() {
  const t = useT();
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden border-y border-line bg-canvas py-24 sm:py-28">
      <Jali opacity={0.03} />
      <div className="relative mx-auto max-w-[88rem] px-5 sm:px-8">
        <SectionHead
          eyebrow={t("sec.cats.eyebrow")}
          title={t("sec.cats.title")}
          sub={t("sec.cats.sub")}
          align="center"
        />

        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <Reveal
              key={c.id}
              delay={Math.min(i, 8) * 0.05}
              className={i === 0 ? "col-span-2 md:col-span-1" : ""}
            >
              <Link
                href={`/${locale}/shop?c=${c.id}`}
                className="group relative flex h-full min-h-[13rem] flex-col justify-end overflow-hidden rounded-3xl p-5 shadow-card ring-1 ring-line transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift sm:min-h-[15rem]"
              >
                <span className="absolute inset-0 block">
                  <Photo
                    src={c.img}
                    alt=""
                    className="h-full w-full"
                    overlay="scrim"
                    imgClassName="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    sizes="(max-width:768px) 50vw, 25vw"
                  />
                </span>
                <div className="relative drop-shadow-[0_2px_10px_rgba(34,19,16,0.55)]">
                  <h3 className="font-display text-xl font-semibold text-white">
                    {c.label[locale]}
                  </h3>
                  <p className="mt-1 text-[0.76rem] text-white/85">{c.blurb[locale]}</p>
                </div>
                <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-crimson-500 opacity-0 shadow-card transition-all duration-500 group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
