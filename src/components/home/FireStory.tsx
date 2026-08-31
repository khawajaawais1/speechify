"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Photo } from "../Photo";
import { Btn } from "../Button";
import { useLocale, useT } from "@/lib/useLocale";
import { FIRE_FRAMES } from "@/data/site";

/**
 * Scroll-scrubbed reveal: flames roar, die back, and leave the finished dish.
 *
 * The section is three viewports tall with a pinned stage inside, so the user's
 * scroll position IS the timeline. Scroll down and the fire builds; keep going
 * and it burns down to the plate. Scrolling back up rewinds it.
 *
 * ── Why it is built this way ────────────────────────────────────────────
 * Smoothness here comes from doing as little as possible per frame:
 *
 * • Progress runs through `useSpring`, so a coarse mouse wheel (which fires in
 *   big discrete jumps) becomes a continuous glide instead of a stutter.
 * • Only `opacity` and `transform` are animated. Both are compositor
 *   properties — no layout, no paint.
 * • Every layer is promoted once (`.fire-layer`) so the browser keeps it as a
 *   texture rather than re-rasterising it on each scroll tick.
 * • No `mix-blend-mode` and no animated `filter: blur()` over full-screen
 *   elements. Both force a repaint of the whole stage every frame and were the
 *   main source of jank in the first version.
 * • The zoom is applied once to a wrapper, not per-frame.
 *
 * The copy is deliberately NOT two overlapping opacity-crossfaded blocks. That
 * relies on two independent motion values staying perfectly complementary, and
 * if the transforms do not attach you get both captions on screen at once.
 * Instead a single stage flag renders one block or the other, so overlap is
 * structurally impossible.
 *
 * IMPORTANT: nothing wrapping this may set `overflow: hidden` or
 * `content-visibility`, or `position: sticky` stops working. It is deliberately
 * excluded from the `.defer` wrappers on the home page.
 */

/** Deterministic — no Math.random(), so SSR and client markup agree. */
const EMBERS = [
  { x: "16%", dx: "-26px", dur: "3.4s", delay: "0s", s: 1 },
  { x: "31%", dx: "18px", dur: "4.1s", delay: "0.7s", s: 0.7 },
  { x: "46%", dx: "-12px", dur: "3.7s", delay: "1.4s", s: 1.1 },
  { x: "61%", dx: "24px", dur: "4.4s", delay: "0.35s", s: 0.85 },
  { x: "76%", dx: "-20px", dur: "3.9s", delay: "1.9s", s: 0.95 },
  { x: "88%", dx: "14px", dur: "4.6s", delay: "1.1s", s: 0.65 },
];

/**
 * Total section height. Longer = slower, calmer scrub.
 *
 * Read from `--fire-runway` in globals.css so it can be shorter on a phone
 * (220svh) than on a desktop (320svh) — a media query cannot reach an inline
 * style. The literal fallback inside `var()` means that even if the custom
 * property never resolves, the section still has a height and the sticky
 * child still has something to scrub against.
 */
const SCROLL_LENGTH = "var(--fire-runway, 320svh)";

export function FireStory() {
  const t = useT();
  const locale = useLocale();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // The single most effective smoothness fix: a wheel notch moves scroll in a
  // large jump, and mapping that straight to opacity looks like a flicker.
  // Spring-damping it turns the same input into a continuous glide.
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.0005 });

  // Long, generously overlapping cross-fades — short ones read as cuts.
  const f1 = useTransform(p, [0.00, 0.18, 0.34], [1, 1, 0]);
  const f2 = useTransform(p, [0.20, 0.34, 0.46, 0.58], [0, 1, 1, 0]);
  const f3 = useTransform(p, [0.44, 0.58, 0.68, 0.80], [0, 1, 1, 0]);
  const f4 = useTransform(p, [0.66, 0.84, 1.00], [0, 1, 1]);

  // One slow push-in for the whole sequence, applied to a single wrapper.
  const zoom = useTransform(p, [0, 1], [1.14, 1.0]);
  const glow = useTransform(p, [0, 0.28, 0.62, 0.8], [0.9, 0.75, 0.28, 0]);
  const embers = useTransform(p, [0, 0.5, 0.72], [1, 0.85, 0]);
  const hint = useTransform(p, [0, 0.1, 0.22], [1, 1, 0]);

  // Copy: one block at a time, so the two captions can never both be on screen.
  const [late, setLate] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v > 0.62;
    if (next !== late) setLate(next);
  });

  const frames = FIRE_FRAMES;
  const dish = frames[frames.length - 1];
  const canScrub = frames.length === 4 && !reduce;

  /** Reduced motion, no JS, or frames not configured: one complete panel. */
  const StaticPanel = (
    <div className="relative h-[70svh] min-h-[26rem] w-full overflow-hidden">
      <Photo src={dish} alt={t("fire.dishAlt")} grade={false} className="h-full w-full" sizes="100vw" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(34,19,16,.4),rgba(34,19,16,.85))]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[0.72rem] font-bold uppercase tracking-[0.3em] text-saffron-300">
          {t("fire.eyebrow")}
        </p>
        <h2 className="display-lg mt-4 max-w-3xl !text-white">{t("fire.l2")}</h2>
        <div className="mt-7">
          <Btn href={`/${locale}/shop`}>
            {t("fire.cta")}
            <ArrowRight className="h-4 w-4" />
          </Btn>
        </div>
      </div>
    </div>
  );

  if (!canScrub) return <section className="relative bg-ink">{StaticPanel}</section>;

  return (
    <section
      ref={ref}
      className="relative bg-ink"
      // Inline rather than an arbitrary Tailwind class: if this height is ever
      // dropped the section collapses onto its sticky child and the scrub
      // silently breaks, so it should not depend on class generation.
      style={{ height: SCROLL_LENGTH }}
    >
      <noscript>
        <style>{`.fire-stage{display:none!important}.fire-noscript{display:block!important}`}</style>
      </noscript>
      <div className="fire-noscript hidden">{StaticPanel}</div>

      <div className="fire-stage sticky top-0 h-[100svh] w-full overflow-hidden">
        {/*
          Two layouts in one tree.

          MOBILE — a flex column. The picture and the copy are laid out in flow
          and centred as a group, so the gap between them is whatever is left
          over, split evenly. The previous version pinned the card to the top
          and the copy to the bottom, which on a tall phone left a dead band of
          background between them and tucked the card's top edge under the
          fixed nav. Flow layout cannot do either: `pt-[var(--nav-h)]` reserves
          the nav, `justify-center` handles the rest, and nothing needs to know
          how tall anything else is.

          sm AND UP — every child goes back to `absolute inset-0` and the
          sequence is full-bleed with the copy centred over it, exactly as
          before. Paint order is set with explicit z-indexes rather than DOM
          order, because the two layouts need the same stacking.

          Giving the picture a fixed height never worked here: the stage is a
          full 100svh and a 16:9 frame at any fixed fraction of that leaves the
          remainder empty, wherever the remainder is put. Centring the group
          left a dead band above the picture; pinning the picture to the top
          left one below the copy.

          So nothing is fixed. The copy and the scroll cue are `shrink-0` — they
          are as tall as their text — and the picture takes `flex-1`, absorbing
          every pixel that is left on whatever screen this is. There is no
          slack to distribute because there is no slack. On a tall phone the
          card is simply a taller card.
        */}
        <div className="relative flex h-full flex-col gap-5 px-5 pb-7 pt-[calc(var(--nav-h)+0.5rem)] sm:block sm:gap-0 sm:p-0">
        {/* One wrapper carries the zoom, so the frames themselves only ever
            change opacity.

            On a phone these 16:9 frames were being cropped into a portrait
            slot barely half as wide as they are — the dish ended up in a band
            at the top with the pan filling everything below it. A card sized
            by viewport height crops the sides instead, where there is nothing,
            and keeps the food whole. Height rather than aspect ratio: an
            aspect-based card is as tall as the screen is wide, which on a
            narrow-but-short phone eats the space the copy needs. */}
        <motion.div
          style={{ scale: zoom }}
          className="fire-layer relative z-0 mx-auto min-h-0 w-full max-w-md flex-1 overflow-hidden rounded-[2rem] ring-1 ring-white/10 sm:absolute sm:inset-0 sm:mx-0 sm:max-w-none sm:flex-none sm:rounded-none sm:ring-0"
        >
          {[f1, f2, f3, f4].map((opacity, i) => (
            <motion.div key={frames[i]} style={{ opacity }} className="fire-layer absolute inset-0">
              <Photo
                src={frames[i]}
                alt={i === 3 ? t("fire.dishAlt") : ""}
                quality={i === 0 || i === 3 ? 82 : 45}
                grade={false}
                // No `priority`: this section is below the fold and eager-loading
                // it would compete with the hero for largest-contentful-paint.
                // The 320svh runway gives the browser a full viewport of scroll
                // to fetch these before the stage pins.
                className="h-full w-full"
                imgClassName="object-cover"
                sizes="100vw"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Firelight. A plain gradient, no blend mode — blending a full-screen
            layer repaints the whole stage on every scroll tick. */}
        <motion.div
          aria-hidden
          style={{ opacity: glow }}
          className="fire-layer pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(75%_58%_at_50%_95%,rgba(255,186,84,.72),rgba(228,87,46,.3)_46%,rgba(228,87,46,0)_78%)]"
        />

        <motion.div
          aria-hidden
          style={{ opacity: embers }}
          className="fire-layer pointer-events-none absolute inset-0 z-[1] hidden sm:block"
        >
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
        </motion.div>

        {/* Legibility scrim — only from `sm` up. Below that the copy sits
            under the card rather than on it, so darkening the photo would
            cost contrast on the dish and buy nothing. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2] hidden bg-[linear-gradient(180deg,rgba(34,19,16,.6),rgba(34,19,16,.25)_38%,rgba(34,19,16,.82))] sm:block"
        />

        {/* Copy — exactly one block is ever rendered */}
        <div className="relative z-[3] flex w-full shrink-0 items-center justify-center sm:absolute sm:inset-0 sm:px-6">
          <div key={late ? "late" : "early"} className="copy-swap mx-auto max-w-3xl text-center">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.3em] text-saffron-300">
              {late ? t("fire.dish") : t("fire.eyebrow")}
            </p>
            <h2 className="display-lg mt-3 !text-white sm:mt-4">{late ? t("fire.l2") : t("fire.l1")}</h2>
            {late && (
              <div className="mt-6 sm:mt-8">
                <Btn href={`/${locale}/shop`}>
                  {t("fire.cta")}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Btn>
              </div>
            )}
          </div>
        </div>

        <motion.div
          style={{ opacity: hint }}
          className="pointer-events-none relative z-[3] flex shrink-0 flex-col items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.3em] text-white/70 sm:absolute sm:inset-x-0 sm:bottom-8"
        >
          {t("fire.hint")}
          <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
        </motion.div>
        </div>
      </div>
    </section>
  );
}
