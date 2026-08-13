"use client";

import { Marquee } from "../Marquee";
import { useLocale } from "@/lib/useLocale";

const items = {
  en: ["Tandoor fired", "Daily buffet", "Free delivery 5 km", "Vegan friendly", "Catering & private events", "Fresh, never frozen", "Since 2016", "Order in 30 min"],
  fi: ["Tandoorista", "Päivittäinen buffet", "Ilmainen toimitus 5 km", "Vegaaniystävällinen", "Catering ja juhlat", "Tuoretta, ei pakastettua", "Vuodesta 2016", "Toimitus 30 min"],
};

export function Ticker() {
  const locale = useLocale();
  return (
    <div className="bg-crimson-grad relative z-10 py-4">
      <Marquee duration={38} fade="none">
        {items[locale].map((s, i) => (
          <span key={`${s}-${i}`} className="flex items-center">
            <span className="whitespace-nowrap px-7 font-display text-[1.05rem] font-medium text-white">
              {s}
            </span>
            <span className="h-1.5 w-1.5 rotate-45 bg-saffron-400" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
