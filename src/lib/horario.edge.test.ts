import type { Horario } from "@/data/clinica";
import { getPartesNoFuso, getStatusHorario, isOpenNow } from "@/lib/horario";

// Casos de borda adicionados pelo testador (Fase 1).
describe("horario — bordas", () => {
  it("usa regras de fuso reais (sem offset fixo): horário de verão de Nova York", () => {
    // 09/03/2025 02:00 EST → 03:00 EDT. 07:30Z = 03:30 EDT (UTC-4), não 02:30 (UTC-5).
    expect(getPartesNoFuso(new Date("2025-03-09T07:30:00Z"), "America/New_York")).toEqual({
      dia: 0,
      minutos: 3 * 60 + 30,
    });
    // Um dia antes, ainda EST (UTC-5).
    expect(getPartesNoFuso(new Date("2025-03-08T07:30:00Z"), "America/New_York")).toEqual({
      dia: 6,
      minutos: 2 * 60 + 30,
    });
  });

  it("23:59 de segunda em BRT continua segunda (não vira terça)", () => {
    const now = new Date("2025-11-24T23:59:00-03:00");
    expect(getPartesNoFuso(now, "America/Sao_Paulo")).toEqual({ dia: 1, minutos: 23 * 60 + 59 });
  });

  it("lista vazia de horários ⇒ sempre fechado", () => {
    expect(getStatusHorario(new Date("2025-11-24T10:00:00-03:00"), { horarios: [] })).toEqual({
      estado: "fechado",
    });
  });

  it("pendente em um dia não afeta os outros dias", () => {
    const horarios: Horario[] = [
      { dias: [1], abre: "08:00", fecha: "18:00" },
      { dias: [6], abre: "08:00", fecha: "12:00", pendente: true },
    ];
    expect(isOpenNow(new Date("2025-11-24T09:00:00-03:00"), { horarios })).toBe(true);
    expect(isOpenNow(new Date("2025-11-29T09:00:00-03:00"), { horarios })).toBeNull();
  });

  it("pendente prevalece mesmo havendo faixa confirmada no mesmo dia", () => {
    const horarios: Horario[] = [
      { dias: [6], abre: "07:00", fecha: "12:00" },
      { dias: [6], abre: "14:00", fecha: "16:00", pendente: true },
    ];
    expect(getStatusHorario(new Date("2025-11-29T09:00:00-03:00"), { horarios })).toEqual({
      estado: "indefinido",
    });
  });

  it("default de now = relógio real (não lança)", () => {
    expect(() => getStatusHorario()).not.toThrow();
    expect([true, false, null]).toContain(isOpenNow());
  });
});
