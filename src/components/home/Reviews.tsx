"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Reveal } from "../Reveal";
import { useLocale, useT } from "@/lib/useLocale";
import { GOOGLE, REVIEWS, TRIPADVISOR, avatarTint, type Review } from "@/data/reviews";

/* ------------------------------------------------------------------ icons */

function GoogleG({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#4285F4" d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.45a5.5 5.5 0 0 1-2.39 3.6v3h3.86c2.26-2.09 3.58-5.17 3.58-8.63Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.9l-3.87-3c-1.07.72-2.44 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.95H1.28v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.28a12 12 0 0 0 0 10.8l3.99-3.1Z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.6l3.99 3.1C6.22 6.86 8.87 4.75 12 4.75Z" />
    </svg>
  );
}

function GoogleWordmark({ className = "h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 272 92" className={className} aria-label="Google">
      <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18Zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44Z" />
      <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18Zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44Z" />
      <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25Zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36Z" />
      <path fill="#34A853" d="M225 3v65h-9.5V3h9.5Z" />
      <path fill="#EA4335" d="m262.02 54.48 7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14Zm-23.27-7.98 19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93Z" />
      <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01Z" />
    </svg>
  );
}

function VerifiedTick({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M12 1.5l2.6 2.02 3.28-.3 1.02 3.14 2.77 1.79-1.2 3.07 1.2 3.07-2.77 1.79-1.02 3.14-3.28-.3L12 22.5l-2.6-2.02-3.28.3-1.02-3.14-2.77-1.79 1.2-3.07-1.2-3.07 2.77-1.79 1.02-3.14 3.28.3L12 1.5Z"
      />
      <path fill="#fff" d="m10.8 15.3-3-3 1.27-1.27 1.73 1.73 4.13-4.13 1.27 1.27-5.4 5.4Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ parts */

function Stars({ n = 5, size = "h-4 w-4" }: { n?: number; size?: string }) {
  return (
    <span className="flex gap-px" aria-label={`${n} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${size} ${i < n ? "fill-[#fbbc05] text-[#fbbc05]" : "fill-line text-line"}`}
        />
      ))}
    </span>
  );
}

function ReviewCard({ r }: { r: Review }) {
  const locale = useLocale();
  const t = useT();
  const [open, setOpen] = useState(false);
  const text = r.quote[locale] ?? r.quote.en;
  const long = text.length > 130;

  return (
    <article className="flex w-[19rem] shrink-0 snap-start flex-col rounded-2xl border border-line bg-card p-5 shadow-card sm:w-[21rem]">
      <header className="flex items-start gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-semibold text-white"
          style={{ background: avatarTint(r.author) }}
          aria-hidden
        >
          {r.author.charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.92rem] font-semibold text-ink">{r.author}</span>
          <span className="text-[0.76rem] text-faint">{r.when[locale]}</span>
        </span>
        {r.source === "google" ? (
          <GoogleG className="h-5 w-5 shrink-0" />
        ) : (
          <span className="shrink-0 rounded-full bg-canvas-2 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-muted">
            TA
          </span>
        )}
      </header>

      <div className="mt-3 flex items-center gap-2">
        <Stars n={r.rating} />
        <VerifiedTick />
      </div>

      <p
        className={`mt-3 flex-1 text-[0.88rem] leading-relaxed text-ink-soft ${
          long && !open ? "line-clamp-4" : ""
        }`}
      >
        {text}
      </p>

      {long && (
        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-2 self-start text-[0.78rem] font-semibold text-faint underline-offset-4 hover:text-crimson-600 hover:underline"
        >
          {open ? t("sec.reviews.less") : t("sec.reviews.more")}
        </button>
      )}

      {r.url && (
        <a
          href={r.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 self-start text-[0.74rem] font-semibold text-crimson-600 underline-offset-4 hover:underline"
        >
          {t("sec.reviews.read")}
        </a>
      )}
    </article>
  );
}

/* ----------------------------------------------------------------- section */

export function Reviews() {
  const t = useT();
  const locale = useLocale();
  const rail = useRef<HTMLDivElement>(null);

  const nudge = useCallback((dir: -1 | 1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector("article");
    const step = card ? card.clientWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  return (
    <section className="relative overflow-hidden bg-canvas-2 py-20 sm:py-24">
      <div className="relative mx-auto max-w-[88rem] px-5 sm:px-8">
        {/* ---- Summary badge ---- */}
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <p className="text-[1.05rem] font-bold uppercase tracking-[0.12em] text-ink">
              {GOOGLE.label[locale]}
            </p>
            <div className="mt-2">
              <Stars n={GOOGLE.stars} size="h-7 w-7" />
            </div>
            <p className="mt-2 text-[0.92rem] text-muted">
              {t("sec.reviews.basedOn")}{" "}
              <strong className="font-semibold text-ink">
                {GOOGLE.count} {t("sec.reviews.count")}
              </strong>
              {GOOGLE.rating != null && (
                <span className="text-ink"> · {GOOGLE.rating.toFixed(1)}/5</span>
              )}
            </p>
            <a
              href={GOOGLE.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block transition-transform hover:scale-105"
              aria-label={t("sec.reviews.ctaBtn")}
            >
              <GoogleWordmark className="h-8" />
            </a>
          </div>
        </Reveal>

        {/* ---- Carousel ---- */}
        <div className="relative mt-10">
          <button
            onClick={() => nudge(-1)}
            aria-label={t("sec.reviews.prev")}
            className="absolute -left-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-card text-muted shadow-card transition-colors hover:text-crimson-600 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => nudge(1)}
            aria-label={t("sec.reviews.next")}
            className="absolute -right-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-card text-muted shadow-card transition-colors hover:text-crimson-600 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={rail}
            className="no-bar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 sm:px-6"
            tabIndex={0}
            role="region"
            aria-label={t("sec.reviews.title")}
          >
            {REVIEWS.map((r, i) => (
              <ReviewCard key={`${r.author}-${i}`} r={r} />
            ))}
          </div>
        </div>

        {/* ---- Secondary proof + CTA ---- */}
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-line bg-card px-6 py-5 shadow-card sm:flex-row">
            <a
              href={TRIPADVISOR.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-[0.86rem] text-muted transition-colors hover:text-ink"
            >
              <Stars n={5} size="h-3.5 w-3.5" />
              <span>
                <strong className="font-semibold text-ink">{TRIPADVISOR.rating}</strong> ·{" "}
                {TRIPADVISOR.count} {t("sec.reviews.count")} · Tripadvisor ·{" "}
                {TRIPADVISOR.rank[locale]}
              </span>
            </a>
            <a
              href={GOOGLE.writeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-line-strong bg-canvas px-6 py-3 text-[0.85rem] font-bold text-ink transition-colors hover:border-crimson-500 hover:text-crimson-600"
            >
              <GoogleG />
              {t("sec.reviews.ctaBtn")}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
