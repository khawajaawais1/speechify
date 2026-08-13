import { Fragment } from "react";

/**
 * Per-word masked reveal — pure CSS.
 *
 * Deliberately NOT a motion component. Headlines are the most important thing
 * on the page, so they must never depend on JavaScript, hydration or an
 * IntersectionObserver firing. The animation runs off a CSS keyframe with
 * `animation-fill-mode: both`, so the worst case is that the text appears
 * without animating — never that it stays invisible.
 *
 * The inter-word space is rendered BETWEEN the clipping spans, not inside
 * them: a trailing space inside an `inline-block` with `overflow: hidden`
 * gets dropped by the browser, which welds words together ("Ataste").
 * Keeping it outside also lets long headlines wrap normally.
 */
export function SplitText({
  text,
  className = "",
  delay = 0,
  stagger = 0.055,
}: {
  text: string;
  className?: string;
  /** Seconds before the first word starts. */
  delay?: number;
  /** Seconds between words. */
  stagger?: number;
}) {
  const parts = text.split(" ").filter(Boolean);
  return (
    <span className={`split ${className}`}>
      {parts.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className="split-line">
            <span
              className="split-word"
              style={{ ["--d" as string]: `${(delay + i * stagger).toFixed(3)}s` }}
            >
              {w}
            </span>
          </span>
          {i < parts.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
