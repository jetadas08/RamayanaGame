import type { Metadata } from "next";
import { ProgressProvider } from "@/components/progress-provider";
import { SiteHeader } from "@/components/site-header";
import { RouteFocus } from "@/components/route-focus";
import "./tailwind.css";
import "./globals.scss";
import "./atlas.scss";
import "./theme.scss";

export const metadata: Metadata = {
  title: { default: "Hanumān’s Journey | Rāmāyaṇa", template: "%s | Rāmāyaṇa" },
  description: "A sacred adventure atlas following Hanumān’s journey to Laṅkā.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><ProgressProvider><SiteHeader /><RouteFocus/>{children}</ProgressProvider></body></html>;
}
