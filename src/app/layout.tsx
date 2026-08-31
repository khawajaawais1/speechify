import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#fdf8f0",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://pasargadseppala.fi"),
  title: {
    default: "Pasargad Indian Cuisine — Jyväskylä",
    template: "%s · Pasargad Indian Cuisine",
  },
  description:
    "Authentic Indian cuisine in Jyväskylä. Daily buffet, à la carte, stone-baked pizza and kebab. Order online for delivery in 30 minutes.",
  openGraph: {
    type: "website",
    siteName: "Pasargad Indian Cuisine",
    locale: "fi_FI",
    alternateLocale: ["en_GB"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    // Apple touch icons must be raster; iOS ignores SVG here.
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The font variables MUST live on <html>. Tailwind's `@theme` emits
    // `--font-display: var(--font-fraunces), …` on :root, and that inner var()
    // is substituted while computing :root. If --font-fraunces is only defined
    // on <body> it is undefined at that point, the whole token becomes invalid,
    // and every display heading silently falls back to the body sans.
    <html lang="fi" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      {/* suppressHydrationWarning: browser extensions (ColorZilla, Grammarly,
          password managers) inject attributes onto <body> before React
          hydrates — e.g. cz-shortcut-listen="true". Harmless, but React logs a
          mismatch. This silences only <body>'s own attributes, not its
          children, so genuine hydration bugs still surface. */}
      <body className="antialiased grain" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
