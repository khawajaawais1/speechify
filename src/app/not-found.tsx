import Link from "next/link";

/**
 * Root 404. This sits outside the [locale] segment, so there is no locale to
 * read — it shows both languages rather than guessing wrong.
 */
export default function NotFound() {
  return (
    <main className="wash flex min-h-[100svh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-display text-8xl font-semibold text-gradient-sun">404</p>
      <div className="max-w-md space-y-2">
        <p className="font-display text-xl text-ink">Tätä sivua ei ole ruokalistalla</p>
        <p className="text-[0.92rem] text-muted">
          Linkki voi olla vanha tai sivu on siirtynyt.
        </p>
        <p className="pt-2 text-[0.92rem] text-muted">
          That page isn&apos;t on the menu — the link may be old or the page has moved.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/fi"
          className="bg-sun rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-glow"
        >
          Etusivulle
        </Link>
        <Link
          href="/en"
          className="rounded-full border border-line-strong bg-card px-7 py-3.5 text-sm font-bold text-ink shadow-card transition-colors hover:border-crimson-500 hover:text-crimson-600"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
