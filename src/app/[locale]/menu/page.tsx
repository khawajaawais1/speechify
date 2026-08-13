import type { Metadata } from "next";
import { MenuView } from "@/components/pages/MenuView";

export const metadata: Metadata = { title: "À la Carte" };

export default function MenuPage() {
  return <MenuView />;
}
