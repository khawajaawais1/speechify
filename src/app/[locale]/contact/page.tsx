import type { Metadata } from "next";
import { ContactView } from "@/components/pages/ContactView";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta("/contact", isLocale(locale) ? locale : DEFAULT_LOCALE);
}

export default function ContactPage() {
  return <ContactView />;
}
