import { useEffect, useState } from "react";
import { getStatusHorario, type StatusHorario } from "@/lib/horario";

/** Status do selo, calculado só depois do mount e a cada 60 s (ADR-007). null até lá. */
export function useStatusHorario(): StatusHorario | null {
  const [status, setStatus] = useState<StatusHorario | null>(null);

  useEffect(() => {
    const atualizar = () => setStatus(getStatusHorario());
    const primeiro = window.setTimeout(atualizar, 0);
    const intervalo = window.setInterval(atualizar, 60_000);
    return () => {
      window.clearTimeout(primeiro);
      window.clearInterval(intervalo);
    };
  }, []);

  return status;
}
