"use client";

import Link from "next/link";
import { Clock, Mail, MapPin, Phone, Star } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "./Social";
import { Wordmark } from "./Logo";
import { Jali } from "./Ambient";
import { useLocale, useT } from "@/lib/useLocale";
import { SITE } from "@/data/site";

export function Footer() {
  const locale = useLocale();
  const t = useT();

  const nav = [
    { href: "", key: "nav.home" },
    { href: "/menu", key: "nav.menu" },
    { href: "/buffet", key: "nav.buffet" },
    { href: "/shop", key: "nav.shop" },
      { href: "/reservations", key: "nav.reserve" },
    { href: "/contact", key: "nav.contact" },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-line bg-canvas-2">
      <Jali opacity={0.035} />
      <div className="relative mx-auto max-w-[88rem] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Wordmark markClass="h-12 w-12" tagline />
            <p className="mt-5 max-w-xs text-[0.85rem] leading-relaxed text-muted">
              {t("footer.built")}
            </p>
            <div className="mt-5 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-gold-600 text-gold-600" />
                ))}
              </div>
              <span className="text-[0.75rem] text-muted">
                {SITE.rating.score.toFixed(1)} · {SITE.rating.count} {t("rating.reviews")}
              </span>
            </div>
            <div className="mt-6 flex gap-2">
              {[
                { href: SITE.social.facebook, Icon: FacebookIcon, label: "Facebook" },
                { href: SITE.social.instagram, Icon: InstagramIcon, label: "Instagram" },
                { href: SITE.social.google, Icon: MapPin, label: "Google" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card text-ink-soft shadow-card transition-colors hover:border-crimson-500 hover:bg-crimson-500 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="eyebrow mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2.5">
              {nav.map((l) => (
                <li key={l.key}>
                  <Link
                    href={`/${locale}${l.href}`}
                    className="text-[0.85rem] text-muted transition-colors hover:text-crimson-600"
                  >
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow mb-4">
              <Clock className="mr-1.5 inline h-3 w-3" />
              {t("hours.kitchen")}
            </h3>
            <ul className="space-y-2 text-[0.85rem] text-muted">
              {SITE.hours.kitchen.map((h) => (
                <li key={h.t} className="flex justify-between gap-4">
                  <span>{h.d[locale]}</span>
                  <span className="tabular-nums text-ink-soft">{h.t}</span>
                </li>
              ))}
            </ul>
            <h3 className="eyebrow mb-3 mt-6">{t("hours.delivery")}</h3>
            <ul className="space-y-2 text-[0.85rem] text-muted">
              {SITE.hours.delivery.map((h) => (
                <li key={h.t} className="flex justify-between gap-4">
                  <span>{h.d[locale]}</span>
                  <span className="tabular-nums text-ink-soft">{h.t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow mb-4">{t("nav.contact")}</h3>
            <ul className="space-y-3 text-[0.85rem] text-muted">
              <li>
                <a href={SITE.maps} target="_blank" rel="noreferrer" className="flex gap-2.5 hover:text-crimson-500">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-crimson-500" />
                  <span>{SITE.address.street}<br />{SITE.address.postal} {SITE.address.city}</span>
                </a>
              </li>
              <li>
                <a href={SITE.phoneHref} className="flex items-center gap-2.5 hover:text-crimson-500">
                  <Phone className="h-4 w-4 shrink-0 text-crimson-500" />{SITE.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-2.5 hover:text-crimson-500">
                  <Mail className="h-4 w-4 shrink-0 text-crimson-500" />{SITE.email}
                </a>
              </li>
            </ul>
            <div className="mt-6 rounded-2xl border border-saffron-500/30 bg-saffron-100 p-4">
              <p className="text-[0.72rem] font-medium leading-relaxed text-saffron-700">
                {t("footer.deliveryLine")}
              </p>
            </div>
          </div>
        </div>

        <div className="rule-gold my-10" />

        <div className="flex flex-col gap-3 text-[0.72rem] text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.fullName}. {t("footer.rights")}</p>
          <p>Y-tunnus {SITE.businessId} · {SITE.address.street}, {SITE.address.postal} {SITE.address.city}</p>
        </div>
      </div>
    </footer>
  );
}
