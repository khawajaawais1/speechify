"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Marquee } from "../Marquee";
import { Photo } from "../Photo";
import { SectionHead } from "./SectionHead";
import { useLocale, useT } from "@/lib/useLocale";
import { GALLERY } from "@/data/site";

export function GalleryStrip() {
  const t = useT();
  const locale = useLocale();
  const rowA = GALLERY.slice(0, 8);
  const rowB = GALLERY.slice(7, 15);

  const Tile = ({ src, i }: { src: string; i: number }) => (
    <motion.div
      whileHover={{ scale: 1.04, rotate: i % 2 ? 1 : -1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="mx-2 h-[13rem] w-[17rem] shrink-0 sm:h-[16rem] sm:w-[21rem]"
    >
      <Photo src={src} alt="" className="h-full w-full rounded-2xl border-4 border-white shadow-card" sizes="336px" />
    </motion.div>
  );

  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHead eyebrow={t("sec.gallery.eyebrow")} title={t("sec.gallery.title")} />
          <Link
            href={`/${locale}/reservations`}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-crimson-600 hover:text-crimson-700"
          >
            {t("nav.reserve")}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      <div className="mt-12 space-y-4">
        <Marquee duration={52}>
          {rowA.map((src, i) => <Tile key={`a-${i}`} src={src} i={i} />)}
        </Marquee>
        <Marquee duration={64} reverse>
          {rowB.map((src, i) => <Tile key={`b-${i}`} src={src} i={i} />)}
        </Marquee>
      </div>
    </section>
  );
}
