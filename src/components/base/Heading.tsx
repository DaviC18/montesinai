import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type Nivel = 1 | 2 | 3 | 4;
type Tamanho = "h1" | "h2" | "h3" | "h4";

export interface HeadingProps extends ComponentPropsWithoutRef<"h2"> {
  /** Tag semântica (h1–h4). */
  level: Nivel;
  /** Tamanho visual; default = `h${level}`. */
  size?: Tamanho;
}

// Peso vem do tamanho visual: 400 em h1–h3, 600 só em h4.
const tamanhos: Record<Tamanho, string> = {
  h1: "text-h1 font-normal",
  h2: "text-h2 font-normal",
  h3: "text-h3 font-normal",
  h4: "text-h4 font-semibold",
};

export function Heading({ level, size, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      className={cn(
        "font-display tracking-display text-balance",
        tamanhos[size ?? `h${level}`],
        className,
      )}
      {...props}
    />
  );
}
