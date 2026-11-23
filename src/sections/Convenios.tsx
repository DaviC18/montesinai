import { useRef } from "react";
import { CTAButton } from "@/components/base/CTAButton";
import { Container } from "@/components/base/Container";
import { Heading } from "@/components/base/Heading";
import { Section } from "@/components/base/Section";
import { clinica } from "@/data/clinica";
import { confirmados } from "@/lib/conteudo";
import { useReveal } from "@/hooks/useReveal";
import { SECTION_IDS } from "@/lib/sections";

const textos = clinica.ui.convenios;

export default function Convenios() {
  const planos = confirmados(clinica.convenios.itens);
  const { particular } = clinica.convenios;
  const scope = useRef<HTMLElement>(null);
  useReveal(scope);

  return (
    <Section ref={scope} id={SECTION_IDS.convenios} tone="muted" aria-labelledby="convenios-titulo">
      <Container>
        <Heading
          level={2}
          id="convenios-titulo"
          data-anim="reveal"
          className="max-w-texto text-primary"
        >
          {textos.titulo}
        </Heading>

        <div data-anim="stagger" className="mt-10 grid gap-10 md:grid-cols-2 md:gap-12">
          <div className="border-t-2 border-primary pt-6">
            <Heading level={3} className="text-foreground">
              {textos.planosTitulo}
            </Heading>
            {planos.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {planos.map((plano) => (
                  <li
                    key={plano.nome}
                    className="rounded-full border border-input/50 bg-card px-4 py-1.5 text-base font-medium"
                  >
                    {plano.nome}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 max-w-texto text-lg text-pretty text-foreground">
                {textos.planosPendente}
              </p>
            )}
            <CTAButton contexto={{ tipo: "duvidas" }} className="mt-6">
              {textos.cta}
            </CTAButton>
          </div>

          {particular.length > 0 ? (
            <div className="border-t-2 border-primary pt-6">
              <Heading level={3} className="text-foreground">
                {textos.particularTitulo}
              </Heading>
              <p className="mt-3 text-lg text-foreground">{textos.particularTexto}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {particular.map((forma) => (
                  <li
                    key={forma}
                    className="rounded-full bg-secondary px-4 py-1.5 text-base font-medium text-secondary-foreground"
                  >
                    {forma}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
