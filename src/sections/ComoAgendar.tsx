import { useRef } from "react";
import { CTAButton } from "@/components/base/CTAButton";
import { Container } from "@/components/base/Container";
import { Heading } from "@/components/base/Heading";
import { Section } from "@/components/base/Section";
import { clinica } from "@/data/clinica";
import { useReveal } from "@/hooks/useReveal";
import {
  DURATION,
  EASE,
  gsap,
  MOTION_CONDITIONS,
  STAGGER,
  useGSAP,
  type MotionConditions,
} from "@/lib/gsap";
import { SECTION_IDS } from "@/lib/sections";

const textos = clinica.ui.comoAgendar;

export default function ComoAgendar() {
  const scope = useRef<HTMLElement>(null);
  const lista = useRef<HTMLOListElement>(null);
  useReveal(scope);

  // Linha de progresso (scaleY com scrub) + passos em sequência (ARCHITECTURE regra 6).
  useGSAP(
    () => {
      const ol = lista.current;
      if (!ol) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_CONDITIONS, (ctx) => {
        const { reduce } = ctx.conditions as MotionConditions;
        if (reduce) return;
        gsap.fromTo(
          "[data-anim='linha']",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top",
            scrollTrigger: { trigger: ol, start: "top 70%", end: "bottom 55%", scrub: true },
          },
        );
        gsap.from("[data-anim='passo']", {
          autoAlpha: 0,
          y: 20,
          duration: DURATION.base,
          ease: EASE.out,
          stagger: STAGGER * 2,
          scrollTrigger: { trigger: ol, start: "top 80%", once: true },
        });
      });
    },
    { scope },
  );

  return (
    <Section
      ref={scope}
      id={SECTION_IDS.comoAgendar}
      tone="muted"
      aria-labelledby="como-agendar-titulo"
    >
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div data-anim="reveal" className="lg:col-span-5">
          <Heading level={2} id="como-agendar-titulo" className="text-primary">
            {textos.titulo}
          </Heading>
          <p className="mt-4 text-lg text-muted-foreground">{textos.intro}</p>
          <CTAButton contexto={{ tipo: "padrao" }} size="lg" className="mt-8 hidden lg:inline-flex">
            {textos.cta}
          </CTAButton>
        </div>

        {/* Trilho fixo em border; a linha verde (data-anim) cresce com o scroll. */}
        <ol ref={lista} className="relative lg:col-span-7">
          <span
            aria-hidden="true"
            className="absolute top-6 bottom-6 left-6 w-0.5 -translate-x-1/2 bg-input/30"
          />
          <span
            aria-hidden="true"
            data-anim="linha"
            className="absolute top-6 bottom-6 left-6 w-0.5 -translate-x-1/2 bg-agua"
          />
          {clinica.comoAgendar.map((etapa) => (
            <li key={etapa.passo} data-anim="passo" className="relative flex gap-5 pb-8 last:pb-0">
              <span
                aria-hidden="true"
                className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-primary font-display text-h4 text-primary-foreground tabular-nums"
              >
                {etapa.passo}
              </span>
              <div className="pt-2">
                <Heading level={3} className="text-foreground">
                  {etapa.titulo}
                </Heading>
                <p className="mt-1 text-base text-muted-foreground">{etapa.texto}</p>
              </div>
            </li>
          ))}
        </ol>

        <CTAButton contexto={{ tipo: "padrao" }} size="lg" className="w-full lg:hidden">
          {textos.cta}
        </CTAButton>
      </Container>
    </Section>
  );
}
