"use client";

export function Marquee({
  children, duration = 42, className = "", reverse = false, fade = "canvas",
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  reverse?: boolean;
  /** Colour the edge fades blend into. `none` disables them. */
  fade?: "canvas" | "canvas-2" | "none";
}) {
  const from = fade === "canvas-2" ? "from-canvas-2" : "from-canvas";
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="marquee-track"
        style={{
          ["--dur" as string]: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>{children}</div>
      </div>
      {fade !== "none" && (
        <>
          <div className={`pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r ${from} to-transparent`} />
          <div className={`pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l ${from} to-transparent`} />
        </>
      )}
    </div>
  );
}
