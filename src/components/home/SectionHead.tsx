"use client";

import { SplitText } from "../SplitText";
import { Reveal } from "../Reveal";

export function SectionHead({
  eyebrow, title, sub, align = "left", className = "",
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"} ${className}`}>
      {eyebrow && (
        <Reveal>
          <p className={`eyebrow flex items-center gap-3 ${center ? "justify-center" : ""}`}>
            <span className="inline-block h-px w-8 bg-crimson-500/60" />
            {eyebrow}
            {center && <span className="inline-block h-px w-8 bg-crimson-500/60" />}
          </p>
        </Reveal>
      )}
      <h2 className="display-lg mt-4">
        <SplitText text={title} stagger={0.045} />
      </h2>
      {sub && (
        <Reveal delay={0.15}>
          <p className="mt-5 text-[0.97rem] leading-relaxed text-muted">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}
