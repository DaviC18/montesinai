# ARCHITECTURE

> Documento mantido pelo subagente **arquiteto**. Versão Fase 1 · 23/11/2026.
> Contrato técnico e visual. Mudou algo aqui? Registre um ADR na seção "Decisões".

## Estrutura

### Árvore alvo

```
src/
├── main.tsx                 # monta <App/> ou, só em DEV, o kitchen sink (ADR-003)
├── App.tsx                  # composição das seções (Fase 2). Sem lógica, sem texto.
├── index.css                # Tailwind v4 CSS-first: tokens (@theme inline + :root) e base layer
├── data/
│   └── clinica.ts           # ÚNICA fonte de conteúdo (fatos + textos + mensagens de WhatsApp)
├── lib/                     # funções puras e helpers sem JSX
│   ├── utils.ts             # cn() = createCn com tokens do tema (ADR-011)
│   ├── gsap.ts              # ÚNICO ponto que importa "gsap" / "@gsap/react"
│   ├── whatsapp.ts          # buildWhatsAppLink, getMensagemWhatsApp
│   └── horario.ts           # getStatusHorario, isOpenNow, formatHora, getPartesNoFuso
├── components/
│   ├── ui/                  # gerado pelo shadcn (base-nova). Não editar à mão além de ajuste de tokens.
│   ├── base/                # primitivos do projeto: Container, Section, Heading, CTAButton, HorarioBadge
│   └── vendor/              # React Bits / Magic UI copiados (Fase 3), já adaptados (ver § Terceiros)
├── sections/                # uma seção da SPEC §4 por arquivo (Fase 2): Header.tsx, Hero.tsx, ...
├── hooks/                   # hooks reutilizáveis (ex.: useNow) — só se 2+ consumidores
├── dev/
│   └── KitchenSink.tsx      # página de referência, só em DEV (ADR-003)
└── test/
    ├── setup.ts
    └── smoke.test.tsx
```

### Regras de localização

| O quê                            | Onde                          | Regra                                                         |
| -------------------------------- | ----------------------------- | ------------------------------------------------------------- |
| Fato/texto da clínica            | `src/data/clinica.ts`         | Nunca em componente (regra 1 do CLAUDE.md)                    |
| Função pura (sem React)          | `src/lib/*.ts`                | Teste ao lado: `src/lib/<nome>.test.ts`                       |
| Primitivo visual sem conteúdo    | `src/components/base/*.tsx`   | Recebe tudo por props. Teste ao lado `*.test.tsx`             |
| Componente shadcn                | `src/components/ui/*.tsx`     | Só via `npx shadcn@latest add`                                |
| Componente React Bits / Magic UI | `src/components/vendor/*.tsx` | Copiado, adaptado a tokens e lucide; sem animação de scroll   |
| Seção do site                    | `src/sections/<Nome>.tsx`     | Importa `clinica` direto; exporta `default function <Nome>()` |
| Página de dev                    | `src/dev/*.tsx`               | Nunca importada fora do ramo `import.meta.env.DEV`            |

### Convenções

- Arquivos de componente em `PascalCase.tsx`; libs em `camelCase.ts`. Um componente exportado por arquivo.
- Exports nomeados em `lib/` e `components/base/`; `export default` só em `sections/` e `dev/` (facilita `lazy()`).
- Imports sempre por alias `@/` (nunca `../../`).
- Identificadores de domínio em português (como `clinica.ts`): `horarios`, `especialidade`, `pendente`. Termos técnicos em inglês (`props`, `className`, `ref`).
- IDs de âncora (RF04): `inicio`, `especialidades`, `exames`, `convenios`, `diferenciais`, `como-agendar`, `localizacao`, `faq`, `contato`. Constante `SECTION_IDS` em `src/lib/sections.ts` (Fase 2), consumida pelo Header e pelas seções.

### Como componentes consomem `clinica.ts`

- **Seções (`src/sections/*`) importam `clinica` direto.** Não há prop drilling de conteúdo do `App`.
- **Primitivos (`src/components/base/*`) nunca importam `clinica`** (exceção: nenhuma). Recebem texto por props/children. Isso mantém o kitchen sink e os testes independentes do conteúdo.
- **Libs (`src/lib/whatsapp.ts`, `src/lib/horario.ts`) leem `clinica` só como valor padrão de parâmetro**, sempre sobrescrevível (testes injetam dados).

### Contrato para itens `pendente`

| Dado                                                                                | Regra de exibição                                                                                                                                                                                                |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Especialidade.pendente === true`                                                   | Não renderizar o card.                                                                                                                                                                                           |
| `Medico.pendente === true`                                                          | Não renderizar nome nem CRM. O card da especialidade aparece sem médico.                                                                                                                                         |
| `FAQItem.pendente === true`                                                         | Não renderizar o item. Se sobrar < 3 itens, a seção FAQ continua com o que houver (sem placeholder).                                                                                                             |
| `convenios.itens[i].pendente === true`                                              | Não renderizar o convênio. Se todos pendentes: a seção mostra só `particular` (se confirmado) + CTA "confirmar seu plano pelo WhatsApp" (texto em `clinica.ts`). Marquee só entra com ≥ 4 convênios confirmados. |
| `exames.pendente === true`                                                          | Não renderizar lista; seção mostra só o texto/CTA de exames (texto em `clinica.ts`).                                                                                                                             |
| `Horario.pendente === true`                                                         | Horário pode aparecer na tabela de Localização **com marcação** "a confirmar" (texto em `clinica.ts`); o selo de status fica OCULTO no dia inteiro (ADR-004). JSON-LD (Fase 4) omite faixas pendentes.           |
| Campo string com `// TODO` e valor vazio (`cnpj`, `responsavelTecnico`, `resposta`) | Não renderizar o rótulo nem o valor.                                                                                                                                                                             |
| Campo string com `// TODO` e valor preenchido (`whatsappE164`, `razaoSocial`)       | Usar normalmente (é o melhor dado disponível); a pendência fica no PLAN.                                                                                                                                         |

Filtro padrão: helper `confirmados<T extends { pendente?: boolean }>(itens: readonly T[]): T[]` em `src/lib/conteudo.ts` (Fase 2). Nenhuma seção filtra "na mão" com outra regra.

## Tipos

Tipos de conteúdo vivem em `src/data/clinica.ts`. Tipos de lib vivem no próprio arquivo da lib.

### Alterações em `src/data/clinica.ts` (dev implementa em T1.6/T1.7)

```ts
export interface Horario {
  dias: DiaSemana[];
  abre: string; // "HH:MM", 24h
  fecha: string; // "HH:MM", 24h, exclusivo (fecha "20:00" ⇒ 19:59 aberto, 20:00 fechado)
  /** true enquanto a clínica não confirmar esta faixa. Selo de status fica oculto (ADR-004). */
  pendente?: boolean;
}

horarios: [
  { dias: [1, 2, 3, 4, 5], abre: "07:00", fecha: "20:00" },
  { dias: [6], abre: "07:00", fecha: "12:00", pendente: true }, // TODO: confirmar sábado
] satisfies Horario[],
// Domingo (0) ausente = FECHADO (ADR-005). Não adicionar entrada para domingo.
```

Novo bloco (ADR-006), logo após `contato`:

```ts
export interface MensagensWhatsApp {
  /** CTA genérico (Header, Hero, FAB, CTA final, Como agendar). */
  padrao: string;
  /** Card de especialidade. Placeholder obrigatório: {especialidade}. */
  especialidade: string;
  /** Seção Exames & Laboratório. */
  exames: string;
  /** FAQ, Convênios ("confirmar meu plano"), Localização. */
  duvidas: string;
}

whatsapp: {
  mensagens: {
    padrao: "Olá! Vim pelo site da Clínica Monte Sinai e gostaria de agendar uma consulta.",
    especialidade: "Olá! Vim pelo site da Clínica Monte Sinai e gostaria de agendar uma consulta de {especialidade}.",
    exames: "Olá! Vim pelo site da Clínica Monte Sinai e gostaria de agendar um exame.",
    duvidas: "Olá! Vim pelo site da Clínica Monte Sinai e gostaria de tirar uma dúvida.",
  } satisfies MensagensWhatsApp,
},
```

Textos aprovados pelo usuário (decisão R5): neutros, sem promessa, sem preço, sem "urgência"/"emergência". Usar exatamente como acima.

Rótulos do selo (ADR-004). Textos vindos da SPEC (§4 Hero e RF03), não inventados:

```ts
ui: {
  selo: {
    aberto: "Aberto agora",
    abertoAte: "Aberto hoje até {hora}", // {hora} = formatHora(fecha) ⇒ "20h"
    fechado: "Fechado",
  },
},
```

### `src/lib/whatsapp.ts`

```ts
import type { MensagensWhatsApp } from "@/data/clinica";

export type ContextoWhatsApp =
  | { tipo: "padrao" }
  | { tipo: "especialidade"; especialidade: string } // Especialidade.nome
  | { tipo: "exames" }
  | { tipo: "duvidas" };

/** Resolve o texto a partir de clinica.whatsapp.mensagens; substitui {especialidade}. */
export function getMensagemWhatsApp(
  contexto: ContextoWhatsApp,
  mensagens?: MensagensWhatsApp, // default: clinica.whatsapp.mensagens
): string;

/**
 * Monta `https://wa.me/<numero>?text=<encodeURIComponent(mensagem)>`.
 * - `numero`: só dígitos, default clinica.contato.whatsappE164 (remover tudo que não for dígito).
 * - `mensagem` vazia/ausente ⇒ URL sem `?text=`.
 * Pura; sem efeitos; sem texto literal de clínica.
 */
export function buildWhatsAppLink(options?: { mensagem?: string; numero?: string }): string;
```

### `src/lib/horario.ts`

```ts
import type { DiaSemana, Horario } from "@/data/clinica";

export interface PartesNoFuso {
  dia: DiaSemana; // 0 = domingo, no fuso da clínica
  minutos: number; // minutos desde 00:00 no fuso da clínica
}

export type StatusHorario =
  | { estado: "aberto"; fecha: string } // "20:00" — faixa corrente
  | { estado: "fechado" }
  | { estado: "indefinido" }; // dia coberto por faixa pendente (ADR-004)

export interface OpcoesHorario {
  horarios?: readonly Horario[]; // default clinica.horarios
  timeZone?: string; // default clinica.timezone
}

/** Dia/minuto em `timeZone` via Intl.DateTimeFormat (weekday "short" + hour/minute, hourCycle "h23"). Nunca offset fixo. */
export function getPartesNoFuso(now: Date, timeZone: string): PartesNoFuso;

/**
 * Regra (ordem):
 * 1. Se algum Horario com `pendente: true` inclui o dia ⇒ "indefinido" (o dia inteiro, qualquer hora).
 * 2. Se existe faixa confirmada com abre <= minutos < fecha ⇒ "aberto".
 * 3. Senão ⇒ "fechado" (inclui domingo, ausente da lista).
 */
export function getStatusHorario(now?: Date, opcoes?: OpcoesHorario): StatusHorario; // now default new Date()

/** true = aberto, false = fechado, null = indefinido. Compare com `=== true`. */
export function isOpenNow(now?: Date, opcoes?: OpcoesHorario): boolean | null;

/** "20:00" ⇒ "20h"; "07:30" ⇒ "7h30". */
export function formatHora(hhmm: string): string;
```

`now` é sempre o primeiro parâmetro e injetável. Componentes chamam `getStatusHorario()` **depois do mount** (ADR-007) para não depender do relógio no primeiro render.

### Componentes base (`src/components/base/`)

```ts
// Container.tsx
export interface ContainerProps extends React.ComponentPropsWithoutRef<"div"> {
  size?: "content" | "texto"; // max-w-content (default) | max-w-texto
}
// classes: "mx-auto w-full px-gutter max-w-content"

// Section.tsx
export interface SectionProps extends React.ComponentPropsWithoutRef<"section"> {
  id: string; // âncora obrigatória (RF04)
  tone?: "default" | "muted" | "inverse"; // bg-background | bg-muted | bg-inverse text-inverse-foreground
  "aria-labelledby"?: string;
}
// classes: "scroll-mt-header py-section" + tone

// Heading.tsx
export interface HeadingProps extends React.ComponentPropsWithoutRef<"h2"> {
  level: 1 | 2 | 3 | 4; // tag semântica
  size?: "h1" | "h2" | "h3" | "h4"; // tamanho visual; default = `h${level}`
}
// classes: "font-display text-balance tracking-display font-normal text-{size}" (peso 400; 600 só em h4)

// CTAButton.tsx — reutiliza buttonVariants de @/components/ui/button (não reescreve)
export interface CTAButtonProps extends Omit<
  React.ComponentPropsWithoutRef<"a">,
  "href" | "target" | "rel"
> {
  contexto: ContextoWhatsApp; // mensagem via getMensagemWhatsApp
  variant?: "primary" | "secondary" | "inverse"; // default "primary"
  size?: "md" | "lg"; // md: min-h-11 (≥44px) · lg: min-h-13
  icon?: boolean; // ícone lucide MessageCircle à esquerda, aria-hidden; default true
  children: React.ReactNode; // rótulo vindo de clinica.ts
}
// href = buildWhatsAppLink({ mensagem: getMensagemWhatsApp(contexto) })
// target="_blank" rel="noopener noreferrer"; nome acessível inclui o rótulo.
// Variantes: primary = bg-primary text-primary-foreground hover:bg-primary-hover
//            secondary = bg-secondary text-secondary-foreground border border-primary/20 hover:bg-accent
//            inverse (em Section tone="inverse") = bg-inverse-foreground text-primary hover:bg-secondary
// Tipo: text-base font-medium (500), rounded-lg, px-5, gap-2. Foco: ring-3 ring-ring ring-offset-2 ring-offset-background
//       (inverse: ring-inverse-ring ring-offset-inverse).

// HorarioBadge.tsx — selo "Aberto agora / Fechado" (RF03), usado no Hero e Localização
export interface HorarioBadgeProps {
  status: StatusHorario | null; // null = ainda não montado ⇒ não renderiza
  rotulos: { aberto: string; abertoAte: string; fechado: string }; // clinica.ui.selo
  variante?: "agora" | "ate"; // "agora" ⇒ rotulos.aberto; "ate" ⇒ rotulos.abertoAte com {hora}
  className?: string;
}
// estado "indefinido" ⇒ return null (nada no DOM, sem espaço reservado que gere CLS).
// Visual: rounded-full px-3 py-1 text-base; ponto 0.5rem (status-open-dot / status-closed) aria-hidden.
// Cor nunca é o único sinal: o texto diz o estado.
```

## Design Tokens

Fonte: skill `design-taste-frontend`, page type **service** (clínica), trade `clinic`, dials VARIANCE 5 · MOTION 4 · DENSITY 3. Palette dealt: `teal-on-paper` (off-white + petróleo), estendida com verde-água da SPEC §3. Pairing dealt: `source-serif` (Source Serif 4 / Libre Franklin). Raio `soft`.

> **PROVISÓRIO (R1):** paleta é o fallback da SPEC §3 até o logo oficial. Toda cor é CSS var em `:root` de `src/index.css`; trocar lá não exige tocar em componentes. Recalcular a tabela de contraste na troca.

Tokens já aplicados em `src/index.css` pelo arquiteto (`:root` + `@theme inline`). T1.5 (dev) cuida da base layer.

### Paleta (shadcn vars → valor)

| Var CSS                  | Utility Tailwind              | Valor     | Papel                                                                                       |
| ------------------------ | ----------------------------- | --------- | ------------------------------------------------------------------------------------------- |
| `--background`           | `bg-background`               | `#f7f9f8` | off-white, fundo da página                                                                  |
| `--foreground`           | `text-foreground`             | `#12343a` | texto corrido (petróleo quase preto)                                                        |
| `--card` / `--popover`   | `bg-card`                     | `#ffffff` | cartões sobre off-white                                                                     |
| `--primary`              | `bg-primary` / `text-primary` | `#06525c` | azul-petróleo: CTA, links, títulos de destaque                                              |
| `--primary-hover`        | `bg-primary-hover`            | `#044650` | hover do CTA primário                                                                       |
| `--primary-foreground`   | `text-primary-foreground`     | `#f7f9f8` | texto sobre primary                                                                         |
| `--secondary`            | `bg-secondary`                | `#e1f2ee` | verde-água claro: CTA secundário, chips                                                     |
| `--secondary-foreground` | `text-secondary-foreground`   | `#06525c` |                                                                                             |
| `--accent`               | `bg-accent`                   | `#cdeee6` | verde-água: hover de itens, realce                                                          |
| `--accent-foreground`    | `text-accent-foreground`      | `#06525c` |                                                                                             |
| `--agua`                 | `bg-agua`                     | `#7fd1c1` | verde-água vivo: SÓ decorativo (traços, ponto, linha de progresso) ou texto sobre `inverse` |
| `--muted`                | `bg-muted`                    | `#ebf0ee` | faixas alternadas (Section tone="muted")                                                    |
| `--muted-foreground`     | `text-muted-foreground`       | `#3f5f63` | texto secundário                                                                            |
| `--border`               | `border-border`               | `#d3dfdc` | divisórias decorativas (não informativas)                                                   |
| `--input`                | `border-input`                | `#6b8885` | borda de controle interativo (≥ 3:1)                                                        |
| `--ring`                 | `ring-ring`                   | `#0a7c72` | foco visível                                                                                |
| `--destructive`          | `text-destructive`            | `#b42318` | erro (não previsto em v1)                                                                   |
| `--inverse`              | `bg-inverse`                  | `#06525c` | faixa escura (CTA final, Footer)                                                            |
| `--inverse-foreground`   | `text-inverse-foreground`     | `#f7f9f8` |                                                                                             |
| `--inverse-muted`        | `text-inverse-muted`          | `#c1d0d2` | texto secundário na faixa escura                                                            |
| `--inverse-ring`         | `ring-inverse-ring`           | `#7fd1c1` | foco na faixa escura                                                                        |
| `--status-open`          | `text-status-open`            | `#17653d` | texto "Aberto"                                                                              |
| `--status-open-bg`       | `bg-status-open-bg`           | `#e2f4ea` | fundo do selo aberto                                                                        |
| `--status-open-dot`      | `bg-status-open-dot`          | `#1f8a52` | ponto do selo aberto                                                                        |
| `--status-closed`        | `text-status-closed` / ponto  | `#7a3d0a` | texto e ponto "Fechado" (âmbar, não alarmante)                                              |
| `--status-closed-bg`     | `bg-status-closed-bg`         | `#f9ecdd` | fundo do selo fechado                                                                       |

Sem modo escuro (ADR-008): bloco `.dark` removido; `@custom-variant dark` mantido só para as classes `dark:` dos componentes shadcn não dispararem por `prefers-color-scheme`.

### Contraste (WCAG 2.1, fórmula de luminância relativa)

| Texto / elemento               | Fundo                         | Razão   | Uso                             | AA          |
| ------------------------------ | ----------------------------- | ------- | ------------------------------- | ----------- |
| `#12343a` foreground           | `#f7f9f8` background          | 12.59:1 | texto corrido                   | Sim (≥ 4.5) |
| `#12343a` foreground           | `#ffffff` card                | 13.31:1 | texto em card                   | Sim         |
| `#12343a` foreground           | `#ebf0ee` muted               | 11.55:1 | texto em faixa muted            | Sim         |
| `#12343a` foreground           | `#e1f2ee` secondary           | 11.49:1 | texto em chip                   | Sim         |
| `#3f5f63` muted-fg             | `#f7f9f8` background          | 6.56:1  | texto secundário                | Sim         |
| `#3f5f63` muted-fg             | `#ffffff` card                | 6.93:1  | texto secundário em card        | Sim         |
| `#3f5f63` muted-fg             | `#ebf0ee` muted               | 6.02:1  | texto secundário em faixa muted | Sim         |
| `#3f5f63` muted-fg             | `#e1f2ee` secondary           | 5.99:1  |                                 | Sim         |
| `#06525c` primary (texto/link) | `#f7f9f8` background          | 8.38:1  | links, títulos destaque         | Sim         |
| `#06525c` primary              | `#ffffff` card                | 8.86:1  |                                 | Sim         |
| `#06525c` primary              | `#ebf0ee` muted               | 7.70:1  |                                 | Sim         |
| `#f7f9f8` primary-fg           | `#06525c` primary             | 8.38:1  | texto do CTA primário           | Sim         |
| `#f7f9f8` primary-fg           | `#044650` primary-hover       | 9.94:1  | CTA em hover                    | Sim         |
| `#06525c` secondary-fg         | `#e1f2ee` secondary           | 7.66:1  | CTA secundário                  | Sim         |
| `#06525c` accent-fg            | `#cdeee6` accent              | 7.16:1  | hover secundário                | Sim         |
| `#f7f9f8` inverse-fg           | `#06525c` inverse             | 8.38:1  | faixa escura                    | Sim         |
| `#c1d0d2` inverse-muted        | `#06525c` inverse             | 5.58:1  | texto secundário faixa escura   | Sim         |
| `#7fd1c1` agua                 | `#06525c` inverse             | 4.98:1  | destaque sobre faixa escura     | Sim         |
| `#06525c` (CTA inverse texto)  | `#f7f9f8` (CTA inverse fundo) | 8.38:1  | CTA na faixa escura             | Sim         |
| `#17653d` status-open          | `#e2f4ea` status-open-bg      | 6.19:1  | texto do selo aberto            | Sim         |
| `#1f8a52` status-open-dot      | `#e2f4ea` status-open-bg      | 3.81:1  | ponto (gráfico, ≥ 3)            | Sim         |
| `#7a3d0a` status-closed        | `#f9ecdd` status-closed-bg    | 7.23:1  | texto e ponto do selo fechado   | Sim         |
| `#b42318` destructive          | `#f7f9f8` background          | 6.22:1  | erro                            | Sim         |
| `#6b8885` input (borda UI)     | `#f7f9f8` background          | 3.62:1  | borda de controle (1.4.11, ≥ 3) | Sim         |
| `#6b8885` input                | `#ffffff` card                | 3.83:1  |                                 | Sim         |
| `#0a7c72` ring (foco)          | `#f7f9f8` background          | 4.80:1  | anel de foco (≥ 3)              | Sim         |
| `#0a7c72` ring                 | `#ffffff` card                | 5.07:1  |                                 | Sim         |
| `#0a7c72` ring                 | `#e1f2ee` secondary           | 4.38:1  | foco em chip/CTA secundário     | Sim         |
| `#7fd1c1` inverse-ring         | `#06525c` inverse             | 4.98:1  | foco na faixa escura            | Sim         |

Pares PROIBIDOS (falham AA): `--agua` como texto sobre fundo claro (1.68:1); `--border` como única delimitação de controle interativo (1.29:1); `--ring` sobre `--primary` sem `ring-offset` (1.75:1) — por isso todo foco usa `ring-offset-2`.

### Tipografia

| Papel           | Família                                                                       | Pacote (T1.4)                         | Pesos usados                                   |
| --------------- | ----------------------------------------------------------------------------- | ------------------------------------- | ---------------------------------------------- |
| Display (h1–h4) | Source Serif 4 Variable — serifada de leitura, calorosa, eixo `wght` + `opsz` | `@fontsource-variable/source-serif-4` | 400 (h1–h3), 600 (h4)                          |
| Texto / UI      | Libre Franklin Variable — sans legível, números claros                        | `@fontsource-variable/libre-franklin` | 400 texto, 500 botões/rótulos, 600 ênfase rara |

Ambas cobrem latin + latin-ext (ç, ã, õ, á, ê). Remover `@fontsource-variable/geist` e seu `@import` em T1.4. Vars: `--font-display` (`font-display`), `--font-sans` (`font-sans`, padrão do `html`), `--font-heading` = display (usado por componentes shadcn).

**Fonte base 18px (R7):** `html { font-size: 112.5%; }` (T1.5). Respeita o zoom/tamanho do usuário e faz `1rem = 18px`, então todos os `rem` do shadcn e do Tailwind escalam juntos (spacing unit vira 4.5px). Media queries não mudam (em `rem`, usam o padrão do navegador). Texto corrido nunca abaixo de `text-base`. `text-sm` (15.75px) só em metadados curtos (rodapé legal, crédito); proibido em botão, link de navegação, FAQ e corpo.

| Token                | Utility            | Valor (rem)                                  | px @ 360 → 1440 | line-height |
| -------------------- | ------------------ | -------------------------------------------- | --------------- | ----------- |
| `--text-h1`          | `text-h1`          | `clamp(2.25rem, 1.7rem + 2.6vw, 3.75rem)`    | 40.5 → 67.5     | 1.08        |
| `--text-h2`          | `text-h2`          | `clamp(1.75rem, 1.45rem + 1.4vw, 2.5rem)`    | 31.5 → 45       | 1.15        |
| `--text-h3`          | `text-h3`          | `clamp(1.375rem, 1.25rem + 0.5vw, 1.625rem)` | 24.3 → 29.25    | 1.25        |
| `--text-h4`          | `text-h4`          | `1.25rem`                                    | 22.5            | 1.3         |
| `--text-lg`          | `text-lg`          | `1.125rem`                                   | 20.25           | 1.55        |
| `--text-base`        | `text-base`        | `1rem`                                       | 18              | 1.6         |
| `--tracking-display` | `tracking-display` | `-0.02em`                                    | títulos         | —           |

Títulos: `text-balance`; parágrafos: `text-pretty`, largura máx. `max-w-texto` (38rem ≈ 65 caracteres).

### Espaçamento e layout

| Token                 | Utility                        | Valor                                       | Uso                                               |
| --------------------- | ------------------------------ | ------------------------------------------- | ------------------------------------------------- |
| `--spacing-gutter`    | `px-gutter`                    | `clamp(1.125rem, 0.75rem + 1.8vw, 2.25rem)` | padding lateral do Container                      |
| `--spacing-section`   | `py-section`                   | `clamp(3.5rem, 2.5rem + 4.5vw, 7rem)`       | padding vertical de Section (DENSITY 3 = respiro) |
| `--spacing-header`    | `h-header`, `scroll-mt-header` | `4rem` (72px)                               | altura do Header e offset de âncora               |
| `--container-content` | `max-w-content`                | `70rem` (1260px)                            | largura máxima                                    |
| `--container-texto`   | `max-w-texto`                  | `38rem`                                     | texto corrido                                     |

Ritmo interno: múltiplos da escala padrão (`gap-4`, `gap-6`, `gap-8`, `gap-12`). Bordas esquerda/direita iguais: todo conteúdo dentro de `Container`.

### Raios

`--radius: 0.75rem` (13.5px, "soft"). Escala shadcn derivada (`rounded-sm` … `rounded-4xl`). Uso fixo: botões e inputs `rounded-lg`; cards `rounded-2xl`; imagens `rounded-2xl`; selo e chips `rounded-full`. Um botão, um card, uma escala.

### Sombras

| Token             | Utility         | Valor                                                         | Uso                               |
| ----------------- | --------------- | ------------------------------------------------------------- | --------------------------------- |
| `--shadow-soft`   | `shadow-soft`   | `0 1px 2px rgb(6 82 92 / .06), 0 4px 12px rgb(6 82 92 / .06)` | cards em repouso                  |
| `--shadow-raised` | `shadow-raised` | `0 2px 4px rgb(6 82 92 / .06), 0 12px 32px rgb(6 82 92 / .1)` | card em hover, FAB, header sólido |

Tom petróleo (não preto), baixa opacidade: "acolhedor, nada startup". Sem glow, sem gradiente.

## Padrões GSAP

### API de `src/lib/gsap.ts` (T1.8)

```ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP); // idempotente: registro no topo do módulo
gsap.defaults({ ease: "power2.out", duration: 0.6 });

export const MOTION_CONDITIONS = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 768px)",
  mobile: "(max-width: 767.98px)",
} as const;

export type MotionConditions = { [K in keyof typeof MOTION_CONDITIONS]: boolean };

export const DURATION = { fast: 0.3, base: 0.6, slow: 0.9 } as const; // segundos
export const EASE = { out: "power2.out", inOut: "power2.inOut", soft: "power1.out" } as const;
export const STAGGER = 0.08 as const;

export { gsap, ScrollTrigger, useGSAP };
```

- Nenhum outro arquivo importa `gsap`, `gsap/*` ou `@gsap/react` diretamente. Tudo via `@/lib/gsap`.
- **SplitText:** não registrado na Fase 1 (R10). Na Fase 3 o Hero o adiciona em `src/lib/gsap.ts` (`import { SplitText } from "gsap/SplitText"`, no `registerPlugin` e no export). Ele faz parte do pacote `gsap` 3.15 já instalado (sem dependência nova).
- ScrollToPlugin: não usar. Scroll suave de âncora = CSS `scroll-behavior: smooth` em `html` dentro de `@media (prefers-reduced-motion: no-preference)` (T1.5) + `scroll-mt-header`.

### Padrão obrigatório em componente

```tsx
import { useRef } from "react";
import { gsap, useGSAP, MOTION_CONDITIONS, DURATION, STAGGER } from "@/lib/gsap";

export default function Exemplo() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_CONDITIONS, (ctx) => {
        const { reduce } = ctx.conditions as MotionConditions;
        if (reduce) return; // estado final já é o do CSS: nada escondido
        gsap.from("[data-anim='item']", {
          autoAlpha: 0,
          y: 16,
          duration: DURATION.base,
          stagger: STAGGER,
          scrollTrigger: { trigger: scope.current, start: "top 80%", once: true },
        });
      });
      // mm é criado dentro do contexto do useGSAP ⇒ revertido no unmount
    },
    { scope },
  );

  return <section ref={scope}>{/* ... */}</section>;
}
```

Regras:

1. Sempre `useGSAP` com `{ scope }`. Nunca `useEffect` + gsap. Seletores só dentro do scope, preferindo `data-anim="..."` a classes Tailwind.
2. Sempre `gsap.matchMedia()` com `MOTION_CONDITIONS`. Em `reduce`: não criar tween nem ScrollTrigger. Não aninhar `gsap.context()` dentro do matchMedia.
3. **Só `transform` e `opacity`**: `x`, `y`, `xPercent`, `yPercent`, `scale`, `scaleX`, `scaleY`, `rotation`, `opacity`, `autoAlpha`. Proibido: `width`, `height`, `top`, `left`, `margin`, `padding`, `backgroundColor`, `color`, `boxShadow`, `filter`, `clipPath`.
4. Conteúdo visível sem JS: o estado inicial vem de `gsap.from()` dentro do matchMedia (nunca `opacity-0` no CSS/JSX). Sem JS ou com reduced motion, tudo aparece.
5. Header "sólido ao rolar": a troca de fundo/sombra é **classe** (`data-solid`) alternada por `ScrollTrigger.create({ onToggle })`; a transição visual é `opacity` de uma camada de fundo pseudo/absoluta, não animação de `background-color`.
6. Linha de progresso do "Como agendar": `scaleY` (ou `scaleX` no desktop) de 0→1 com `transformOrigin: "top"` e `scrub: true`.
7. Hero: timeline única no load (`gsap.timeline()`), ≤ 1.2 s total, sem ScrollTrigger. SplitText por palavras (não caracteres), `autoAlpha` + `yPercent`, `aria` preservado (SplitText 3.13+ cuida de `aria-label`).
8. `once: true` em reveals; nada de animação que reverte ao rolar para cima. Sem parallax em texto, sem pin, sem scroll-jacking.
9. Criar ScrollTriggers na ordem da página. Após carregamento de fontes: `document.fonts.ready.then(() => ScrollTrigger.refresh())`, uma vez, em `App` (Fase 3).
10. `markers` nunca commitado.

Orçamento de motion (MOTION 4): 1 entrada de Hero + reveals discretos (y ≤ 24px, ≤ 0.6 s) + linha de progresso + header. Nada contínuo além do Marquee opcional.

## Componentes de terceiros

### shadcn/ui (estilo `base-nova`, primitivos `@base-ui/react`, não Radix)

| Componente  | Disponível em base-nova                                                               | Fase | Uso                                      | Animação própria                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------- | ---- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `button`    | Sim (instalado)                                                                       | 1    | base do `CTAButton` via `buttonVariants` | `active:translate-y-px` (CSS, hover/press; permitido)                                                                          |
| `sheet`     | Sim (`registry/base-nova/ui/sheet.tsx`, conferido com `npx shadcn@latest view sheet`) | 2    | menu mobile do Header                    | transição CSS de abertura (150–200 ms); não é scroll. Adicionar `motion-reduce:transition-none` / `motion-reduce:animate-none` |
| `accordion` | Sim (`registry/base-nova/ui/accordion.tsx`)                                           | 2    | FAQ, preparo de exames                   | `animate-accordion-down/up` (CSS de altura, só ao clicar). Adicionar `motion-reduce:animate-none`                              |
| `card`      | Sim (`registry/base-nova/ui/card.tsx`)                                                | 2    | especialidades, diferenciais             | nenhuma                                                                                                                        |

Instalação na Fase 2 com `npx shadcn@latest add sheet accordion card`. Após instalar: trocar `text-sm` por `text-base` em gatilhos/corpo (regra 18px) e conferir ícones lucide.

### React Bits / Magic UI (seleção para a Fase 3; instalar só na Fase 3)

Critério: zero animação ligada ao scroll, zero WebGL/shader (página de serviço, Taste Skill), sem `motion`/`framer-motion`, peso pequeno.

| Componente                | Origem                                                  | Uso                                                                                   | Dependências que traz                                           | Animação de scroll própria                      | Custo estimado (gzip) | Adaptação obrigatória                                                                                                                                                            |
| ------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Marquee`                 | Magic UI (`magicui.design/r/marquee.json`)              | Convênios, **só se ≥ 4 confirmados**                                                  | nenhuma npm; keyframes `marquee` (translateX) em CSS            | Não (loop CSS contínuo, independente do scroll) | < 1 KB                | `pauseOnHover`; `motion-reduce:[animation-play-state:paused]` + lista estática acessível (`aria-hidden` nas cópias); botão de pausa se > 5 s visível                             |
| `BentoGrid` / `BentoCard` | Magic UI (`magicui.design/r/bento-grid.json`)           | grade de Especialidades no desktop                                                    | `@radix-ui/react-icons` (só `ArrowRightIcon`) + shadcn `button` | Não (hover CSS `translate-y`)                   | ~1 KB próprio         | Trocar `@radix-ui/react-icons` por `lucide-react` (não instalar a dep); trocar `href/cta` por `CTAButton`; remover estilos `dark:`; sombras → `shadow-soft`/`shadow-raised`      |
| `SpotlightCard` (TS-TW)   | React Bits (`reactbits.dev/r/SpotlightCard-TS-TW.json`) | **Opcional**: hover em cards de Diferenciais, só `(hover: hover) and (pointer: fine)` | nenhuma npm                                                     | Não (pointermove + rAF só em hover)             | ~2–3 KB               | `theme="light"`, `ambient={false}`, `grain={0}`, `flare={false}`, `spotlightColor` = `--agua` a 20%; desligar em reduced motion. Fase 3 decide se entra; se pesar no INP, cortar |

Rejeitados (registrar para não reabrir): React Bits `SplitText`, `BlurText`, `AnimatedContent`, `FadeContent`, `CountUp` (ScrollTrigger/IntersectionObserver próprios ou `motion`); fundos React Bits `Aurora`, `Silk`, `Particles`, etc. (WebGL/`ogl`; vetado para serviço); Magic UI `NumberTicker`, `BlurFade`, `TextAnimate`, `AnimatedList` (`motion` + `useInView`). Contadores de Diferenciais: não há números confirmados ⇒ sem contador (não inventar dado).

## Performance

- **Orçamento JS inicial: < 200 KB gzip** (SPEC §6). Estimativa atual: React 19 + ReactDOM ≈ 60 KB; gsap core + ScrollTrigger ≈ 45 KB; SplitText ≈ 5 KB; `@base-ui/react` (só o que for importado, tree-shaken) ≈ 15–25 KB; lucide (ícones individuais) ≈ 3 KB; app ≈ 20 KB. Total ≈ 150–160 KB. Conferir na saída do `vite build` em toda fase.
- GSAP entra no bundle inicial (o Hero anima no load). Nada de `motion`/`framer-motion`.
- Ícones: `import { MessageCircle } from "lucide-react"` (named import, tree-shaken). Nunca `import * as Icons`.
- **Fontes**: self-hosted via `@fontsource-variable/*`, importadas no topo de `src/index.css`. Os CSS do fontsource já trazem `font-display: swap` e `unicode-range` por subset: o navegador só baixa `latin` (e `latin-ext` se aparecer caractere dele). Não importar arquivos de subset não usados manualmente. Preload do woff2 latin das duas fontes = Fase 4. Fallbacks métricos (`Georgia`, `system-ui`) já na pilha para reduzir CLS.
- Sem Google Fonts CDN, sem requisição externa no load (mapa = iframe lazy, Fase 4).
- `HorarioBadge` só renderiza após mount (ADR-007) e não reserva espaço que mude depois: posicionado onde a ausência não desloca layout (ex.: linha própria acima do h1 com `min-h` fixo, ou inline no fim).
- Imagens (Fase 4): `width`/`height` explícitos, `loading="lazy"` fora do primeiro viewport, AVIF/WebP.
- Seções abaixo da dobra podem ser `lazy()` só se o build passar do orçamento; não otimizar antes de medir.
- React: sem estado global; `useMemo` só para cálculos não triviais; o relógio do selo atualiza com `setInterval` de 60 s, limpo no unmount, e só no componente que usa.

## Decisões (ADRs)

### ADR-001 — Estrutura em `components/base`, `sections`, `lib`, `dev`

Contexto: Fase 2 vai criar 12 seções. Decisão: seções em `src/sections`, primitivos sem conteúdo em `src/components/base`, terceiros adaptados em `src/components/vendor`. Consequência: primitivos testáveis sem `clinica.ts`; seções são o único lugar que lê conteúdo.

### ADR-002 — Fontes self-hosted: Source Serif 4 + Libre Franklin

Contexto: SPEC §3 pede display + sans legível; Taste Skill (service/clinic) entregou o pairing `source-serif`. Decisão: `@fontsource-variable/source-serif-4` (títulos) + `@fontsource-variable/libre-franklin` (texto/UI); sem Google Fonts CDN; remover `@fontsource-variable/geist`. Por quê: serifada de leitura passa confiança e calor ao público adulto/idoso, sem cara de "startup"; Libre Franklin tem desenho aberto e números legíveis em 18px. Ambas com latin-ext. Consequência: 2 dependências novas (somente CSS + woff2), instaladas em T1.4.

### ADR-003 — Kitchen sink só em desenvolvimento

Decisão: arquivo `src/dev/KitchenSink.tsx` (`export default`). URL: `http://localhost:5173/?kitchen-sink`. Montagem em `src/main.tsx`:

```tsx
import { lazy, StrictMode, Suspense, type ComponentType } from "react";

// ADR-003: página de referência só em DEV (?kitchen-sink). No build, o ramo é eliminado.
// main.tsx é o ponto de entrada (nada para Fast Refresh preservar aqui).
// eslint-disable-next-line react-refresh/only-export-components
const Root: ComponentType =
  import.meta.env.DEV && new URLSearchParams(window.location.search).has("kitchen-sink")
    ? lazy(() => import("@/dev/KitchenSink"))
    : App;

// render: <StrictMode><Suspense fallback={null}><Root /></Suspense></StrictMode>
```

Vite substitui `import.meta.env.DEV` por `false` no build; o ternário vira `App` e o Rollup elimina o `import()` (nenhum chunk gerado). Verificação (T1.12): `grep -ri "kitchen" dist/` vazio. `App.tsx` não referencia o kitchen sink.

Por que `const` + ternário com `eslint-disable`: a primeira forma (`let Root = App; if (...) Root = lazy(...)`) falhou no `npm run lint`, porque `react-refresh/only-export-components` acusa o componente criado por `lazy()` no módulo. O `eslint-disable-next-line` vale só para essa linha e é justificado: `main.tsx` é o arquivo de entrada, não exporta nada e não tem estado para o Fast Refresh preservar. Não copiar esse disable para outros arquivos.

### ADR-011 — `cn` configurado com os tokens do tema

Contexto: `cn` (pacote `cn`, merge de classes no estilo tailwind-merge) não conhece os tokens próprios de `@theme inline`. Sem configuração, ele trata `text-h2` como cor e o descarta quando aparece junto de `text-primary` (mesmo grupo "text color"), e o mesmo risco vale para `shadow-*`, `max-w-*` e espaçamentos nomeados. Decisão: `src/lib/utils.ts` exporta `cn = createCn({ extend: { theme: { ... } } })` (de `cn/config`) registrando:

| Grupo     | Tokens                        | Utilities                                                 |
| --------- | ----------------------------- | --------------------------------------------------------- |
| text      | `h1`, `h2`, `h3`, `h4`        | `text-h1` … `text-h4` (tamanho, não cor)                  |
| tracking  | `display`                     | `tracking-display`                                        |
| container | `content`, `texto`            | `max-w-content`, `max-w-texto`                            |
| shadow    | `soft`, `raised`              | `shadow-soft`, `shadow-raised`                            |
| spacing   | `gutter`, `section`, `header` | `px-gutter`, `py-section`, `h-header`, `scroll-mt-header` |

Consequência: **todo token novo em `@theme inline` que gere utility usada com `cn` deve entrar também nessa lista**, no mesmo commit. Cores novas (`--color-*`) não precisam (já são reconhecidas como cor).

### ADR-004 — Sábado pendente: selo oculto (decisão do usuário, R2)

Contexto: horário de sábado não confirmado; afirmar "Aberto agora" seria fato não confirmado (regra 2, SPEC §9). Decisão: campo opcional `pendente?: boolean` em `Horario`; só o item de sábado recebe `pendente: true` (TODO mantido). `getStatusHorario` retorna `{ estado: "indefinido" }` durante **todo** o dia coberto por faixa pendente; `isOpenNow` retorna `null`. `HorarioBadge` não renderiza nada nesse estado. Tabela de horários na seção Localização pode listar o sábado com a marcação "a confirmar" (texto em `clinica.ts`, Fase 2). Ao confirmar: remover `pendente` e o TODO; nenhum código muda.

### ADR-005 — Domingo fechado (decisão do usuário, R3)

Domingo (0) ausente de `clinica.horarios` = **fechado**, não pendente. Selo mostra "Fechado" no domingo. Não adicionar entrada nem TODO para domingo.

### ADR-006 — Mensagens de WhatsApp em `clinica.whatsapp.mensagens` (decisão do usuário, R5)

Usuário autorizou textos neutros de agendamento. Decisão: bloco `whatsapp.mensagens` em `clinica.ts` com 4 chaves (`padrao`, `especialidade` com `{especialidade}`, `exames`, `duvidas`), textos exatos em § Tipos. Helper resolve por `ContextoWhatsApp`; número segue de `contato.whatsappE164` (R4: troca em um lugar só). Proibido: promessa de resultado, preço, "urgência", "emergência", "24h".

### ADR-007 — Selo de horário calculado no cliente após o mount

Decisão: componentes guardam `status` em `useState<StatusHorario | null>(null)` e calculam em `useEffect` (e a cada 60 s). Por quê: o site é estático/SPA hoje, mas evita resultado congelado em cache/prerender futuro e mantém `now` injetável nos testes. Consequência: selo aparece alguns ms depois do primeiro paint; layout não pode depender dele (ver Performance).

### ADR-008 — Sem modo escuro em v1

Público e escopo não pedem tema escuro; manter dois temas dobra a verificação de contraste. Bloco `.dark` removido de `src/index.css`; `@custom-variant dark` mantido (class-based, nunca ativada) para neutralizar classes `dark:` do shadcn.

### ADR-009 — Fonte base via `html { font-size: 112.5% }` (R7)

Alternativa rejeitada: só `body { font-size: 18px }` deixaria shadcn/Tailwind (`rem`) em escala de 16px e botões com 14px. Escolhido escalar o root: tudo proporcional, respeita a preferência do navegador do usuário.

### ADR-010 — Seleção de terceiros sem `motion`

React Bits/Magic UI entram só se não trouxerem `motion`/`framer-motion`, WebGL ou gatilho de scroll. Lista em § Componentes de terceiros. Qualquer inclusão fora da lista exige novo ADR.

## Instruções para o desenvolvedor

Ordem e escopo da Fase 1 (após o gate de design):

1. **T1.4 — fontes:** `npm i @fontsource-variable/source-serif-4 @fontsource-variable/libre-franklin && npm uninstall @fontsource-variable/geist`. Em `src/index.css`, trocar `@import "@fontsource-variable/geist";` por `@import "@fontsource-variable/source-serif-4";` e `@import "@fontsource-variable/libre-franklin";`. Os tokens `--font-display`/`--font-sans` já apontam para `"Source Serif 4 Variable"` e `"Libre Franklin Variable"`.
2. **T1.5 — base layer** (tokens de cor/tipo/espaço/raio/sombra já estão em `src/index.css`; não altere valores sem ADR). Adicionar em `@layer base`:
   - `html { font-size: 112.5%; @apply font-sans; -webkit-text-size-adjust: 100%; }`
   - `@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }`
   - `body { @apply bg-background text-foreground text-base antialiased; }`
   - `h1,h2,h3,h4 { @apply font-display; }`
   - `:focus-visible { outline: 3px solid var(--ring); outline-offset: 2px; }` (componentes com `ring` próprio podem usar `outline-none` desde que mostrem o ring).
   - Offset de âncora: utility `scroll-mt-header` aplicada pelo `Section` (não usar seletor global `[id]`).
3. **T1.6 — `whatsapp.ts`:** adicionar a `clinica.ts` o tipo `MensagensWhatsApp` (exportado) e o bloco `whatsapp.mensagens` com os textos exatos de § Tipos. Implementar `getMensagemWhatsApp` e `buildWhatsAppLink`. `encodeURIComponent` sobre a mensagem inteira (quebra de linha vira `%0A`). Testes conforme T1.6.
4. **T1.7 — `horario.ts`:** adicionar `pendente?: boolean` em `Horario` e `pendente: true` só no sábado (manter o comentário TODO). Adicionar `ui.selo` em `clinica.ts` (textos de § Tipos). Implementar via `Intl.DateTimeFormat("en-US", { timeZone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now)`; mapear `Sun..Sat` ⇒ `0..6`. Testes extras além de T1.7: sábado 08:00 BRT ⇒ `indefinido`; sábado 13:00 BRT ⇒ `indefinido`; domingo 10:00 ⇒ `fechado`; `isOpenNow` ⇒ `true/false/null`; `formatHora("20:00") === "20h"`, `formatHora("07:30") === "7h30"`.
5. **T1.8 — `gsap.ts`:** exatamente a API de § Padrões GSAP (sem SplitText). Teste: importa em jsdom, `MOTION_CONDITIONS.reduce === "(prefers-reduced-motion: reduce)"`, `ScrollTrigger` registrado (`gsap.plugins` ou `typeof ScrollTrigger.create === "function"`).
6. **T1.9–T1.11 — base:** `Container`, `Section`, `Heading`, `CTAButton` com as props de § Tipos, em `src/components/base/`. `CTAButton` usa `buttonVariants` + `cn` e sobrescreve tamanho (`min-h-11`, `text-base`); não editar `src/components/ui/button.tsx`.
7. **T1.12 — kitchen sink:** criar também `src/components/base/HorarioBadge.tsx` (contrato em § Tipos) e mostrá-lo com `now` fixo: segunda 10:00 BRT (aberto), segunda 21:00 BRT (fechado), sábado 09:00 BRT (indefinido ⇒ exibir um rótulo de dev "não renderiza" ao lado do espaço vazio). Montagem conforme ADR-003. Mostrar a tabela de contraste lendo os valores das CSS vars (`getComputedStyle`) é opcional; hex fixo no kitchen sink é aceitável (página de dev).
8. Regras gerais: nenhum texto de clínica em componente; nenhum `import ... from "gsap"` fora de `src/lib/gsap.ts`; nenhuma animação nesta fase além do `active:translate-y-px` do botão; `npm run typecheck && npm run lint && npm run test && npm run build && npm run format:check` antes de entregar cada tarefa.

Pendências técnicas para a Fase 2 (gate final da Fase 1):

- **CTAButton sob reduced motion:** adicionar `motion-reduce:transition-none` e neutralizar o `active:translate-y-px` herdado de `buttonVariants` (ex.: `motion-reduce:active:translate-y-0`). Teste: as classes estão presentes no `<a>` renderizado. Não editar `src/components/ui/button.tsx`; aplicar no `className` do `CTAButton`.
- O mesmo vale para Sheet/Accordion ao instalar (ver § Componentes de terceiros).

Pendências que NÃO bloqueiam a Fase 1: logo/paleta oficial (R1), sábado (R2), número de WhatsApp (R4), convênios, exames, médicos.
