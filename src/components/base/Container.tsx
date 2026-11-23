import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends ComponentProps<"div"> {
  /** "content" = largura máxima do site (default) · "texto" = medida de leitura. */
  size?: "content" | "texto";
}

const larguras = {
  content: "max-w-content",
  texto: "max-w-texto",
} as const;

export function Container({ size = "content", className, ...props }: ContainerProps) {
  return <div className={cn("mx-auto w-full px-gutter", larguras[size], className)} {...props} />;
}
