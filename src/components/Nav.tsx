"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, Phone, ShoppingBag, X } from "lucide-react";
import { Wordmark } from "./Logo";
import { useCart } from "@/lib/cart";
import { useLocale, useT, swapLocale } from "@/lib/useLocale";
import { LOCALES } from "@/lib/i18n";
import { SITE } from "@/data/site";
import { EASE } from "@/lib/motion";

const links = [
  { href: "", key: "nav.home" },
  { href: "/menu", key: "nav.menu" },
  { href: "/buffet", key: "nav.buffet" },
  { href: "/shop", key: "nav.shop" },
  { href: "/reservations", key: "nav.reserve" },
  { href: "/contact", key: "nav.contact" },
];

export function Nav() {
  const locale = useLocale();
  const t = useT();
  const path = usePathname() ?? "/";
  const { count, setOpen, pulse } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  const isActive = (href: string) => {
    const full = `/${locale}${href}`;
    return href === "" ? path === `/${locale}` : path.startsWith(full);
  };

  return (
    <>
      <header className="nav-in fixed inset-x-0 top-0 z-[65]">
        <div
          className={`transition-all duration-500 ${
            scrolled
              ? "border-b border-line bg-canvas/97 shadow-card lg:bg-canvas/90 lg:backdrop-blur-xl lg:backdrop-saturate-150"
              : "border-b border-transparent bg-transparent"
          }`}
        >
          <nav className="mx-auto flex h-[var(--nav-h)] max-w-[88rem] items-center justify-between gap-6 px-5 sm:px-8">
            <Link href={`/${locale}`} aria-label={t("a11y.home")} className="shrink-0">
              <Wordmark markClass="h-11 w-11" />
            </Link>

            {/* Desktop links */}
            <ul className="hidden items-center gap-1 lg:flex">
              {links.map((l) => {
                const active = isActive(l.href);
                return (
                  <li key={l.key}>
                    <Link
                      href={`/${locale}${l.href}`}
                      className={`relative rounded-full px-4 py-2 text-[0.82rem] font-medium transition-colors ${
                        active ? "text-crimson-600" : "text-muted hover:text-ink"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-crimson-50"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative">{t(l.key)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Locale switch */}
              <div className="hidden items-center rounded-full border border-line p-0.5 sm:flex">
                {LOCALES.map((l) => (
                  <Link
                    key={l}
                    href={swapLocale(path, l)}
                    className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider transition-colors ${
                      l === locale ? "bg-crimson-500 text-white" : "text-muted hover:text-ink"
                    }`}
                  >
                    {l}
                  </Link>
                ))}
              </div>

              <a
                href={SITE.phoneHref}
                aria-label={t("a11y.call")}
                className="hidden h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-crimson-500/50 hover:text-crimson-500 md:flex"
              >
                <Phone className="h-4 w-4" />
              </a>

              {/* Cart */}
              <motion.button
                key={pulse}
                onClick={() => setOpen(true)}
                aria-label={t("cart.title")}
                initial={pulse ? { scale: 1 } : false}
                animate={pulse ? { scale: [1, 1.16, 1] } : {}}
                transition={{ duration: 0.42, ease: EASE }}
                className="bg-sun relative flex h-10 items-center gap-2 rounded-full px-4 text-white shadow-glow transition-transform hover:scale-105"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="text-[0.8rem] font-semibold tabular-nums">{count}</span>
              </motion.button>

              <button
                onClick={() => setMobile((v) => !v)}
                aria-label={t("a11y.menu")}
                aria-expanded={mobile}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink lg:hidden"
              >
                {mobile ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            /* Solid cream, not `bg-ink/90`.
             *
             * The sheet was built for the original dark theme and never
             * followed the retheme: it kept a near-black background while the
             * links kept `text-ink`, which is also near-black. The whole mobile
             * menu was unreadable — dark text on a dark panel, under a cream
             * header bar that made the seam obvious.
             *
             * Solid rather than translucent also drops a `backdrop-blur-2xl`
             * over the full viewport, which is the most expensive filter on the
             * page and was buying nothing behind an opaque panel. */
            className="fixed inset-0 z-[64] bg-canvas lg:hidden"
          >
            <div className="flex h-full flex-col justify-between px-6 pb-10 pt-[calc(var(--nav-h)+2rem)]">
              <ul className="space-y-1">
                {links.map((l, i) => {
                  const active = isActive(l.href);
                  return (
                    <motion.li
                      key={l.key}
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.05, ease: EASE, duration: 0.5 }}
                    >
                      <Link
                        href={`/${locale}${l.href}`}
                        onClick={() => setMobile(false)}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between border-b border-line py-4 font-display text-3xl font-semibold transition-colors ${
                          active ? "text-crimson-600" : "text-ink hover:text-crimson-500"
                        }`}
                      >
                        {t(l.key)}
                        {/* The desktop nav marks the current page with a pill;
                            the mobile sheet had no active state at all. */}
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-crimson-500" />}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center rounded-full border border-line p-0.5">
                  {LOCALES.map((l) => (
                    <Link
                      key={l}
                      href={swapLocale(path, l)}
                      onClick={() => setMobile(false)}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
                        l === locale ? "bg-crimson-500 text-white" : "text-muted"
                      }`}
                    >
                      {l}
                    </Link>
                  ))}
                </div>
                <a href={SITE.phoneHref} className="text-sm font-semibold text-crimson-500">
                  {SITE.phone}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
