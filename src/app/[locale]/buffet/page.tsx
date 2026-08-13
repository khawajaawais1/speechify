import type { Metadata } from "next";
import { BuffetView } from "@/components/pages/BuffetView";

export const metadata: Metadata = { title: "Buffet" };

export default function BuffetPage() {
  return <BuffetView />;
}
