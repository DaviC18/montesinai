import { CTAButton } from "@/components/base/CTAButton";
import { Container } from "@/components/base/Container";
import { Heading } from "@/components/base/Heading";
import { Section } from "@/components/base/Section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { clinica } from "@/data/clinica";
import { confirmados } from "@/lib/conteudo";
import { SECTION_IDS } from "@/lib/sections";

const textos = clinica.ui.faq;

export default function FAQ() {
  // Resposta vazia também não aparece (contrato de pendências).
  const itens = confirmados(clinica.faq).filter((item) => item.resposta.trim() !== "");

  return (
    <Section id={SECTION_IDS.faq} tone="muted" aria-labelledby="faq-titulo">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <Heading level={2} id="faq-titulo" className="text-primary">
            {textos.titulo}
          </Heading>
        </div>
        <div className="lg:col-span-8">
          {itens.length > 0 ? (
            <Accordion className="border-t border-input/40">
              {itens.map((item) => (
                <AccordionItem
                  key={item.pergunta}
                  value={item.pergunta}
                  className="border-b border-input/40 not-last:border-b"
                >
                  <AccordionTrigger className="font-display text-h4 font-semibold text-foreground hover:text-primary hover:no-underline">
                    {item.pergunta}
                  </AccordionTrigger>
                  <AccordionContent className="max-w-texto text-lg text-pretty text-muted-foreground">
                    <p>{item.resposta}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <p className="text-lg text-foreground">{textos.maisDuvidas}</p>
            <CTAButton contexto={{ tipo: "duvidas" }} variant="secondary" className="self-start">
              {textos.cta}
            </CTAButton>
          </div>
        </div>
      </Container>
    </Section>
  );
}
