import type { Metadata } from "next";
import { CheckoutResult } from "@/components/pages/CheckoutResult";
export const metadata: Metadata = { title: "Payment cancelled", robots: { index: false } };
export default function CancelPage() { return <CheckoutResult kind="cancel" />; }
