import { Container } from "@/components/base/Container";
import { Heading } from "@/components/base/Heading";
import { Section } from "@/components/base/Section";
import { clinica } from "@/data/clinica";
import { SECTION_IDS } from "@/lib/sections";

export default function Diferenciais() {
  return (
    <Section id={SECTION_IDS.diferenciais} aria-labelledby="diferenciais-titulo">
      <Container className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <Heading level={2} id="diferenciais-titulo" className="text-primary lg:col-span-4">
          {clinica.ui.diferenciais.titulo}
        </Heading>
        <dl className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
          {clinica.diferenciais.map((item) => (
            <div key={item.titulo} className="border-t border-input/40 py-6">
              <dt className="flex items-center gap-3 font-display text-h3 text-foreground">
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-agua" />
                {item.titulo}
              </dt>
              <dd className="mt-2 pl-5 text-base text-pretty text-muted-foreground">
                {item.texto}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
