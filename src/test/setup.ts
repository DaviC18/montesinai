import "@testing-library/jest-dom/vitest";

// jsdom não implementa matchMedia; GSAP (ScrollTrigger / gsap.matchMedia) precisa dele.
// Stub: nenhuma media query casa (equivale a "sem preferência" em testes).
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
