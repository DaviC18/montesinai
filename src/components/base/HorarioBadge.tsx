import { formatHora, type StatusHorario } from "@/lib/horario";
import { cn } from "@/lib/utils";

export interface HorarioBadgeProps {
  /** null = ainda não montado ⇒ não renderiza (ADR-007). */
  status: StatusHorario | null;
  /** clinica.ui.selo */
  rotulos: { aberto: string; abertoAte: string; fechado: string };
  /** "agora" ⇒ rotulos.aberto · "ate" ⇒ rotulos.abertoAte com {hora}. */
  variante?: "agora" | "ate";
  className?: string;
}

/** Selo "Aberto agora / Fechado" (RF03). Estado "indefinido" (faixa pendente) não renderiza nada (ADR-004). */
export function HorarioBadge({
  status,
  rotulos,
  variante = "agora",
  className,
}: HorarioBadgeProps) {
  if (status === null || status.estado === "indefinido") return null;

  const aberto = status.estado === "aberto";
  const texto = aberto
    ? variante === "ate"
      ? rotulos.abertoAte.replaceAll("{hora}", formatHora(status.fecha))
      : rotulos.aberto
    : rotulos.fechado;

  return (
    <span
      data-estado={status.estado}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-base font-medium",
        aberto ? "bg-status-open-bg text-status-open" : "bg-status-closed-bg text-status-closed",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-2 shrink-0 rounded-full",
          aberto ? "bg-status-open-dot" : "bg-status-closed",
        )}
      />
      {texto}
    </span>
  );
}
