"use client";

import { Bike, CreditCard, Store } from "lucide-react";
import { SectionHead } from "./SectionHead";
import { Reveal } from "../Reveal";
import { useT } from "@/lib/useLocale";

export function OrderPerks() {
  const t = useT();
  const perks = [
    { Icon: Bike, title: t("sec.order.f1"), sub: t("sec.order.f1s") },
    { Icon: CreditCard, title: t("sec.order.f2"), sub: t("sec.order.f2s") },
    { Icon: Store, title: t("sec.order.f3"), sub: t("sec.order.f3s") },
  ];

  return (
    <section className="relative mx-auto max-w-[88rem] px-5 py-20 sm:px-8">
      <SectionHead eyebrow={t("sec.order.eyebrow")} title={t("sec.order.title")} align="center" />
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {perks.map((p, i) => (
          <Reveal
            key={p.title}
            delay={i * 0.1}
            className="group rounded-3xl border border-line bg-card p-7 shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:border-crimson-500/30 hover:shadow-lift"
          >
            <div className="bg-sun flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-glow transition-transform duration-500 group-hover:scale-110">
              <p.Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold text-ink">{p.title}</h3>
            <p className="mt-1.5 text-[0.84rem] leading-relaxed text-muted">{p.sub}</p>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2}>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-3xl border border-line bg-canvas-2 px-6 py-5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted">
          {["Visa", "Mastercard", "MobilePay", "Apple Pay", "Google Pay", "Klarna"].map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
