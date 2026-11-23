import type { RefObject } from "react";
import {
  DURATION,
  EASE,
  gsap,
  MOTION_CONDITIONS,
  STAGGER,
  useGSAP,
  type MotionConditions,
} from "@/lib/gsap";

/**
 * Reveals discretos ao rolar, dentro de `scope` (ARCHITECTURE § Padrões GSAP).
 * - `data-anim="reveal"`: o próprio elemento sobe 16px e aparece.
 * - `data-anim="stagger"`: os filhos diretos entram em sequência.
 * Sem JS ou com reduced motion, tudo fica visível (nada escondido no CSS).
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const raiz = scope.current;
      if (!raiz) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_CONDITIONS, (ctx) => {
        const { reduce } = ctx.conditions as MotionConditions;
        if (reduce) return;

        raiz.querySelectorAll<HTMLElement>("[data-anim='reveal']").forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 16,
            duration: DURATION.base,
            ease: EASE.out,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });

        raiz.querySelectorAll<HTMLElement>("[data-anim='stagger']").forEach((grupo) => {
          gsap.from(grupo.children, {
            autoAlpha: 0,
            y: 20,
            duration: DURATION.base,
            ease: EASE.out,
            stagger: STAGGER,
            scrollTrigger: { trigger: grupo, start: "top 85%", once: true },
          });
        });
      });
    },
    { scope },
  );
}
