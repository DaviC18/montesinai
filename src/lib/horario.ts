import { clinica, type DiaSemana, type Horario } from "@/data/clinica";

export interface PartesNoFuso {
  dia: DiaSemana; // 0 = domingo, no fuso da clínica
  minutos: number; // minutos desde 00:00 no fuso da clínica
}

export type StatusHorario =
  | { estado: "aberto"; fecha: string } // "20:00" — faixa corrente
  | { estado: "fechado" }
  | { estado: "indefinido" }; // dia coberto por faixa pendente (ADR-004)

export interface OpcoesHorario {
  horarios?: readonly Horario[]; // default clinica.horarios
  timeZone?: string; // default clinica.timezone
}

const DIAS: Record<string, DiaSemana> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const formatadores = new Map<string, Intl.DateTimeFormat>();

function getFormatador(timeZone: string): Intl.DateTimeFormat {
  let formatador = formatadores.get(timeZone);
  if (!formatador) {
    formatador = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    formatadores.set(timeZone, formatador);
  }
  return formatador;
}

function paraMinutos(hhmm: string): number {
  const [h = "0", m = "0"] = hhmm.split(":");
  return Number(h) * 60 + Number(m);
}

/** Dia/minuto em `timeZone` via Intl.DateTimeFormat (weekday "short" + hour/minute, hourCycle "h23"). Nunca offset fixo. */
export function getPartesNoFuso(now: Date, timeZone: string): PartesNoFuso {
  let weekday = "";
  let hora = 0;
  let minuto = 0;
  for (const parte of getFormatador(timeZone).formatToParts(now)) {
    if (parte.type === "weekday") weekday = parte.value;
    else if (parte.type === "hour") hora = Number(parte.value);
    else if (parte.type === "minute") minuto = Number(parte.value);
  }
  const dia = DIAS[weekday];
  if (dia === undefined) throw new Error(`Dia da semana inesperado: "${weekday}"`);
  // Alguns motores antigos devolvem "24" à meia-noite mesmo com h23.
  return { dia, minutos: (hora % 24) * 60 + minuto };
}

/**
 * Regra (ordem):
 * 1. Se algum Horario com `pendente: true` inclui o dia ⇒ "indefinido" (o dia inteiro, qualquer hora).
 * 2. Se existe faixa confirmada com abre <= minutos < fecha ⇒ "aberto".
 * 3. Senão ⇒ "fechado" (inclui domingo, ausente da lista).
 */
export function getStatusHorario(
  now: Date = new Date(),
  opcoes: OpcoesHorario = {},
): StatusHorario {
  const { horarios = clinica.horarios, timeZone = clinica.timezone } = opcoes;
  const { dia, minutos } = getPartesNoFuso(now, timeZone);
  const doDia = horarios.filter((h) => h.dias.includes(dia));

  if (doDia.some((h) => h.pendente === true)) return { estado: "indefinido" };

  const faixa = doDia.find((h) => paraMinutos(h.abre) <= minutos && minutos < paraMinutos(h.fecha));
  return faixa ? { estado: "aberto", fecha: faixa.fecha } : { estado: "fechado" };
}

/** true = aberto, false = fechado, null = indefinido. Compare com `=== true`. */
export function isOpenNow(now: Date = new Date(), opcoes: OpcoesHorario = {}): boolean | null {
  const status = getStatusHorario(now, opcoes);
  if (status.estado === "indefinido") return null;
  return status.estado === "aberto";
}

/** "20:00" ⇒ "20h"; "07:30" ⇒ "7h30". */
export function formatHora(hhmm: string): string {
  const [h = "0", m = "00"] = hhmm.split(":");
  const hora = String(Number(h));
  return m === "00" ? `${hora}h` : `${hora}h${m}`;
}
