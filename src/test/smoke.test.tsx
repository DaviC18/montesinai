import { render, screen, within } from "@testing-library/react";
import App from "@/App";
import { clinica } from "@/data/clinica";
import { SECTION_IDS } from "@/lib/sections";

describe("App", () => {
  it("renderiza o slogan como h1 único", () => {
    render(<App />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: clinica.slogan })).toBeInTheDocument();
  });

  it("tem todas as âncoras da SPEC §4", () => {
    const { container } = render(<App />);
    for (const id of Object.values(SECTION_IDS)) {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    }
  });

  it("todo link de agendamento vai para wa.me", () => {
    render(<App />);
    const whatsapp = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href")?.includes("wa.me"));
    expect(whatsapp.length).toBeGreaterThan(5);
    for (const a of whatsapp) {
      expect(a.getAttribute("href")).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    }
  });

  it("não exibe dados pendentes como fato", () => {
    render(<App />);
    for (const c of clinica.convenios.itens) expect(screen.queryByText(c.nome)).toBeNull();
    for (const e of clinica.especialidades)
      for (const m of e.medicos) expect(screen.queryByText(new RegExp(m.nome))).toBeNull();
    for (const f of clinica.faq.filter((f) => f.pendente))
      expect(screen.queryByText(f.pergunta)).toBeNull();
  });

  it("marca o sábado como a confirmar na tabela de horário", () => {
    render(<App />);
    const tabela = screen.getByRole("table");
    const sabado = within(tabela).getByRole("rowheader", { name: "Sábado" }).closest("tr");
    expect(sabado).toHaveTextContent(clinica.ui.localizacao.aConfirmar);
  });
});
