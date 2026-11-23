import {
  ArrowRight,
  CreditCard,
  FlaskConical,
  MapPin,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { CTAButton } from "@/components/base/CTAButton";
import { Container } from "@/components/base/Container";
import { Heading } from "@/components/base/Heading";
import { HorarioBadge } from "@/components/base/HorarioBadge";
import { clinica } from "@/data/clinica";
import { useStatusHorario } from "@/hooks/useStatusHorario";
import { hrefSecao, SECTION_IDS } from "@/lib/sections";

const { hero } = clinica.ui;

const icones: Record<(typeof hero.respostas)[number]["id"], LucideIcon> = {
  consulta: Stethoscope,
  exame: FlaskConical,
  convenio: CreditCard,
  chegar: MapPin,
};

export default function Hero() {
  const status = useStatusHorario();

  return (
    <section
      id={SECTION_IDS.inicio}
      aria-labelledby="hero-titulo"
      className="scroll-mt-header pt-8 pb-section sm:pt-12 lg:pt-16"
    >
      <Container className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
        <div className="lg:col-span-7 lg:pt-6">
          {/* Linha própria com altura fixa: o selo aparece depois do mount sem deslocar nada (ADR-007). */}
          <div className="flex min-h-9 items-center">
            <HorarioBadge status={status} rotulos={clinica.ui.selo} variante="ate" />
          </div>
          <Heading level={1} id="hero-titulo" className="mt-5 text-primary">
            {clinica.slogan}
          </Heading>
          <p className="mt-5 max-w-texto text-lg text-pretty text-muted-foreground">
            {hero.subtitulo}
          </p>
          <div className="mt-8 hidden lg:block">
            <CTAButton contexto={{ tipo: "padrao" }} size="lg">
              {hero.cta}
            </CTAButton>
          </div>
        </div>

        <nav aria-labelledby="hero-pergunta" className="lg:col-span-5">
          <Heading
            level={2}
            size="h3"
            id="hero-pergunta"
            className="flex items-center gap-3 text-foreground"
          >
            <span aria-hidden="true" className="h-0.5 w-8 shrink-0 rounded-full bg-agua" />
            {hero.pergunta}
          </Heading>
          <ul className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-0 lg:rounded-2xl lg:border lg:border-border lg:bg-card lg:shadow-soft">
            {hero.respostas.map((resposta) => {
              const Icone = icones[resposta.id];
              return (
                <li key={resposta.id} className="lg:border-b lg:border-border lg:last:border-b-0">
                  <a
                    href={hrefSecao(resposta.alvo)}
                    className="group flex h-full min-h-32 flex-col justify-start gap-3 rounded-2xl border border-primary/20 bg-card p-4 shadow-soft transition-colors hover:border-primary/45 hover:bg-secondary motion-reduce:transition-none lg:min-h-0 lg:flex-row lg:items-center lg:rounded-none lg:border-0 lg:bg-transparent lg:px-6 lg:py-5 lg:shadow-none lg:group-first:rounded-t-2xl lg:hover:bg-secondary"
                  >
                    <span className="flex items-center justify-between gap-2 lg:order-none lg:gap-4">
                      <span className="inline-flex size-11 items-center justify-center rounded-full bg-secondary text-primary group-hover:bg-card">
                        <Icone aria-hidden="true" className="size-6" />
                      </span>
                      <ArrowRight aria-hidden="true" className="size-5 text-primary lg:hidden" />
                    </span>
                    <span className="flex flex-col lg:flex-1">
                      <span className="font-display text-h4 font-semibold text-primary">
                        {resposta.rotulo}
                      </span>
                      <span className="text-base text-muted-foreground">{resposta.detalhe}</span>
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="hidden size-5 text-primary lg:block"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
          <CTAButton contexto={{ tipo: "padrao" }} size="lg" className="mt-6 w-full lg:hidden">
            {hero.cta}
          </CTAButton>
        </nav>
      </Container>
    </section>
  );
}
