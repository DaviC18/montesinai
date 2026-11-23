import {
  DURATION,
  gsap,
  MOTION_CONDITIONS,
  ScrollTrigger,
  SplitText,
  STAGGER,
  useGSAP,
} from "@/lib/gsap";

describe("lib/gsap", () => {
  it("importa em jsdom e expõe gsap, ScrollTrigger e useGSAP", () => {
    expect(typeof gsap.to).toBe("function");
    expect(typeof ScrollTrigger.create).toBe("function");
    expect(typeof useGSAP).toBe("function");
  });

  it("registra o ScrollTrigger no gsap", () => {
    // `core.globals()` existe em runtime, mas não está nos tipos públicos do gsap.
    const core = gsap.core as unknown as { globals: () => Record<string, unknown> };
    expect(core.globals().ScrollTrigger).toBe(ScrollTrigger);
    expect(typeof SplitText.create).toBe("function");
  });

  it("expõe as condições padrão de matchMedia, incluindo reduced motion", () => {
    expect(MOTION_CONDITIONS).toEqual({
      motion: "(prefers-reduced-motion: no-preference)",
      reduce: "(prefers-reduced-motion: reduce)",
      desktop: "(min-width: 768px)",
      mobile: "(max-width: 767.98px)",
    });
  });

  it("aplica os defaults do projeto", () => {
    const defaults = gsap.defaults() as { ease?: unknown; duration?: number };
    expect(defaults.duration).toBe(0.6);
    expect(defaults.ease).toBe(gsap.parseEase("power2.out"));
    expect(DURATION.base).toBe(0.6);
    expect(STAGGER).toBe(0.08);
  });

  it("re-importar o módulo não quebra (registro idempotente)", async () => {
    const again = await import("@/lib/gsap");
    expect(again.gsap).toBe(gsap);
  });
});
