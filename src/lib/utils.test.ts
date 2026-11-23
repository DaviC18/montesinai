import { cn } from "@/lib/utils";

describe("cn", () => {
  it("reconhece tamanhos de texto do tema (não confunde com cor)", () => {
    expect(cn("text-h2", "text-primary")).toBe("text-h2 text-primary");
    expect(cn("text-h2", "text-base")).toBe("text-base");
    expect(cn("text-sm", "text-h4")).toBe("text-h4");
  });

  it("resolve conflitos com os demais tokens do tema", () => {
    expect(cn("max-w-content", "max-w-texto")).toBe("max-w-texto");
    expect(cn("tracking-tight", "tracking-display")).toBe("tracking-display");
    expect(cn("shadow-sm", "shadow-soft")).toBe("shadow-soft");
    expect(cn("px-2.5", "px-gutter")).toBe("px-gutter");
    expect(cn("py-4", "py-section")).toBe("py-section");
    expect(cn("scroll-mt-4", "scroll-mt-header")).toBe("scroll-mt-header");
  });
});
