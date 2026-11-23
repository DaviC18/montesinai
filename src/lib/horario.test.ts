import { clinica, type Horario } from "@/data/clinica";
import { formatHora, getPartesNoFuso, getStatusHorario, isOpenNow } from "@/lib/horario";

// Instantes absolutos com offset explícito de Brasília (-03:00): independem do TZ da máquina.
// 24/11/2025 = segunda · 29/11/2025 = sábado · 30/11/2025 = domingo
const brt = (data: string, hora: string) => new Date(`${data}T${hora}:00-03:00`);
const SEG = "2025-11-24";
const SAB = "2025-11-29";
const DOM = "2025-11-30";

describe("getPartesNoFuso", () => {
  it("devolve dia e minutos no fuso pedido", () => {
    expect(getPartesNoFuso(brt(SEG, "10:15"), "America/Sao_Paulo")).toEqual({
      dia: 1,
      minutos: 615,
    });
  });

  it("reconhece a virada de dia UTC: segunda 22:00 BRT = terça 01:00 UTC", () => {
    const now = brt(SEG, "22:00");
    expect(now.toISOString()).toBe("2025-11-25T01:00:00.000Z");
    expect(getPartesNoFuso(now, "America/Sao_Paulo")).toEqual({ dia: 1, minutos: 22 * 60 });
    expect(getPartesNoFuso(now, "UTC")).toEqual({ dia: 2, minutos: 60 });
  });

  it("meia-noite vira 0 minutos (h23)", () => {
    expect(getPartesNoFuso(brt(SEG, "00:00"), "America/Sao_Paulo")).toEqual({
      dia: 1,
      minutos: 0,
    });
  });
});

describe("getStatusHorario (dados de clinica.ts)", () => {
  it.each([
    ["06:59", "fechado"],
    ["07:00", "aberto"],
    ["19:59", "aberto"],
    ["20:00", "fechado"],
  ])("segunda %s BRT ⇒ %s", (hora, estado) => {
    expect(getStatusHorario(brt(SEG, hora)).estado).toBe(estado);
  });

  it("aberto informa o horário de fechamento da faixa corrente", () => {
    expect(getStatusHorario(brt(SEG, "10:00"))).toEqual({ estado: "aberto", fecha: "20:00" });
  });

  it("segunda 22:00 BRT (terça 01:00 UTC) ⇒ fechado", () => {
    expect(getStatusHorario(brt(SEG, "22:00"))).toEqual({ estado: "fechado" });
  });

  it.each(["00:00", "10:00", "23:59"])("domingo %s ⇒ fechado", (hora) => {
    expect(getStatusHorario(brt(DOM, hora))).toEqual({ estado: "fechado" });
  });

  it.each(["06:00", "08:00", "13:00", "23:59"])(
    "sábado %s (faixa pendente) ⇒ indefinido",
    (hora) => {
      expect(getStatusHorario(brt(SAB, hora))).toEqual({ estado: "indefinido" });
    },
  );

  it("sábado continua marcado como pendente em clinica.ts", () => {
    const sabado = clinica.horarios.find((h) => (h.dias as readonly number[]).includes(6));
    expect(sabado && "pendente" in sabado && sabado.pendente).toBe(true);
  });
});

describe("getStatusHorario (opções injetadas)", () => {
  const horarios: Horario[] = [
    { dias: [1], abre: "08:00", fecha: "12:00" },
    { dias: [1], abre: "14:00", fecha: "18:30" },
    { dias: [6], abre: "07:00", fecha: "12:00" },
  ];

  it("escolhe a faixa corrente entre várias no mesmo dia", () => {
    expect(getStatusHorario(brt(SEG, "09:00"), { horarios })).toEqual({
      estado: "aberto",
      fecha: "12:00",
    });
    expect(getStatusHorario(brt(SEG, "13:00"), { horarios }).estado).toBe("fechado");
    expect(getStatusHorario(brt(SEG, "18:29"), { horarios })).toEqual({
      estado: "aberto",
      fecha: "18:30",
    });
  });

  it("sábado confirmado (sem pendente) segue a regra normal", () => {
    expect(getStatusHorario(brt(SAB, "08:00"), { horarios }).estado).toBe("aberto");
    expect(getStatusHorario(brt(SAB, "13:00"), { horarios }).estado).toBe("fechado");
  });

  it("respeita o timeZone injetado", () => {
    // 10:00 em Tóquio de terça = segunda 22:00 BRT
    const now = new Date("2025-11-25T10:00:00+09:00");
    const tokyo: Horario[] = [{ dias: [2], abre: "09:00", fecha: "17:00" }];
    expect(getStatusHorario(now, { horarios: tokyo, timeZone: "Asia/Tokyo" }).estado).toBe(
      "aberto",
    );
    expect(getStatusHorario(now, { horarios: tokyo }).estado).toBe("fechado");
  });
});

describe("isOpenNow", () => {
  it("true aberto · false fechado · null indefinido", () => {
    expect(isOpenNow(brt(SEG, "10:00"))).toBe(true);
    expect(isOpenNow(brt(SEG, "21:00"))).toBe(false);
    expect(isOpenNow(brt(DOM, "10:00"))).toBe(false);
    expect(isOpenNow(brt(SAB, "09:00"))).toBeNull();
  });
});

describe("formatHora", () => {
  it.each([
    ["20:00", "20h"],
    ["07:30", "7h30"],
    ["07:00", "7h"],
    ["12:05", "12h05"],
  ])("%s ⇒ %s", (entrada, saida) => {
    expect(formatHora(entrada)).toBe(saida);
  });
});
