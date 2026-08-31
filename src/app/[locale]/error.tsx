"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

/**
 * Route error boundary.
 *
 * Without this, an unhandled render error in production shows Next's bare
 * "Application error: a client-side exception has occurred" — no branding, no
 * phone number, no way back. For a restaurant the cost of that is a customer
 * who was about to order and now cannot, so the one thing this page must always
 * offer is the phone number.
 *
 * It sits inside [locale] so it can read the language from the URL. It cannot
 * use the translation hook: the error may have come from the provider tree
 * itself, so the copy is inlined.
 */

const COPY = {
  fi: {
    eyebrow: "Jotain meni pieleen",
    title: "Keittiössä sattui virhe",
    body: "Sivun lataaminen epäonnistui. Yritä uudelleen — jos vika toistuu, otathan yhteyttä puhelimitse, niin hoidamme tilauksen.",
    retry: "Yritä uudelleen",
    home: "Etusivulle",
    call: "Soita meille",
  },
  en: {
    eyebrow: "Something went wrong",
    title: "That didn't come out of the kitchen right",
    body: "We couldn't load this page. Try again — and if it keeps happening, give us a call and we'll take care of your order.",
    retry: "Try again",
    home: "Back to home",
    call: "Call us",
  },
} as const;

const PHONE = "+358 50 4757157";
const PHONE_HREF = "tel:+358504757157";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const locale = params?.locale === "en" ? "en" : "fi";
  const c = COPY[locale];

  useEffect(() => {
    // `digest` is the only handle on the server-side stack in production.
    console.error("[route error]", error.digest ?? "", error.message);
  }, [error]);

  return (
    <main className="wash flex min-h-[80svh] flex-col items-center justify-center gap-7 px-6 py-24 text-center">
      <p className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-crimson-500">
        {c.eyebrow}
      </p>
      <h1 className="display-lg max-w-2xl">{c.title}</h1>
      <p className="max-w-md text-[0.95rem] leading-relaxed text-muted">{c.body}</p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="bg-sun rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-glow transition-transform hover:scale-105"
        >
          {c.retry}
        </button>
        <Link
          href={`/${locale}`}
          className="rounded-full border border-line-strong bg-card px-7 py-3.5 text-sm font-bold text-ink shadow-card transition-colors hover:border-crimson-500 hover:text-crimson-600"
        >
          {c.home}
        </Link>
      </div>

      <a href={PHONE_HREF} className="text-sm font-bold text-crimson-600 underline-offset-4 hover:underline">
        {c.call} — {PHONE}
      </a>
    </main>
  );
}
