import type { Metadata } from "next";
import { ReserveView } from "@/components/pages/ReserveView";
export const metadata: Metadata = { title: "Reservations" };
export default function ReservePage() { return <ReserveView />; }
