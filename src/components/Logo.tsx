"use client";

/**
 * Pasargad identity.
 *
 * A single crimson stroke draws the "P" — the stem runs down the left and the
 * bowl sweeps up and around, closing just short of the stem. A saffron fork
 * sits in the counter, and two saffron leaves (one solid, one outlined) grow
 * from the shoulder. Wordmark in Fraunces, tagline letterspaced beneath.
 *
 * Drawn as paths, so it is sharp at any size and weighs about 1 kB. Matching
 * static exports for print, social and packaging live in /public/brand.
 *
 * Note the hairline strokes stop reading below ~24px, so the favicon and app
 * icon (public/brand/pasargad-icon.svg) use a heavier weight on a crimson tile
 * rather than a shrunken version of this.
 */

type Tone = "brand" | "reversed";

function MarkPaths({ tone }: { tone: Tone }) {
  const line = tone === "reversed" ? "#ffffff" : "#c1272d";
  const accent = tone === "reversed" ? "#ffc45c" : "#f5a524";
  return (
    <>
      {/* the P */}
      <g fill="none" stroke={line} strokeWidth="10.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M68 68V168" />
        <path d="M68 68c0-21 21-33 45-33 26 0 44 20 44 47 0 26-18 44-44 44-9 0-16-2-21-6" />
      </g>
      {/* fork in the counter */}
      <g fill="none" stroke={accent} strokeLinecap="round" strokeLinejoin="round">
        <path d="M104 45v28M116 45v28M128 45v28" strokeWidth="4" />
        <path d="M104 73h24" strokeWidth="4" />
        <path d="M116 73v45" strokeWidth="4.6" />
      </g>
      {/* leaves */}
      <g>
        <path d="M76 56C59 58 39 47 31 26c23-6 41 9 45 30Z" fill={accent} />
        <path
          d="M79 53c-5-17 3-34 20-40 6 19-2 36-20 40Z"
          fill="none"
          stroke={accent}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M83 45c4-11 10-19 16-24"
          fill="none"
          stroke={accent}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    </>
  );
}

/** The symbol on its own. */
export function Monogram({
  className = "h-9 w-9",
  tone = "brand",
}: {
  className?: string;
  tone?: Tone;
}) {
  return (
    <svg viewBox="20 4 155 176" className={className} role="img" aria-label="Pasargad">
      <title>Pasargad Indian Cuisine</title>
      <MarkPaths tone={tone} />
    </svg>
  );
}

/** Header lockup — symbol plus the name. */
export function Wordmark({
  className = "",
  tone = "brand",
  markClass = "h-11 w-11",
  tagline = false,
}: {
  className?: string;
  tone?: Tone;
  markClass?: string;
  /** Adds TASTE. QUALITY. TRADITION. under the name — for the footer, not the nav. */
  tagline?: boolean;
}) {
  const name = tone === "reversed" ? "text-white" : "text-crimson-500";
  const sub = tone === "reversed" ? "text-saffron-300" : "text-saffron-600";

  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Monogram className={`${markClass} shrink-0`} tone={tone} />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.5rem] font-medium tracking-[-0.01em] ${name}`}>
          Pasargad
        </span>
        {tagline && (
          <span className={`mt-[6px] text-[0.5rem] font-semibold uppercase tracking-[0.28em] ${sub}`}>
            Taste. Quality. Tradition.
          </span>
        )}
      </span>
    </span>
  );
}
