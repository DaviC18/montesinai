import { clinica, type DiaSemana, type Horario } from "@/data/clinica";
import { preencher } from "@/lib/conteudo";
import { formatHora } from "@/lib/horario";

export interface LinhaHorario {
  dias: string; // "Segunda a Sexta"
  horas: string | null; // "7h às 20h" · null = fechado
  pendente: boolean;
}

interface Rotulos {
  dias: readonly string[]; // índice = DiaSemana
  intervaloDias: string; // "{inicio} a {fim}"
  intervaloHoras: string; // "{abre} às {fecha}"
}

function rotuloDias(dias: readonly DiaSemana[], rotulos: Rotulos): string {
  const ordenados = [...dias].sort((a, b) => a - b);
  const primeiro = ordenados[0];
  const ultimo = ordenados[ordenados.length - 1];
  if (primeiro === undefined || ultimo === undefined) return "";
  const nome = (d: DiaSemana) => rotulos.dias[d] ?? "";
  const consecutivos = ultimo - primeiro === ordenados.length - 1;
  if (ordenados.length === 1) return nome(primeiro);
  if (consecutivos)
    return preencher(rotulos.intervaloDias, { inicio: nome(primeiro), fim: nome(ultimo) });
  return ordenados.map(nome).join(", ");
}

/** Linhas da tabela de horário: faixas na ordem de `horarios`, depois os dias sem faixa (fechados). */
export function getTabelaHorario(
  horarios: readonly Horario[] = clinica.horarios,
  rotulos: Rotulos = clinica.ui.localizacao,
): LinhaHorario[] {
  const linhas: LinhaHorario[] = horarios.map((h) => ({
    dias: rotuloDias(h.dias, rotulos),
    horas: preencher(rotulos.intervaloHoras, {
      abre: formatHora(h.abre),
      fecha: formatHora(h.fecha),
    }),
    pendente: h.pendente === true,
  }));
  const cobertos = new Set(horarios.flatMap((h) => h.dias));
  const fechados = ([0, 1, 2, 3, 4, 5, 6] as DiaSemana[]).filter((d) => !cobertos.has(d));
  if (fechados.length > 0) {
    linhas.push({ dias: rotuloDias(fechados, rotulos), horas: null, pendente: false });
  }
  return linhas;
}
