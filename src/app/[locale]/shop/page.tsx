import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopView } from "@/components/pages/ShopView";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta("/shop", isLocale(locale) ? locale : DEFAULT_LOCALE);
}

export default function ShopPage() {
  // ShopView reads ?c= for the category filter, which needs a Suspense
  // boundary or the whole route opts out of static rendering.
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ShopView />
    </Suspense>
  );
}
