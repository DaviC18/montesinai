// ÚNICO ponto do projeto que importa "gsap" / "@gsap/react" (ARCHITECTURE § Padrões GSAP).
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP); // idempotente: registro no topo do módulo
gsap.defaults({ ease: "power2.out", duration: 0.6 });

export const MOTION_CONDITIONS = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 768px)",
  mobile: "(max-width: 767.98px)",
} as const;

export type MotionConditions = { [K in keyof typeof MOTION_CONDITIONS]: boolean };

export const DURATION = { fast: 0.3, base: 0.6, slow: 0.9 } as const; // segundos
export const EASE = { out: "power2.out", inOut: "power2.inOut", soft: "power1.out" } as const;
export const STAGGER = 0.08 as const;

export { gsap, ScrollTrigger, useGSAP };
