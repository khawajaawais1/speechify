"use client";

import { ArrowRight } from "lucide-react";
import { SectionHead } from "./SectionHead";
import { ProductCard } from "../ProductCard";
import { Btn } from "../Button";
import { Reveal } from "../Reveal";
import { useLocale, useT } from "@/lib/useLocale";
import { heroes } from "@/data/products";

export function Signature() {
  const t = useT();
  const locale = useLocale();
  // One row on the home page — three cards is enough of a taste, and the
  // "browse the full menu" button does the rest.
  //
  // Deals are excluded: they sit first in the catalogue, so an unfiltered
  // slice(0,3) showed three "Mix Deal" promos under a heading that reads
  // "the dishes our regulars order again and again". These are the actual
  // signatures — lamb, chicken and fish.
  const items = heroes()
    .filter((p) => p.cat !== "deals")
    .slice(0, 3);

  return (
    <section className="relative mx-auto max-w-[88rem] px-5 py-24 sm:px-8 sm:py-28">
      <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHead
          eyebrow={t("sec.signature.eyebrow")}
          title={t("sec.signature.title")}
          sub={t("sec.signature.sub")}
        />
        <Reveal delay={0.2}>
          <Btn href={`/${locale}/menu`} variant="ghost">
            {t("sec.signature.cta")}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Btn>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => (
          <ProductCard key={p.id} p={p} index={i} />
        ))}
      </div>
    </section>
  );
}
