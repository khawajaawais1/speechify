"use client";

import { PageHero } from "../PageHero";
import { MenuRow } from "../ProductCard";
import { Photo } from "../Photo";
import { Reveal } from "../Reveal";
import { Btn } from "../Button";
import { useLocale, useT } from "@/lib/useLocale";
import { CATEGORIES, byCat, type CategoryId } from "@/data/products";
import { PHOTOS } from "@/data/site";
import { ArrowRight } from "lucide-react";

const ORDER: CategoryId[] = [
  "indian-starters", "indian-mains", "biryani", "pizza",
  "vegan-pizza", "kebab", "voner", "falafel", "salads", "drinks",
];

const SECTION_IMG: Partial<Record<CategoryId, string>> = {
  "indian-starters": PHOTOS.food4,
  "indian-mains": PHOTOS.food2,
  biryani: PHOTOS.food3,
  pizza: PHOTOS.food5,
  "vegan-pizza": PHOTOS.food6,
  kebab: PHOTOS.food7,
  voner: PHOTOS.food8,
  falafel: PHOTOS.food9,
  salads: PHOTOS.food1,
  drinks: PHOTOS.interior3,
};

export function MenuView() {
  const t = useT();
  const locale = useLocale();

  return (
    <>
      <PageHero eyebrow={t("nav.menu")} title={t("menu.title")} sub={t("menu.sub")} image={PHOTOS.food2} />

      {/* Sticky category rail */}
      <nav className="sticky top-[var(--nav-h)] z-40 border-y border-line bg-canvas/92 backdrop-blur-xl">
        <div className="mx-auto max-w-[88rem] overflow-x-auto px-5 sm:px-8">
          <ul className="flex gap-1 py-3">
            {ORDER.map((id) => {
              const c = CATEGORIES.find((x) => x.id === id)!;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="block whitespace-nowrap rounded-full px-4 py-2 text-[0.78rem] font-medium text-muted transition-colors hover:bg-crimson-50 hover:text-crimson-600"
                  >
                    {c.label[locale]}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="mx-auto max-w-[88rem] px-5 pb-24 sm:px-8">
        {ORDER.map((id, si) => {
          const c = CATEGORIES.find((x) => x.id === id)!;
          const items = byCat(id);
          if (!items.length) return null;
          return (
            <section key={id} id={id} className="scroll-mt-[calc(var(--nav-h)+5rem)] pt-20">
              <div className="grid gap-8 lg:grid-cols-[18rem_1fr] lg:gap-14">
                <Reveal className="lg:sticky lg:top-[calc(var(--nav-h)+6rem)] lg:h-fit">
                  {SECTION_IMG[id] && (
                    <Photo
                      src={SECTION_IMG[id]!}
                      alt=""
                      className="mb-5 aspect-[4/3] w-full rounded-3xl border-4 border-white shadow-lift"
                      sizes="(max-width:1024px) 92vw, 288px"
                    />
                  )}
                  <p className="eyebrow">{String(si + 1).padStart(2, "0")}</p>
                  <h2 className="display-md mt-2">{c.label[locale]}</h2>
                  <p className="mt-2 text-[0.84rem] text-muted">{c.blurb[locale]}</p>
                </Reveal>

                <ul>
                  {items.map((p, i) => <MenuRow key={p.id} p={p} index={i} />)}
                </ul>
              </div>
            </section>
          );
        })}

        <Reveal className="mt-24">
          <div className="bg-crimson-grad rounded-[2rem] px-8 py-12 text-center shadow-lift">
            <h3 className="display-md !text-white">{t("cta.final.title")}</h3>
            <p className="mx-auto mt-3 max-w-md text-[0.9rem] text-white/80">{t("cta.final.sub")}</p>
            <div className="mt-7 flex justify-center">
              <Btn href={`/${locale}/shop`}>
                {t("nav.order")}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Btn>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
