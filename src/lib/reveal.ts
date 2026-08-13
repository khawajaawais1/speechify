"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll reveal that can never leave content invisible.
 *
 * Elements render VISIBLE. On mount we observe them; only an element that is
 * genuinely below the fold gets hidden and then animated in. If
 * IntersectionObserver is missing, throws, or never fires, the element simply
 * stays visible — there is no state in which the text disappears.
 */
export function useReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (delay) el.style.setProperty("--rv-delay", `${delay}s`);

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduce || typeof IntersectionObserver === "undefined") {
      el.classList.add("rv-in");
      return;
    }

    let first = true;
    let io: IntersectionObserver | null = null;

    try {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (first) {
              first = false;
              // Already on screen at mount — leave it alone, no flash.
              if (e.isIntersecting) {
                el.classList.add("rv-in");
                io?.disconnect();
                return;
              }
              el.classList.add("rv-hidden");
              continue;
            }
            if (e.isIntersecting) {
              el.classList.add("rv-in");
              io?.disconnect();
            }
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
      );
      io.observe(el);
    } catch {
      el.classList.add("rv-in");
    }

    // Belt and braces: nothing stays hidden for more than 3s.
    const safety = window.setTimeout(() => {
      el.classList.add("rv-in");
      io?.disconnect();
    }, 3000);

    return () => {
      window.clearTimeout(safety);
      io?.disconnect();
    };
  }, [delay]);

  return ref;
}
