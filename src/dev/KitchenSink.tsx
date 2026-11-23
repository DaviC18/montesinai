// Página de referência visual — SÓ em desenvolvimento (ADR-003).
// URL: http://localhost:5173/?kitchen-sink · Rótulos aqui são de dev; textos da clínica vêm de clinica.ts.
import type { ReactNode } from "react";
import { Container } from "@/components/base/Container";
import { CTAButton } from "@/components/base/CTAButton";
import { Heading } from "@/components/base/Heading";
import { HorarioBadge } from "@/components/base/HorarioBadge";
import { Section } from "@/components/base/Section";
import { clinica } from "@/data/clinica";
import { getStatusHorario } from "@/lib/horario";

// --- Contraste (WCAG 2.1) calculado a partir dos hex de docs/ARCHITECTURE.md ---
function luminancia(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contraste(a: string, b: string): number {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x) as [number, number];
  return (l1 + 0.05) / (l2 + 0.05);
}

const BG = "#f7f9f8";
const cores: { token: string; hex: string; sobre?: string }[] = [
  { token: "--background", hex: "#f7f9f8" },
  { token: "--foreground", hex: "#12343a", sobre: BG },
  { token: "--card", hex: "#ffffff" },
  { token: "--primary", hex: "#06525c", sobre: BG },
  { token: "--primary-hover", hex: "#044650", sobre: BG },
  { token: "--secondary", hex: "#e1f2ee" },
  { token: "--accent", hex: "#cdeee6" },
  { token: "--agua", hex: "#7fd1c1", sobre: "#06525c" },
  { token: "--muted", hex: "#ebf0ee" },
  { token: "--muted-foreground", hex: "#3f5f63", sobre: BG },
  { token: "--border", hex: "#d3dfdc" },
  { token: "--input", hex: "#6b8885", sobre: BG },
  { token: "--ring", hex: "#0a7c72", sobre: BG },
  { token: "--destructive", hex: "#b42318", sobre: BG },
  { token: "--inverse", hex: "#06525c" },
  { token: "--inverse-muted", hex: "#c1d0d2", sobre: "#06525c" },
  { token: "--status-open", hex: "#17653d", sobre: "#e2f4ea" },
  { token: "--status-open-bg", hex: "#e2f4ea" },
  { token: "--status-open-dot", hex: "#1f8a52", sobre: "#e2f4ea" },
  { token: "--status-closed", hex: "#7a3d0a", sobre: "#f9ecdd" },
  { token: "--status-closed-bg", hex: "#f9ecdd" },
];

const espacos = [
  { nome: "gap-4", classe: "w-4" },
  { nome: "gap-6", classe: "w-6" },
  { nome: "gap-8", classe: "w-8" },
  { nome: "gap-12", classe: "w-12" },
  { nome: "--spacing-gutter", classe: "w-gutter" },
  { nome: "--spacing-header", classe: "w-header" },
  { nome: "--spacing-section", classe: "w-section" },
];

const raios = [
  "rounded-sm",
  "rounded-md",
  "rounded-lg",
  "rounded-xl",
  "rounded-2xl",
  "rounded-full",
];

// `now` fixo (instantes absolutos em BRT) para o selo — 24/11/2025 = segunda, 29/11/2025 = sábado.
const exemplosSelo = [
  { rotulo: "Segunda 10:00 BRT", now: new Date("2025-11-24T10:00:00-03:00") },
  { rotulo: "Segunda 21:00 BRT", now: new Date("2025-11-24T21:00:00-03:00") },
  { rotulo: "Domingo 10:00 BRT", now: new Date("2025-11-30T10:00:00-03:00") },
  { rotulo: "Sábado 09:00 BRT (faixa pendente)", now: new Date("2025-11-29T09:00:00-03:00") },
];

function Bloco({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6 border-t border-border pt-8">
      <h2 className="font-sans text-lg font-semibold tracking-normal text-muted-foreground uppercase">
        {titulo}
      </h2>
      {children}
    </div>
  );
}

export default function KitchenSink() {
  return (
    <main>
      <Section id="ks-topo" aria-labelledby="ks-titulo">
        <Container className="flex flex-col gap-12">
          <header className="flex flex-col gap-2">
            <p className="text-muted-foreground">Kitchen sink · só em DEV · {clinica.nome}</p>
            <Heading level={1} id="ks-titulo">
              Design system — Fase 1
            </Heading>
          </header>

          <Bloco titulo="Paleta (contraste sobre o fundo indicado)">
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cores.map(({ token, hex, sobre }) => (
                <li key={token} className="flex items-center gap-4">
                  <span
                    className="size-14 shrink-0 rounded-lg border border-input shadow-soft"
                    style={{ background: `var(${token})` }}
                  />
                  <span className="flex min-w-0 flex-col">
                    <code className="truncate font-mono">{token}</code>
                    <span className="text-muted-foreground">
                      {hex}
                      {sobre ? ` · ${contraste(hex, sobre).toFixed(2)}:1 sobre ${sobre}` : ""}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Bloco>

          <Bloco titulo="Tipografia">
            <div className="flex flex-col gap-4">
              <Heading level={2} size="h1">
                h1 Source Serif — atenção, saúde, coração
              </Heading>
              <Heading level={2}>h2 Source Serif — ção, á, ê, õ</Heading>
              <Heading level={3}>h3 Source Serif — ção, á, ê, õ</Heading>
              <Heading level={4}>h4 Source Serif 600 — ção, á, ê, õ</Heading>
              <p className="text-lg">
                text-lg Libre Franklin 20,25px — Informação, avaliação, exames: ção, á, ê, õ.
              </p>
              <p className="max-w-texto text-pretty">
                text-base Libre Franklin 18px (base). {clinica.descricao}
              </p>
              <p className="font-medium">Peso 500 — rótulos e botões · ção, á, ê, õ</p>
              <p className="font-semibold">Peso 600 — ênfase rara · ção, á, ê, õ</p>
              <p className="text-muted-foreground">muted-foreground — texto secundário</p>
            </div>
          </Bloco>

          <Bloco titulo="Espaçamentos">
            <ul className="flex flex-col gap-3">
              {espacos.map(({ nome, classe }) => (
                <li key={nome} className="flex items-center gap-4">
                  <span className={`h-4 shrink-0 rounded-sm bg-agua ${classe}`} />
                  <code className="font-mono">{nome}</code>
                </li>
              ))}
            </ul>
          </Bloco>

          <Bloco titulo="Raios e sombras">
            <div className="flex flex-wrap gap-6">
              {raios.map((r) => (
                <div
                  key={r}
                  className={`flex size-24 items-end bg-secondary p-2 text-secondary-foreground ${r}`}
                >
                  <code className="font-mono">{r.replace("rounded-", "")}</code>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="w-56 rounded-2xl bg-card p-6 shadow-soft">shadow-soft · card</div>
              <div className="w-56 rounded-2xl bg-card p-6 shadow-raised">
                shadow-raised · hover
              </div>
            </div>
          </Bloco>

          <Bloco titulo="CTAButton">
            <div className="flex flex-wrap items-center gap-4">
              <CTAButton contexto={{ tipo: "padrao" }}>Primário (demo)</CTAButton>
              <CTAButton contexto={{ tipo: "exames" }} variant="secondary">
                Secundário (demo)
              </CTAButton>
              <CTAButton contexto={{ tipo: "padrao" }} size="lg">
                Primário lg (demo)
              </CTAButton>
              <CTAButton contexto={{ tipo: "duvidas" }} icon={false}>
                Sem ícone (demo)
              </CTAButton>
              <CTAButton
                contexto={{ tipo: "padrao" }}
                className="ring-3 ring-ring ring-offset-2 ring-offset-background"
              >
                Foco simulado (demo)
              </CTAButton>
            </div>
          </Bloco>

          <Bloco titulo="Selo de horário (now fixo)">
            <ul className="flex flex-col gap-4">
              {exemplosSelo.map(({ rotulo, now }) => {
                const status = getStatusHorario(now);
                return (
                  <li key={rotulo} className="flex flex-wrap items-center gap-4">
                    <span className="w-full text-muted-foreground sm:w-80">{rotulo}</span>
                    <HorarioBadge status={status} rotulos={clinica.ui.selo} />
                    <HorarioBadge status={status} rotulos={clinica.ui.selo} variante="ate" />
                    {status.estado === "indefinido" ? (
                      <code className="font-mono text-muted-foreground">
                        estado "indefinido" ⇒ não renderiza
                      </code>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </Bloco>
        </Container>
      </Section>

      <Section id="ks-muted" tone="muted" aria-labelledby="ks-muted-titulo">
        <Container size="texto" className="flex flex-col gap-4">
          <Heading level={2} id="ks-muted-titulo">
            Section tone="muted" + Container size="texto"
          </Heading>
          <p>Faixa alternada. Conteúdo limitado a max-w-texto (≈ 65 caracteres por linha).</p>
        </Container>
      </Section>

      <Section id="ks-inverse" tone="inverse" aria-labelledby="ks-inverse-titulo">
        <Container className="flex flex-col items-start gap-6">
          <Heading level={2} id="ks-inverse-titulo">
            Section tone="inverse"
          </Heading>
          <p className="text-inverse-muted">inverse-muted — texto secundário na faixa escura.</p>
          <p className="text-agua">agua — destaque sobre a faixa escura.</p>
          <div className="flex flex-wrap gap-4">
            <CTAButton contexto={{ tipo: "padrao" }} variant="inverse">
              Inverse (demo)
            </CTAButton>
            <CTAButton
              contexto={{ tipo: "padrao" }}
              variant="inverse"
              className="ring-3 ring-inverse-ring ring-offset-2 ring-offset-inverse"
            >
              Inverse foco simulado (demo)
            </CTAButton>
          </div>
        </Container>
      </Section>
    </main>
  );
}
