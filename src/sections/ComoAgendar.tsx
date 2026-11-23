import { CTAButton } from "@/components/base/CTAButton";
import { Container } from "@/components/base/Container";
import { Heading } from "@/components/base/Heading";
import { Section } from "@/components/base/Section";
import { clinica } from "@/data/clinica";
import { SECTION_IDS } from "@/lib/sections";

const textos = clinica.ui.comoAgendar;

export default function ComoAgendar() {
  return (
    <Section id={SECTION_IDS.comoAgendar} tone="muted" aria-labelledby="como-agendar-titulo">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <Heading level={2} id="como-agendar-titulo" className="text-primary">
            {textos.titulo}
          </Heading>
          <p className="mt-4 text-lg text-muted-foreground">{textos.intro}</p>
          <CTAButton contexto={{ tipo: "padrao" }} size="lg" className="mt-8 hidden lg:inline-flex">
            {textos.cta}
          </CTAButton>
        </div>

        {/* A linha vertical (data-anim) recebe a linha de progresso com scrub na Fase 3. */}
        <ol className="relative lg:col-span-7">
          <span
            aria-hidden="true"
            data-anim="linha"
            className="absolute top-6 bottom-6 left-6 w-0.5 -translate-x-1/2 bg-agua"
          />
          {clinica.comoAgendar.map((etapa) => (
            <li key={etapa.passo} className="relative flex gap-5 pb-8 last:pb-0">
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
