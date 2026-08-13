"use client";

import { useReveal } from "@/lib/reveal";

type As = "div" | "section" | "li" | "article" | "span" | "p";

/**
 * Scroll reveal. CSS driven, fail-safe: content ships visible and is only
 * hidden if it is genuinely below the fold when the page loads.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: As;
  /** @deprecated kept for call-site compatibility; ignored. */
  variants?: unknown;
}) {
  const ref = useReveal<HTMLElement>(delay);
  const Tag = as as "div";
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={`rv ${className}`}
    >
      {children}
    </Tag>
  );
}

/**
 * Reveals children in sequence. Each child gets its own delay via
 * `--rv-delay`, set from CSS `:nth-child`, so there is no per-item JS.
 */
export function RevealGroup({
  children,
  className = "",
  staggerChildren = 0.07,
}: {
  children: React.ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
  amount?: number;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`rv rv-group ${className}`}
      style={{ ["--rv-stagger" as string]: `${staggerChildren}s` }}
    >
      {children}
    </div>
  );
}
