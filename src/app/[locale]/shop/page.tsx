import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopView } from "@/components/pages/ShopView";

export const metadata: Metadata = { title: "Order Online" };

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ShopView />
    </Suspense>
  );
}
