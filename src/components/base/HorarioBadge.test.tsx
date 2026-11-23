import { render, screen } from "@testing-library/react";
import { HorarioBadge } from "@/components/base/HorarioBadge";

const rotulos = { aberto: "Aberto X", abertoAte: "Aberto até {hora}", fechado: "Fechado X" };

describe("HorarioBadge", () => {
  it('estado "indefinido" não renderiza nada', () => {
    const { container } = render(
      <HorarioBadge status={{ estado: "indefinido" }} rotulos={rotulos} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("status null (antes do mount) não renderiza nada", () => {
    const { container } = render(<HorarioBadge status={null} rotulos={rotulos} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('aberto, variante "agora"', () => {
    render(<HorarioBadge status={{ estado: "aberto", fecha: "20:00" }} rotulos={rotulos} />);
    const el = screen.getByText("Aberto X");
    expect(el).toHaveAttribute("data-estado", "aberto");
    expect(el).toHaveClass("bg-status-open-bg", "text-status-open");
  });

  it('aberto, variante "ate" formata a hora ("20h")', () => {
    render(
      <HorarioBadge
        status={{ estado: "aberto", fecha: "20:00" }}
        rotulos={rotulos}
        variante="ate"
      />,
    );
    expect(screen.getByText("Aberto até 20h")).toBeInTheDocument();
  });

  it("fechado mostra o texto (cor não é o único sinal) e ponto decorativo", () => {
    const { container } = render(<HorarioBadge status={{ estado: "fechado" }} rotulos={rotulos} />);
    const el = screen.getByText("Fechado X");
    expect(el).toHaveClass("bg-status-closed-bg", "text-status-closed");
    expect(container.querySelector("[aria-hidden='true']")).toHaveClass("bg-status-closed");
  });
});
