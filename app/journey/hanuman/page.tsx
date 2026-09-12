import type { Metadata } from "next";
import { JourneyMap } from "@/components/journey-map";

export const metadata: Metadata = { title: "Hanumān’s Journey Map" };
export default function HanumanJourneyPage() { return <main className="pt-[72px]"><JourneyMap /></main>; }
