"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, Flame, Leaf, Phone, Play, Volume2, VolumeX } from "lucide-react";
import { PageHero } from "../PageHero";
import { Photo } from "../Photo";
import { Reveal } from "../Reveal";
import { Jali } from "../Ambient";
import { Btn } from "../Button";
import { useLocale, useT } from "@/lib/useLocale";
import { EVERY_DAY, WEEK } from "@/data/buffet";
import { HERO_ART, SITE } from "@/data/site";
import { money } from "@/lib/i18n";

/**
 * Portrait phone clip (480×848) filmed at the buffet counter. Framed as a
 * "reel" rather than forced into the site's usual 4:3 photo crop, which
 * would throw away most of a vertical shot. Sits inside an oversized "mat" —
 * a soft glow plus a wider card behind it — so it reads as a deliberately
 * framed centrepiece rather than a small clip adrift in empty space.
 */
function LiveBuffetReel() {
  const t = useT();
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(!reduce);

  const handleTap = () => {
    const v = videoRef.current;
    if (!v) return;
    if (!playing) {
      v.muted = false;
      v.play();
      setMuted(false);
      setPlaying(true);
      return;
    }
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <div className="relative flex w-full justify-center py-4">
      {/* Warm ambient glow, wider than the clip itself, so the frame it sits
          in feels considered rather than the video floating in blank canvas. */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[92%] w-[92%] max-w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-[3rem] bg-[radial-gradient(closest-side,rgba(245,165,36,.28),rgba(193,39,45,.10)_65%,transparent)] blur-2xl"
      />
      {/* Mat: a card sitting behind the clip, ~1rem wider on every side. */}
      <div className="relative w-full max-w-[26rem] rounded-[2.75rem] border border-line bg-card p-3 shadow-lift sm:max-w-[29rem] sm:p-4">
        <Jali className="rounded-[2.75rem] text-crimson-500" opacity={0.05} />
        <div className="relative aspect-[480/848] overflow-hidden rounded-[2.1rem] border-4 border-white shadow-lift">
          <video
            ref={videoRef}
            src="/video/buffet-spread.mp4"
            className="grade h-full w-full object-cover"
            autoPlay={!reduce}
            muted={muted}
            loop
            playsInline
            preload="metadata"
          />
          {/* Same warm tint + foot scrim as <Photo overlay="scrim">, so the
              clip reads as part of the same photo family rather than a
              bolted-on video widget. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(150deg,rgba(255,182,63,.16),rgba(193,39,45,.08)_55%,transparent)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(34,19,16,0)_52%,rgba(34,19,16,.66)_100%)]"
          />

          <span className="bg-crimson-grad absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.68rem] font-black uppercase tracking-wider text-white shadow-card">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            {t("buffet.video.tag")}
          </span>

          <p className="absolute inset-x-6 bottom-[4.5rem] font-display text-[1.05rem] font-semibold leading-snug text-white drop-shadow-[0_2px_10px_rgba(0,0,0,.5)]">
            {t("buffet.video.caption")}
          </p>

          {playing ? (
            <button
              onClick={handleTap}
              aria-label={muted ? t("a11y.unmute") : t("a11y.mute")}
              className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-ink/45 text-white backdrop-blur-md transition-colors hover:bg-ink/70"
            >
              {muted ? <VolumeX className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5" />}
            </button>
          ) : (
            <button
              onClick={handleTap}
              aria-label={t("a11y.play")}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/92 text-crimson-600 shadow-lift transition-transform hover:scale-105">
                <Play className="ml-1 h-7 w-7 fill-current" />
              </span>
            </button>
          )}
        </div>

        {/* Floating accent — echoes the price medallion on the home buffet
            section, so the two pages share a visual signature. */}
        <div className="bg-sun absolute -right-4 -top-4 flex h-[4.5rem] w-[4.5rem] rotate-[8deg] items-center justify-center rounded-2xl shadow-lift ring-4 ring-white">
          <Flame className="h-7 w-7 text-white" />
        </div>
      </div>
    </div>
  );
}

export function BuffetView() {
  const t = useT();
  const locale = useLocale();
  const today = (new Date().getDay() + 6) % 7; // Mon = 0
  const [active, setActive] = useState(today);
  const day = WEEK[active];

  return (
    <>
      <PageHero eyebrow={t("sec.buffet.eyebrow")} title={t("buffet.title")} sub={t("buffet.sub")} image={HERO_ART.buffet} />

      {/* Pricing */}
      <section className="mx-auto max-w-[88rem] px-5 sm:px-8">
        {/* Four cards now that the weekday price splits at 15:00 — two up on a
            tablet, four across on a desktop. Three-across would leave the
            children's card orphaned on its own row. */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ...SITE.buffet.tiers.map((tier) => ({
              key: tier.id,
              title: tier.days[locale],
              price: tier.price as number | null,
              time: tier.time[locale],
              hi: tier.highlight,
            })),
            {
              key: "kids",
              title: t("buffet.children"),
              price: null,
              time: SITE.buffet.kids.map((k) => `${k.label[locale]} ${money(k.price, locale)}`).join(" · "),
              hi: false,
            },
          ].map((c, i) => (
            <Reveal
              key={c.key}
              delay={i * 0.09}
              className={`rounded-3xl border p-7 ${
                c.hi ? "border-saffron-500/40 bg-saffron-100 shadow-card" : "border-line bg-card shadow-card"
              }`}
            >
              <p className="eyebrow">{c.title}</p>
              {c.price != null && (
                <p className="mt-3 font-display text-4xl font-semibold text-gradient-sun sm:text-5xl">
                  {money(c.price, locale)}
                </p>
              )}
              <p className={`text-[0.82rem] text-muted ${c.price != null ? "mt-2" : "mt-3"}`}>{c.time}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-6 rounded-2xl border border-line bg-card px-6 py-5 text-[0.88rem] leading-relaxed text-ink-soft shadow-card">
            {t("sec.buffet.body")}
          </p>
        </Reveal>
      </section>

      {/* Weekly rotation */}
      <section className="mx-auto max-w-[88rem] px-5 py-20 sm:px-8">
        {/* The heading + tabs + dish list now share the grid row with the
            sidebar (rather than sitting above it), so the sidebar — and the
            video at the top of it — starts level with "This week's
            rotation" instead of level with the dish-list card underneath
            the day tabs. items-stretch (the grid default) plus flex-1 on the
            dish-list card below makes that card grow to the row's full
            height — the video's, since it's the taller of the two — so
            their bottom edges land together instead of the card stopping
            short. */}
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
          <div className="flex flex-col">
            <h2 className="display-md text-ink">
              {t("buffet.rotation")}
            </h2>

            <div className="mt-8 flex gap-1.5 overflow-x-auto pb-2">
              {WEEK.map((d, i) => (
                <button
                  key={d.day.en}
                  onClick={() => setActive(i)}
                  className={`relative whitespace-nowrap rounded-full px-5 py-2.5 text-[0.8rem] font-semibold transition-colors ${
                    active === i ? "text-white" : "text-muted hover:text-ink"
                  }`}
                >
                  {active === i && (
                    <motion.span
                      layoutId="buffet-day"
                      className="bg-crimson-grad absolute inset-0 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative">
                    {d.day[locale]}
                    {i === today && <span className="ml-1.5 text-[0.62rem] uppercase opacity-70">•</span>}
                  </span>
                </button>
              ))}
            </div>

            <ul
              key={active}
              className="mt-8 flex-1 rounded-3xl border border-crimson-500/25 bg-card px-6 py-2 shadow-card sm:px-8"
            >
              {day.dishes.map((d, i) => (
                <li
                  key={d.name}
                  style={{ ["--d" as string]: `${(i * 0.06).toFixed(2)}s` }}
                  className="stagger-in flex items-start gap-4 border-b border-line py-5 last:border-0"
                >
                  <span className="mt-1 font-display text-sm font-semibold text-crimson-400 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="flex items-center gap-2 font-display text-[1.05rem] font-semibold text-ink">
                      {(locale === "fi" && d.nameFi) || d.name}
                      {d.veg && <Leaf className="h-3.5 w-3.5 text-cardamom-500" />}
                    </h3>
                    <p className="mt-1 text-[0.83rem] leading-relaxed text-muted">
                      {(locale === "fi" && d.descFi) || d.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <aside>
            <LiveBuffetReel />
          </aside>
        </div>

        {/* Second row, repeating the exact same column split as the one
            above: checklist matches the dish-list's width, and the photo
            sits directly under the video instead of beside the checklist. */}
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
          <div className="rounded-3xl border border-cardamom-500/25 bg-card p-6 shadow-card">
            <p className="eyebrow">{t("buffet.everyDay")}</p>
            <ul className="mt-4 space-y-2.5">
              {EVERY_DAY.map((d) => (
                <li key={d.name} className="flex items-start gap-2.5 text-[0.82rem] text-ink-soft">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cardamom-500" />
                  {(locale === "fi" && d.nameFi) || d.name}
                </li>
              ))}
            </ul>
          </div>
          <Photo
            src="/menu/salad-falafel.jpg"
            alt=""
            className="aspect-[4/3] w-full rounded-3xl border-4 border-white shadow-lift"
            sizes="(max-width:1024px) 92vw, 352px"
          />
        </div>
      </section>

      {/* Catering CTA */}
      <section className="mx-auto max-w-[88rem] px-5 pb-24 sm:px-8">
        <Reveal>
          <div className="bg-crimson-grad rounded-[2rem] px-8 py-12 text-center shadow-lift">
            <h3 className="display-md !text-white">
              {t("buffet.catering")}
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-[0.9rem] text-white/80">{t("sec.story.body2")}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Btn href={`/${locale}/contact`}>{t("nav.contact")}</Btn>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/35 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/12"
              >
                <Phone className="h-4 w-4" />{SITE.phone}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
