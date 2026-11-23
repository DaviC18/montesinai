import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  /** Âncora obrigatória (RF04). */
  id: string;
  tone?: "default" | "muted" | "inverse";
  "aria-labelledby"?: string;
}

const tons = {
  default: "bg-background",
  muted: "bg-muted",
  inverse: "bg-inverse text-inverse-foreground",
} as const;

export function Section({ id, tone = "default", className, ...props }: SectionProps) {
  return (
    <section
      id={id}
      data-tone={tone}
      className={cn("scroll-mt-header py-section", tons[tone], className)}
      {...props}
    />
  );
}
