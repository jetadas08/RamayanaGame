import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("sacred-card rounded-[1.2rem] border border-[var(--gold)]/20 bg-[var(--panel)] shadow-[0_24px_80px_rgba(0,0,0,.22)] backdrop-blur-xl", className)} {...props} />;
}
