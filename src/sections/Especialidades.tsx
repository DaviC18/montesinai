import { CTAButton } from "@/components/base/CTAButton";
import { Container } from "@/components/base/Container";
import { Heading } from "@/components/base/Heading";
import { Section } from "@/components/base/Section";
import { clinica, type Medico } from "@/data/clinica";
import { confirmados, preencher } from "@/lib/conteudo";
import { SECTION_IDS } from "@/lib/sections";

const textos = clinica.ui.especialidades;

export default function Especialidades() {
  const especialidades = confirmados(clinica.especialidades);

  return (
    <Section id={SECTION_IDS.especialidades} tone="muted" aria-labelledby="especialidades-titulo">
      <Container>
        <div className="max-w-texto">
          <Heading level={2} id="especialidades-titulo" className="text-primary">
            {textos.titulo}
          </Heading>
          <p className="mt-4 text-lg text-pretty text-muted-foreground">{textos.intro}</p>
        </div>

        <ul className="mt-10 grid border-t border-input/40 md:grid-cols-2 md:gap-x-12">
          {especialidades.map((especialidade) => {
            const medicos = confirmados<Medico>(especialidade.medicos);
            return (
              <li
                key={especialidade.id}
                className="flex flex-col gap-4 border-b border-input/40 py-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <Heading level={3} className="text-foreground">
                    {especialidade.nome}
                  </Heading>
                  <p className="mt-1 text-base text-pretty text-muted-foreground">
                    {especialidade.descricao}
                  </p>
                  {medicos.length > 0 ? (
                    <p className="mt-2 text-base font-medium text-foreground">
                      {medicos.map((m) => (m.crm ? `${m.nome} · ${m.crm}` : m.nome)).join(", ")}
                    </p>
                  ) : null}
                </div>
                <CTAButton
                  contexto={{ tipo: "especialidade", especialidade: especialidade.nome }}
                  variant="secondary"
                  aria-label={preencher(textos.agendarRotulo, {
                    especialidade: especialidade.nome,
                  })}
                  className="shrink-0 self-start sm:self-auto"
                >
                  {textos.agendar}
                </CTAButton>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <p className="text-lg text-foreground">{textos.naoEncontrou}</p>
          <CTAButton contexto={{ tipo: "duvidas" }} variant="secondary" className="self-start">
            {textos.perguntar}
          </CTAButton>
        </div>
      </Container>
    </Section>
  );
}
