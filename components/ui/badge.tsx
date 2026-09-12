import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center rounded-full border border-white/12 bg-black/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-[var(--muted)]", className)} {...props} />;
}
