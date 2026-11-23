import { render, screen } from "@testing-library/react";
import { Section } from "@/components/base/Section";

describe("Section", () => {
  it("renderiza <section> com id, aria-labelledby e offset de âncora", () => {
    render(
      <Section id="faq" aria-labelledby="faq-titulo" className="extra">
        <h2 id="faq-titulo">Título</h2>
      </Section>,
    );
    const el = screen.getByRole("region", { name: "Título" });
    expect(el.tagName).toBe("SECTION");
    expect(el).toHaveAttribute("id", "faq");
    expect(el).toHaveAttribute("aria-labelledby", "faq-titulo");
    expect(el).toHaveClass("scroll-mt-header", "py-section", "bg-background", "extra");
  });

  it.each([
    ["muted", ["bg-muted"]],
    ["inverse", ["bg-inverse", "text-inverse-foreground"]],
  ] as const)('tone="%s"', (tone, classes) => {
    const { container } = render(<Section id="x" tone={tone} />);
    expect(container.querySelector("section")).toHaveClass(...classes);
  });
});
