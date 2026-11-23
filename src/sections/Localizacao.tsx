import { MapPin, Navigation, Phone } from "lucide-react";
import { Container } from "@/components/base/Container";
import { Heading } from "@/components/base/Heading";
import { HorarioBadge } from "@/components/base/HorarioBadge";
import { Section } from "@/components/base/Section";
import { buttonVariants } from "@/components/ui/button";
import { clinica } from "@/data/clinica";
import { useStatusHorario } from "@/hooks/useStatusHorario";
import { getTabelaHorario } from "@/lib/horario-tabela";
import { SECTION_IDS } from "@/lib/sections";
import { cn } from "@/lib/utils";

const textos = clinica.ui.localizacao;
const { endereco, contato } = clinica;

const botao =
  "h-auto min-h-11 gap-2 rounded-lg px-5 py-2 text-base font-medium [&_svg:not([class*='size-'])]:size-5 focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none";

export default function Localizacao() {
  const status = useStatusHorario();
  const linhas = getTabelaHorario();

  return (
    <Section id={SECTION_IDS.localizacao} aria-labelledby="localizacao-titulo">
      <Container>
        <Heading level={2} id="localizacao-titulo" className="text-primary">
          {textos.titulo}
        </Heading>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-10 lg:col-span-5">
            <div>
              <Heading level={3} size="h4" className="flex items-center gap-2 text-foreground">
                <MapPin aria-hidden="true" className="size-5 text-primary" />
                {textos.enderecoTitulo}
              </Heading>
              <address className="mt-3 text-lg not-italic">
                {endereco.logradouro}
                <br />
                {endereco.bairro} · {endereco.cidade}/{endereco.uf}
                <br />
                <span className="text-muted-foreground">CEP {endereco.cep}</span>
              </address>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={endereco.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    botao,
                    "hover:bg-primary-hover",
                  )}
                >
                  <Navigation aria-hidden="true" />
                  {textos.comoChegar}
                </a>
                <a
                  href={`tel:${contato.telefoneE164}`}
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    botao,
                    "border-primary/20 hover:bg-accent",
                  )}
                >
                  <Phone aria-hidden="true" />
                  {textos.ligar} {contato.telefone}
                </a>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Heading level={3} size="h4" className="text-foreground">
                  {textos.horarioTitulo}
                </Heading>
                <HorarioBadge status={status} rotulos={clinica.ui.selo} />
              </div>
              <table className="mt-3 w-full text-left text-lg">
                <caption className="sr-only">{textos.horarioTitulo}</caption>
                <tbody>
                  {linhas.map((linha) => (
                    <tr key={linha.dias} className="border-b border-border last:border-b-0">
                      <th scope="row" className="py-3 pr-4 font-normal">
                        {linha.dias}
                      </th>
                      <td className="py-3 text-right font-medium tabular-nums">
                        {linha.horas ?? textos.fechado}
                        {linha.pendente ? (
                          <span className="block text-base font-normal text-muted-foreground">
                            {textos.aConfirmar}
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-7">
            <iframe
              title={textos.mapaTitulo}
              src={endereco.mapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full rounded-2xl border border-border bg-muted shadow-soft lg:aspect-auto lg:h-full lg:min-h-96"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
