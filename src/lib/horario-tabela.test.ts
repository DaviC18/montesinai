import { getTabelaHorario } from "@/lib/horario-tabela";

describe("getTabelaHorario", () => {
  it("monta as linhas a partir de clinica.horarios", () => {
    expect(getTabelaHorario()).toEqual([
      { dias: "Segunda a Sexta", horas: "7h às 20h", pendente: false },
      { dias: "Sábado", horas: "7h às 12h", pendente: true },
      { dias: "Domingo", horas: null, pendente: false },
    ]);
  });

  it("lista dias não consecutivos separados por vírgula", () => {
    const linhas = getTabelaHorario([{ dias: [1, 3], abre: "08:00", fecha: "12:30" }]);
    expect(linhas[0]).toEqual({ dias: "Segunda, Quarta", horas: "8h às 12h30", pendente: false });
  });
});
