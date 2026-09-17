import type { Metadata } from "next";
import { CampaignMap } from "@/components/campaign-map";

export const metadata: Metadata = { title: "Follow Hanumān Campaign Map" };
export default function HanumanJourneyPage() { return <CampaignMap />; }
