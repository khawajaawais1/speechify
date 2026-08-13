/**
 * Decorative backdrops.
 *
 * The warm colour wash lives in the `.wash` class in globals.css and is applied
 * directly to the hero element's own background. It used to be an
 * `absolute inset-0 -z-10` overlay here, which is fragile: a negative z-index
 * child paints behind whichever ancestor happens to create a stacking context,
 * so the wash kept disappearing.
 */

/** Faint jali (lattice) pattern used as a section backdrop. */
export function Jali({ className = "", opacity = 0.07 }: { className?: string; opacity?: number }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
      style={{ opacity }}
    >
      <defs>
        <pattern id="jali" width="72" height="124" patternUnits="userSpaceOnUse" patternTransform="scale(0.8)">
          <path
            d="M36 4c17.7 0 32 14.3 32 32v52c0 17.7-14.3 32-32 32S4 105.7 4 88V36C4 18.3 18.3 4 36 4Z"
            fill="none" stroke="currentColor" strokeWidth="1.1"
          />
          <path d="M36 24c8.8 0 16 7.2 16 16v44c0 8.8-7.2 16-16 16s-16-7.2-16-16V40c0-8.8 7.2-16 16-16Z"
            fill="none" stroke="currentColor" strokeWidth="0.9" />
          <circle cx="36" cy="62" r="4" fill="none" stroke="currentColor" strokeWidth="0.9" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#jali)" className="text-crimson-500" />
    </svg>
  );
}
