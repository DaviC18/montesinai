import { useRef } from "react";
import { FlaskConical } from "lucide-react";
import { CTAButton } from "@/components/base/CTAButton";
import { Container } from "@/components/base/Container";
import { Heading } from "@/components/base/Heading";
import { Section } from "@/components/base/Section";
import { clinica } from "@/data/clinica";
import { useReveal } from "@/hooks/useReveal";
import { SECTION_IDS } from "@/lib/sections";

const textos = clinica.ui.exames;

export default function Exames() {
  const { exames } = clinica;
  const scope = useRef<HTMLElement>(null);
  useReveal(scope);
  const mostrarLista = !exames.pendente && exames.itens.length > 0;

  return (
    <Section ref={scope} id={SECTION_IDS.exames} aria-labelledby="exames-titulo">
      <Container data-anim="stagger" className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <span
            aria-hidden="true"
            className="inline-flex size-14 items-center justify-center rounded-full bg-secondary text-primary"
          >
            <FlaskConical className="size-7" />
          </span>
          <Heading level={2} id="exames-titulo" className="mt-5 text-primary">
            {textos.titulo}
          </Heading>
        </div>
        <div className="lg:col-span-7 lg:pt-2">
          <p className="max-w-texto text-lg text-pretty text-foreground">{textos.texto}</p>
          {mostrarLista ? (
            <ul className="mt-6 grid gap-x-8 border-t border-border sm:grid-cols-2">
              {exames.itens.map((item) => (
                <li key={item} className="border-b border-border py-3 text-base">
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
          <CTAButton contexto={{ tipo: "exames" }} size="lg" className="mt-8">
            {textos.cta}
          </CTAButton>
        </div>
      </Container>
    </Section>
  );
}
