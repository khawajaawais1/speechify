import type { Variants, Transition } from "motion/react";

export const EASE = [0.16, 1, 0.3, 1] as const;
export const SPRING: Transition = { type: "spring", stiffness: 380, damping: 34, mass: 0.7 };
export const SOFT: Transition = { duration: 0.75, ease: EASE };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: SOFT },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: SOFT },
};

export const stagger = (delayChildren = 0.05, staggerChildren = 0.07): Variants => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
});

/** Split a string into word spans for per-word reveals. */
export const words = (s: string) => s.split(" ");

export const wordUp: Variants = {
  hidden: { y: "110%", opacity: 0 },
  show: { y: "0%", opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

export const viewportOnce = { once: true, amount: 0.25 } as const;
