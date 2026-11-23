import { CTAButton } from "@/components/base/CTAButton";
import { Container } from "@/components/base/Container";
import { Heading } from "@/components/base/Heading";
import { Section } from "@/components/base/Section";
import { clinica } from "@/data/clinica";
import { SECTION_IDS } from "@/lib/sections";

const textos = clinica.ui.ctaFinal;

export default function CTAFinal() {
  return (
    <Section id={SECTION_IDS.contato} tone="inverse" aria-labelledby="contato-titulo">
      <Container className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div className="max-w-texto">
          <span aria-hidden="true" className="block h-0.5 w-12 rounded-full bg-agua" />
          <Heading level={2} id="contato-titulo" className="mt-6">
            {textos.titulo}
          </Heading>
          <p className="mt-4 text-lg text-pretty text-inverse-muted">{textos.texto}</p>
        </div>
        <div className="flex flex-col items-start gap-4 lg:items-end">
          <CTAButton contexto={{ tipo: "padrao" }} variant="inverse" size="lg">
            {textos.cta}
          </CTAButton>
          <p className="text-base text-inverse-muted">
            {textos.ligar}{" "}
            <a
              href={`tel:${clinica.contato.telefoneE164}`}
              className="font-medium text-inverse-foreground underline decoration-agua decoration-2 underline-offset-4 focus-visible:outline-inverse-ring"
            >
              {clinica.contato.telefone}
            </a>
          </p>
        </div>
      </Container>
    </Section>
  );
}
