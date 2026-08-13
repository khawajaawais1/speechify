"use client";

import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, getT, isLocale, type Locale } from "./i18n";

export function useLocale(): Locale {
  const path = usePathname() ?? "/";
  const seg = path.split("/")[1] ?? "";
  return isLocale(seg) ? seg : DEFAULT_LOCALE;
}

export function useT() {
  return getT(useLocale());
}

/** Swap the locale segment of the current path. */
export function swapLocale(path: string, to: Locale) {
  const parts = path.split("/");
  if (isLocale(parts[1] ?? "")) parts[1] = to;
  else parts.splice(1, 0, to);
  return parts.join("/") || `/${to}`;
}
