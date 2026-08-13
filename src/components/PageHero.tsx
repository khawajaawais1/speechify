"use client";

import { SplitText } from "./SplitText";
import { Reveal } from "./Reveal";
import { Photo } from "./Photo";

export function PageHero({
  eyebrow, title, sub, image,
}: { eyebrow?: string; title: string; sub?: string; image?: string }) {
  return (
    <header className="wash relative overflow-hidden pb-14 pt-[calc(var(--nav-h)+3.5rem)] sm:pb-18">

      <div className="relative mx-auto grid max-w-[88rem] items-end gap-10 px-5 sm:px-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          {eyebrow && (
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="inline-block h-px w-8 bg-crimson-500/50" />{eyebrow}
              </p>
            </Reveal>
          )}
          <h1 className="display-lg mt-4 max-w-3xl">
            <SplitText text={title} stagger={0.045} />
          </h1>
          {sub && (
            <Reveal delay={0.15}>
              <p className="mt-5 max-w-2xl text-[0.96rem] leading-relaxed text-muted">{sub}</p>
            </Reveal>
          )}
        </div>

        {image && (
          <Reveal delay={0.1} className="hidden lg:block">
            <div className="relative">
              <div aria-hidden className="bg-sun absolute -right-4 -top-4 bottom-4 left-8 rounded-[2.25rem] opacity-85" />
              <Photo
                src={image}
                alt=""
                priority
                className="relative aspect-[5/4] w-full rounded-[2rem] border-4 border-white shadow-lift"
                sizes="34vw"
              />
            </div>
          </Reveal>
        )}
      </div>
    </header>
  );
}
