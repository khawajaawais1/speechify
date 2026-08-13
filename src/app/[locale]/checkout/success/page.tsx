import type { Metadata } from "next";
import { CheckoutResult } from "@/components/pages/CheckoutResult";
export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };
export default function SuccessPage() { return <CheckoutResult kind="success" />; }
