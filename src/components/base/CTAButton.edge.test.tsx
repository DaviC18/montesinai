import { render, screen } from "@testing-library/react";
import { CTAButton } from "@/components/base/CTAButton";

// Casos de borda adicionados pelo testador (Fase 1).
describe("CTAButton — bordas", () => {
  it("href/target/rel não podem ser sobrescritos por props (regra 7)", () => {
    const props = { href: "https://exemplo.com", target: "_self", rel: "" } as Record<
      string,
      string
    >;
    render(
      <CTAButton contexto={{ tipo: "padrao" }} {...props}>
        X
      </CTAButton>,
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("repassa aria-label e className extra; expõe data-variant", () => {
    render(
      <CTAButton contexto={{ tipo: "exames" }} aria-label="Rótulo acessível" className="w-full">
        X
      </CTAButton>,
    );
    const link = screen.getByRole("link", { name: "Rótulo acessível" });
    expect(link).toHaveClass("w-full");
    expect(link).toHaveAttribute("data-variant", "primary");
  });
});
