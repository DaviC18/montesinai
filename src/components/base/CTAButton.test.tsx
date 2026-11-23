import { render, screen } from "@testing-library/react";
import { CTAButton } from "@/components/base/CTAButton";
import { clinica } from "@/data/clinica";

const textoDe = (href: string | null) => new URL(href ?? "").searchParams.get("text");

describe("CTAButton", () => {
  it("gera link wa.me com mensagem padrão codificada, target e rel", () => {
    render(<CTAButton contexto={{ tipo: "padrao" }}>Rótulo de teste</CTAButton>);
    const link = screen.getByRole("link", { name: "Rótulo de teste" });
    const href = link.getAttribute("href");
    expect(href).toMatch(new RegExp(`^https://wa\\.me/${clinica.contato.whatsappE164}\\?text=`));
    expect(href).toContain(encodeURIComponent(clinica.whatsapp.mensagens.padrao));
    expect(textoDe(href)).toBe(clinica.whatsapp.mensagens.padrao);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("mensagem contextual de especialidade", () => {
    render(
      <CTAButton contexto={{ tipo: "especialidade", especialidade: "Cardiologia" }}>
        Agendar
      </CTAButton>,
    );
    const texto = textoDe(screen.getByRole("link").getAttribute("href"));
    expect(texto).toContain("Cardiologia");
    expect(texto).not.toContain("{especialidade}");
  });

  it("ícone decorativo opcional, área de toque mínima e variantes", () => {
    const { container, rerender } = render(
      <CTAButton contexto={{ tipo: "exames" }} variant="secondary">
        A
      </CTAButton>,
    );
    const link = screen.getByRole("link");
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(link).toHaveClass("min-h-11", "text-base", "bg-secondary");
    expect(link).not.toHaveClass("h-8", "text-sm");

    rerender(
      <CTAButton contexto={{ tipo: "duvidas" }} variant="inverse" size="lg" icon={false}>
        A
      </CTAButton>,
    );
    expect(container.querySelector("svg")).toBeNull();
    expect(screen.getByRole("link")).toHaveClass(
      "min-h-13",
      "bg-inverse-foreground",
      "text-primary",
    );
  });
});
