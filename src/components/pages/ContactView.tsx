"use client";

import { Clock, Mail, MapPin, Phone, Smartphone } from "lucide-react";
import { PageHero } from "../PageHero";
import { Reveal } from "../Reveal";
import { FacebookIcon, InstagramIcon } from "../Social";
import { useLocale, useT } from "@/lib/useLocale";
import { HERO_ART, SITE } from "@/data/site";

export function ContactView() {
  const t = useT();
  const locale = useLocale();

  const cards = [
    {
      Icon: MapPin,
      title: t("contact.address"),
      lines: [SITE.address.street, `${SITE.address.postal} ${SITE.address.city}`],
      href: SITE.maps,
    },
    { Icon: Phone, title: t("contact.phone"), lines: [SITE.phone], href: SITE.phoneHref },
    { Icon: Mail, title: t("contact.emailLabel"), lines: [SITE.email], href: `mailto:${SITE.email}` },
  ];

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    `${SITE.address.street}, ${SITE.address.postal} ${SITE.address.city}, Finland`,
  )}&output=embed`;

  return (
    <>
      <PageHero
        eyebrow={t("nav.contact")}
        title={t("contact.title")}
        sub={t("contact.heroSub")}
        image={HERO_ART.contact}
      />

      <div className="mx-auto max-w-[88rem] px-5 pb-24 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group block h-full rounded-3xl border border-line bg-card p-7 shadow-card transition-all hover:-translate-y-1.5 hover:border-crimson-500/30 hover:shadow-lift"
              >
              <div className="bg-sun flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-glow transition-transform group-hover:scale-110">
                <c.Icon className="h-5 w-5" />
              </div>
              <p className="mt-5 eyebrow">{c.title}</p>
              {c.lines.map((l) => (
                <p key={l} className="mt-1 text-[0.92rem] text-ink">{l}</p>
              ))}
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <div className="overflow-hidden rounded-[2rem] border-4 border-white shadow-lift">
              <iframe
                src={mapSrc}
                title="Map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[26rem] w-full saturate-[0.9] sm:h-[32rem]"
              />
            </div>
          </Reveal>

          <div className="space-y-4">
            <Reveal>
              <div className="rounded-[2rem] border border-line bg-card p-7 shadow-card">
                <p className="eyebrow flex items-center gap-2"><Clock className="h-3.5 w-3.5" />{t("hours.kitchen")}</p>
                <ul className="mt-4 space-y-2.5 text-[0.86rem] text-muted">
                  {SITE.hours.kitchen.map((h) => (
                    <li key={h.t} className="flex justify-between gap-4">
                      <span>{h.d[locale]}</span><span className="tabular-nums text-ink-soft">{h.t}</span>
                    </li>
                  ))}
                </ul>
                <div className="rule-gold my-5" />
                <p className="eyebrow">{t("hours.delivery")}</p>
                <ul className="mt-4 space-y-2.5 text-[0.86rem] text-muted">
                  {SITE.hours.delivery.map((h) => (
                    <li key={h.t} className="flex justify-between gap-4">
                      <span>{h.d[locale]}</span><span className="tabular-nums text-ink-soft">{h.t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-[2rem] border border-line bg-card p-7 shadow-card">
                <p className="eyebrow flex items-center gap-2"><Smartphone className="h-3.5 w-3.5" />
                  {t("contact.appTitle")}
                </p>
                <p className="mt-3 text-[0.86rem] leading-relaxed text-muted">
                  {t("contact.appBody")}
                </p>
                <div className="mt-5 flex gap-2">
                  <a href={SITE.apps.ios} target="_blank" rel="noreferrer"
                    className="rounded-full border border-line-strong bg-card px-4 py-2 text-[0.76rem] font-semibold text-ink-soft shadow-card transition-colors hover:border-crimson-500 hover:text-crimson-600">
                    App Store
                  </a>
                  <a href={SITE.apps.android} target="_blank" rel="noreferrer"
                    className="rounded-full border border-line-strong bg-card px-4 py-2 text-[0.76rem] font-semibold text-ink-soft shadow-card transition-colors hover:border-crimson-500 hover:text-crimson-600">
                    Google Play
                  </a>
                </div>
                <div className="mt-6 flex gap-2">
                  {[
                    { href: SITE.social.facebook, Icon: FacebookIcon, label: "Facebook" },
                    { href: SITE.social.instagram, Icon: InstagramIcon, label: "Instagram" },
                  ].map(({ href, Icon, label }) => (
                    <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card text-ink-soft shadow-card transition-colors hover:border-crimson-500 hover:bg-crimson-500 hover:text-white">
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
}
