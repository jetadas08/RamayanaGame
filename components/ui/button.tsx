import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        primary: "bg-[var(--saffron)] px-5 py-3 text-[#24140b] shadow-[0_8px_24px_rgba(196,109,35,.25)] hover:-translate-y-0.5 hover:bg-[var(--saffron-light)]",
        secondary: "border border-white/15 bg-white/8 px-5 py-3 text-[var(--cream)] hover:bg-white/13",
        ghost: "px-4 py-2 text-[var(--muted)] hover:bg-white/7 hover:text-[var(--cream)]",
        icon: "size-10 border border-white/12 bg-white/7 text-[var(--cream)] hover:bg-white/12",
      },
      size: { default: "", sm: "px-3 py-2 text-xs", lg: "px-7 py-4 text-base" },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
