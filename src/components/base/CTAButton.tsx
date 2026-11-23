import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink, getMensagemWhatsApp, type ContextoWhatsApp } from "@/lib/whatsapp";

export interface CTAButtonProps extends Omit<
  ComponentPropsWithoutRef<"a">,
  "href" | "target" | "rel"
> {
  /** Define a mensagem pré-preenchida (via getMensagemWhatsApp). */
  contexto: ContextoWhatsApp;
  variant?: "primary" | "secondary" | "inverse";
  size?: "md" | "lg";
  /** Ícone MessageCircle à esquerda (decorativo). Default true. */
  icon?: boolean;
  /** Rótulo vindo de clinica.ts. */
  children: ReactNode;
}

// Sobrescreve escala/tipo/foco do buttonVariants (shadcn) sem editá-lo.
const base =
  "h-auto gap-2 rounded-lg px-5 py-2 text-center text-base font-medium whitespace-normal [&_svg:not([class*='size-'])]:size-5 focus-visible:ring-3 focus-visible:ring-offset-2";

const variantes = {
  primary: cn(
    buttonVariants({ variant: "default" }),
    "hover:bg-primary-hover focus-visible:border-transparent focus-visible:ring-ring focus-visible:ring-offset-background",
  ),
  secondary: cn(
    buttonVariants({ variant: "secondary" }),
    "border-primary/20 hover:bg-accent focus-visible:border-primary/20 focus-visible:ring-ring focus-visible:ring-offset-background",
  ),
  inverse: cn(
    buttonVariants({ variant: "default" }),
    "bg-inverse-foreground text-primary hover:bg-secondary focus-visible:border-transparent focus-visible:ring-inverse-ring focus-visible:ring-offset-inverse",
  ),
} as const;

const tamanhos = {
  md: "min-h-11",
  lg: "min-h-13 px-6 text-lg",
} as const;

export function CTAButton({
  contexto,
  variant = "primary",
  size = "md",
  icon = true,
  className,
  children,
  ...props
}: CTAButtonProps) {
  const href = buildWhatsAppLink({ mensagem: getMensagemWhatsApp(contexto) });
  return (
    <a
      {...props}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-variant={variant}
      className={cn(variantes[variant], base, tamanhos[size], className)}
    >
      {icon ? <MessageCircle aria-hidden="true" /> : null}
      {children}
    </a>
  );
}
