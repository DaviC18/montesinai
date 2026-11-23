import { render, screen } from "@testing-library/react";
import { Heading } from "@/components/base/Heading";

describe("Heading", () => {
  it.each([1, 2, 3, 4] as const)("level={%i} renderiza <h%i>", (level) => {
    render(<Heading level={level}>Título</Heading>);
    const el = screen.getByRole("heading", { level });
    expect(el.tagName).toBe(`H${level}`);
    expect(el).toHaveClass(`text-h${level}`, "font-display", "tracking-display");
  });

  it("level={2} com tamanho visual diferente", () => {
    render(
      <Heading level={2} size="h1">
        Grande
      </Heading>,
    );
    const el = screen.getByRole("heading", { level: 2 });
    expect(el).toHaveClass("text-h1", "font-normal");
    expect(el).not.toHaveClass("text-h2");
  });

  it("peso 600 vem do size h4, não do level", () => {
    render(
      <>
        <Heading level={4} size="h3">
          A
        </Heading>
        <Heading level={2} size="h4">
          B
        </Heading>
      </>,
    );
    expect(screen.getByRole("heading", { level: 4 })).toHaveClass("font-normal");
    expect(screen.getByRole("heading", { level: 2 })).toHaveClass("font-semibold");
  });

  it("className de cor não remove o tamanho", () => {
    render(
      <Heading level={2} className="text-primary">
        Cor
      </Heading>,
    );
    expect(screen.getByRole("heading")).toHaveClass("text-h2", "text-primary");
  });
});
