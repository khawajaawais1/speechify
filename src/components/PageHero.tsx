import { Photo } from "./Photo";
import { SplitText } from "./SplitText";

/**
 * Cinematic page header.
 *
 * The old version was a headline on cream beside a small rounded photo — tidy,
 * and completely forgettable. This opens each inner page on a dark full-bleed
 * plate (fire, or a finished dish) that resolves into the light layout below,
 * so the site has a beat of drama before it gets down to business.
 *
 * ── Decisions worth keeping ──────────────────────────────────────────
 *
 * • A cream strip the exact height of the nav sits ABOVE the dark plate.
 *   The nav is a separate fixed element with dark ink links and a transparent
 *   background until you scroll; running a dark image underneath it would make
 *   it unreadable. Inverting the nav would mean either a `:has()` selector
 *   (silently unreadable where it is unsupported) or cross-component state
 *   (a flash on every route change). A strip of the page's own background
 *   costs 76px and cannot fail.
 *
 * • The image only ever scales, and only once. No parallax on the copy: moving
 *   a text layer every frame was the single most expensive thing on the home
 *   page and it fought the headline animation.
 *
 * • Content is in the HTML and visible. `SplitText` is CSS keyframes with
 *   `backwards` fill, so the worst case is text that appears without animating.
 *
 * • No `mix-blend-mode`, no animated `filter: blur()` — both repaint the whole
 *   plate on every frame.
 */

/** Deterministic — no Math.random(), so SSR and client markup agree. */
const EMBERS = [
  { x: "12%", dx: "-22px", dur: "4.2s", delay: "0s", s: 0.85 },
  { x: "28%", dx: "16px", dur: "5.1s", delay: "1.2s", s: 0.6 },
  { x: "47%", dx: "-14px", dur: "4.6s", delay: "2.1s", s: 0.95 },
  { x: "68%", dx: "20px", dur: "5.4s", delay: "0.6s", s: 0.7 },
  { x: "86%", dx: "-18px", dur: "4.9s", delay: "1.8s", s: 0.8 },
];

export function PageHero({
  eyebrow,
  title,
  sub,
  image,
  /** Optional second line, set in gold under the title. */
  accent,
  /** Chips, buttons or stats rendered under the copy. */
  children,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  image?: string;
  accent?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative">
      {/* Keeps the fixed nav on the page's own cream, never on the image. */}
      <div aria-hidden className="wash h-[var(--nav-h)] w-full" />

      <div className="relative isolate w-full overflow-hidden bg-ink">
        {image && (
          <div aria-hidden className="absolute inset-0">
            <Photo
              src={image}
              alt=""
              priority
              grade={false}
              overlay="none"
              quality={82}
              className="h-full w-full"
              imgClassName="ken object-cover"
              sizes="100vw"
            />
          </div>
        )}

        {/* Scrim, then the ember light.
            No jali lattice over the photograph: at any opacity that made it
            visible it read as a watermark stamped across the image rather than
            as texture. The lattice belongs on flat brand surfaces (the footer,
            the fallback dish tiles), not on top of a photo. */}
        <div aria-hidden className="hero-cine-scrim absolute inset-0" />
        <div aria-hidden className="hero-cine-glow pointer-events-none absolute inset-0" />

        <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
          {EMBERS.map((e, i) => (
            <span
              key={i}
              className="story-ember"
              style={{
                ["--x" as string]: e.x,
                ["--dx" as string]: e.dx,
                ["--dur" as string]: e.dur,
                ["--delay" as string]: e.delay,
                ["--s" as string]: String(e.s),
              }}
            />
          ))}
        </div>

        {/* Copy */}
        <div className="relative mx-auto flex min-h-[24rem] max-w-[88rem] flex-col justify-end px-5 pb-14 pt-24 sm:px-8 sm:pb-18 sm:pt-32 lg:min-h-[30rem]">
          {eyebrow && (
            <p
              className="stagger-in flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-saffron-300"
              style={{ ["--d" as string]: "0.05s" }}
            >
              <span className="inline-block h-px w-9 bg-saffron-400/70" />
              {eyebrow}
            </p>
          )}

          <h1 className="display-lg mt-5 max-w-4xl !text-white">
            <SplitText text={title} delay={0.14} stagger={0.045} />
            {accent && (
              <span className="mt-1 block !text-gold-300">
                <SplitText text={accent} delay={0.3} stagger={0.045} />
              </span>
            )}
          </h1>

          {sub && (
            <p
              className="stagger-in mt-6 max-w-2xl text-[1rem] leading-relaxed text-white/80"
              style={{ ["--d" as string]: "0.5s" }}
            >
              {sub}
            </p>
          )}

          {children && (
            <div className="stagger-in mt-8" style={{ ["--d" as string]: "0.65s" }}>
              {children}
            </div>
          )}
        </div>

        {/* Hands off to the cream page below. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(253,248,240,0),var(--color-canvas))]"
        />
      </div>
    </header>
  );
}
