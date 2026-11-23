import { render, screen } from "@testing-library/react";
import { Container } from "@/components/base/Container";

describe("Container", () => {
  it("aplica largura máxima e padding lateral dos tokens", () => {
    render(<Container data-testid="c">conteúdo</Container>);
    const el = screen.getByTestId("c");
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("mx-auto", "w-full", "px-gutter", "max-w-content");
  });

  it('size="texto" troca para max-w-texto e aceita className', () => {
    render(
      <Container data-testid="c" size="texto" className="extra">
        x
      </Container>,
    );
    const el = screen.getByTestId("c");
    expect(el).toHaveClass("max-w-texto", "extra");
    expect(el).not.toHaveClass("max-w-content");
  });
});
