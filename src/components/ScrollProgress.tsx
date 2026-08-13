"use client";

import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const w = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX: w }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-[linear-gradient(90deg,#f5a524,#e4572e,#c1272d)]"
      aria-hidden
    />
  );
}
