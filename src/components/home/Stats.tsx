"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { Reveal } from "../Reveal";
import { useT } from "@/lib/useLocale";
import { SITE } from "@/data/site";

function Count({ to, decimals = 0, suffix = "", prefix = "" }: {
  to: number; decimals?: number; suffix?: string; prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      setV(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{v.toFixed(decimals)}{suffix}
    </span>
  );
}

export function Stats() {
  const t = useT();
  const stats = [
    { label: t("stat.rating"), node: <Count to={SITE.rating.score} decimals={2} /> },
    { label: t("stat.eta"), node: <Count to={SITE.order.etaMinutes} suffix=" min" /> },
    { label: t("stat.buffet"), node: <Count to={SITE.buffet.weekday.price} prefix="€" /> },
    { label: t("stat.years"), node: <Count to={new Date().getFullYear() - SITE.since} suffix="+" /> },
  ];

  return (
    <section className="relative mx-auto max-w-[88rem] px-5 py-20 sm:px-8">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line shadow-card lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.08}
            className="group relative bg-card px-6 py-9 text-center transition-colors duration-500 hover:bg-canvas"
          >
            <div className="font-display text-4xl font-semibold text-gradient-gold sm:text-5xl">
              {s.node}
            </div>
            <p className="mt-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted">
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
