# FASE 1 — Arquitetura e design system

Autor: planejador · Data: 23/11/2026 · Pré-requisito: Fase 0 APROVADA (`docs/reports/FASE-0-validacao.md`)

## Meta (PLAN)

> Contrato técnico e visual antes de qualquer seção.
>
> - Arquiteto escreve `docs/ARCHITECTURE.md` (estrutura de pastas, tipos, padrões GSAP, tokens)
> - Taste Skill define paleta, tipografia, espaçamento, raio, sombras → `tailwind` theme / CSS vars
> - `src/lib/gsap.ts` (registro de plugins + matchMedia padrão)
> - `src/lib/whatsapp.ts` (`buildWhatsAppLink`) e `src/lib/horario.ts` (`isOpenNow`) com testes
> - Componentes base: `Section`, `Container`, `Heading`, `CTAButton`
>
> **Aceite:** página "kitchen sink" mostrando tokens e componentes base; testes de libs passando.

## Critério de aceite da fase (verificável)

1. `docs/ARCHITECTURE.md` sem nenhuma seção vazia.
2. `npm run typecheck && npm run lint && npm run test && npm run build && npm run format:check` passam sem erro.
3. Testes de `whatsapp.ts` e `horario.ts` passam também com `TZ=UTC npm run test` e `TZ=Asia/Tokyo npm run test` (independência do fuso da máquina).
4. Em `npm run dev`, a URL do kitchen sink definida em T1.12 mostra: paleta, escala tipográfica, espaçamentos, raios, sombras, `Section`, `Container`, `Heading` (todos os níveis), `CTAButton` (todas as variantes) e o selo de horário.
5. O kitchen sink **não** entra no build de produção (checagem em T1.12).
6. `src/App.tsx` continua sem seções do site (seções são Fase 2).

---

## Tarefas

### T1.1 — ARCHITECTURE: estrutura, tipos e ADRs

- **Objetivo:** fixar estrutura de pastas, convenções de nomes, tipos compartilhados e decisões iniciais.
- **Arquivos:** `docs/ARCHITECTURE.md` (seções "Estrutura", "Tipos", "Decisões (ADRs)", "Instruções para o desenvolvedor").
- **Deve conter, no mínimo:**
  - Árvore de pastas alvo (`src/components/ui`, `src/components/base` ou equivalente, `src/sections`, `src/lib`, `src/data`, `src/dev`, `src/test`) e regra de onde cada coisa mora.
  - Como componentes consomem `clinica.ts` (props vs. import direto) e como tratar itens `pendente: true` (ocultar / marcar) — contrato que a Fase 2 vai seguir.
  - ADR do kitchen sink: local do arquivo e mecanismo para só existir em dev (ex.: `import.meta.env.DEV` + query/hash + `lazy()` com import dinâmico dentro do ramo DEV, para ser eliminado do bundle).
  - ADR de fontes: self-hosted via `@fontsource-variable/*` (sem Google Fonts CDN); remover Geist se não for a escolhida.
  - ADR sobre o sábado pendente no selo de horário (ver Riscos R2): como `horario.ts` saberá que o sábado é pendente (ex.: campo opcional `pendente?: boolean` em `Horario`, marcado só no item de sábado já sinalizado com TODO) e o que o selo exibe nesse caso.
  - Assinaturas exatas de `buildWhatsAppLink`, `isOpenNow` (e, se houver, função de status para o selo "Aberto hoje até 20h" do Hero), com `now: Date` injetável.
- **Pronto quando:** as 4 seções citadas estão preenchidas e cada item da lista acima é encontrável no texto (checagem do validador).
- **Depende de:** —
- **Responsável:** arquiteto

### T1.2 — ARCHITECTURE: design tokens

- **Objetivo:** definir paleta, tipografia, espaçamento, raio e sombras com a Taste Skill (VARIANCE 5 · MOTION 4 · DENSITY 3).
- **Arquivos:** `docs/ARCHITECTURE.md` (seção "Design Tokens").
- **Deve conter:**
  - Paleta fallback da SPEC §3 (azul-petróleo + verde-água + off-white) mapeada para as variáveis do shadcn já existentes em `src/index.css` (`--background`, `--foreground`, `--primary`, `--accent`, `--muted`, `--border`, `--ring` etc.) + cor de estado "aberto"/"fechado".
  - Tabela de contraste: cada par texto/fundo usado, com razão calculada e status AA (≥ 4,5:1 texto normal; ≥ 3:1 texto grande/ícones).
  - Fontes escolhidas: 1 display humanista + 1 sans legível, ambas com pacote `@fontsource-variable/*` existente e suporte a latim estendido (acentos pt-BR).
  - Escala tipográfica com base ≥ 18px no mobile; escala de espaçamento (seções/containers); raios; sombras (sutis, tom "acolhedor, nada startup").
  - Indicação de que os tokens são provisórios até o logo oficial (R1).
- **Pronto quando:** seção preenchida; todos os pares da tabela de contraste marcados AA.
- **Depende de:** —
- **Responsável:** arquiteto

### T1.3 — ARCHITECTURE: padrões GSAP, terceiros e performance

- **Objetivo:** contrato de animação e de uso de bibliotecas visuais antes de qualquer código de animação.
- **Arquivos:** `docs/ARCHITECTURE.md` (seções "Padrões GSAP", "Componentes de terceiros", "Performance").
- **Deve conter:**
  - API de `src/lib/gsap.ts`: plugins registrados (ScrollTrigger; SplitText se usado no Hero), condições padrão de `gsap.matchMedia()` com `prefers-reduced-motion`, padrão `useGSAP` com `scope` (seguir skill `gsap-react`).
  - Regra: só `transform` e `opacity`; nada de animação de scroll fora do GSAP.
  - Lista de componentes React Bits / Magic UI selecionados para a Fase 3 (PLAN Fase 3 diz "selecionados na Fase 1"), cada um com: dependências que traz (ex.: `motion`/`framer-motion`), se tem animação de scroll própria (proibido) e custo estimado de bundle.
  - Observação de que o shadcn está no estilo "base-nova" sobre `@base-ui/react` (não Radix): confirmar disponibilidade de Sheet e Accordion nesse estilo para a Fase 2.
  - Orçamento: JS inicial < 200 KB gzip (SPEC §6); estratégia de fontes (subset latin/latin-ext, `font-display: swap`).
- **Pronto quando:** seções preenchidas; cada componente de terceiro listado tem os 3 campos acima.
- **Depende de:** —
- **Responsável:** arquiteto

> **Gate de design:** validador aprova T1.1–T1.3 antes de T1.4 em diante.

### T1.4 — Fontes self-hosted

- **Objetivo:** instalar as fontes definidas em T1.2 e remover a fonte não usada.
- **Arquivos:** `package.json` (deps `@fontsource-variable/<display>` e `@fontsource-variable/<sans>`; remover `@fontsource-variable/geist` se não escolhida), `src/main.tsx` ou `src/index.css` (imports), `src/index.css` (`--font-sans`, `--font-display` ou nomes definidos em T1.2).
- **Pronto quando:** `npm run build` passa; `dist/assets` contém arquivos `.woff2` das duas fontes; nenhuma requisição a `fonts.googleapis.com`/`fonts.gstatic.com` (busca em `dist/` sem resultado); Geist ausente de `package.json` se não escolhida.
- **Depende de:** T1.2 + gate de design
- **Responsável:** desenvolvedor

### T1.5 — Tokens no CSS (Tailwind v4 `@theme inline`)

- **Objetivo:** aplicar paleta, tipografia, espaçamento, raio e sombras de T1.2 em `src/index.css`.
- **Arquivos:** `src/index.css`.
- **Pronto quando:**
  - valores de `src/index.css` batem 1:1 com a tabela de T1.2 (checagem do validador);
  - `html` com fonte base ≥ 18px no mobile (DevTools 360px: `font-size` computado do `body` ≥ 18px);
  - foco visível global (`:focus-visible` com `--ring`) definido;
  - nenhum `tailwind.config.*` criado (Tailwind v4 CSS-first);
  - `npm run build && npm run lint` passam.
- **Depende de:** T1.4
- **Responsável:** desenvolvedor

### T1.6 — `src/lib/whatsapp.ts` + testes

- **Objetivo:** helper `buildWhatsAppLink` conforme assinatura de T1.1 (RF01).
- **Arquivos:** `src/lib/whatsapp.ts`, `src/lib/whatsapp.test.ts`.
- **Pronto quando:** `npm run test -- whatsapp` passa cobrindo, no mínimo:
  - URL base `https://wa.me/<clinica.contato.whatsappE164>` lido de `clinica.ts` (sem número hard-coded no helper);
  - mensagem com acentos, espaços, `&`, `?` e quebra de linha corretamente codificada (`encodeURIComponent`);
  - mensagem contextual por especialidade (ex.: nome da especialidade aparece decodificado no `text`);
  - textos de mensagem padrão vêm de `clinica.ts` ou de parâmetro, nunca literais de clínica no helper (se precisar de campo novo em `clinica.ts`, seguir decisão do arquiteto em T1.1).
- **Depende de:** T1.1 + gate de design
- **Responsável:** desenvolvedor

### T1.7 — `src/lib/horario.ts` + testes

- **Objetivo:** `isOpenNow` (e função de status do selo, se definida em T1.1) em `America/Sao_Paulo`, a partir de `clinica.horarios` (RF03).
- **Arquivos:** `src/lib/horario.ts`, `src/lib/horario.test.ts`; `src/data/clinica.ts` **apenas** se T1.1 decidir marcar o sábado como pendente via campo de tipo (sem alterar horários nem remover o TODO).
- **Pronto quando:** `npm run test -- horario` passa e também com `TZ=UTC` e `TZ=Asia/Tokyo`, cobrindo:
  - segunda 06:59 fechado · 07:00 aberto · 19:59 aberto · 20:00 fechado (horário de Brasília);
  - domingo fechado o dia todo;
  - sábado: comportamento definido no ADR de T1.1 para horário pendente;
  - virada de dia UTC (ex.: segunda 22:00 BRT = terça 01:00 UTC → fechado e reconhecido como segunda);
  - `now` injetável (sem depender do relógio real); fuso via `Intl.DateTimeFormat` com `timeZone: clinica.timezone`.
- **Depende de:** T1.1 + gate de design
- **Responsável:** desenvolvedor

### T1.8 — `src/lib/gsap.ts`

- **Objetivo:** ponto único de registro de plugins GSAP e das condições padrão de `matchMedia`.
- **Arquivos:** `src/lib/gsap.ts`, `src/lib/gsap.test.ts`.
- **Pronto quando:**
  - exporta `gsap`, plugins e helper/constantes de matchMedia conforme T1.3 (incluindo condição `prefers-reduced-motion: reduce`);
  - registro de plugins acontece uma vez (import idempotente);
  - teste mínimo: módulo importa em jsdom sem erro e expõe as condições esperadas;
  - nenhum outro arquivo em `src/` importa `gsap` diretamente (`grep -rn "from \"gsap" src --include=*.tsx --include=*.ts` só retorna `src/lib/gsap.ts`);
  - `npm run typecheck && npm run test` passam.
- **Depende de:** T1.3 + gate de design
- **Responsável:** desenvolvedor

### T1.9 — Componentes `Container` e `Section`

- **Objetivo:** wrappers de layout com largura máxima, padding lateral e espaçamento vertical dos tokens.
- **Arquivos:** caminho definido em T1.1 (ex.: `src/components/base/Container.tsx`, `src/components/base/Section.tsx`) + `*.test.tsx`.
- **Pronto quando:**
  - `Section` renderiza `<section>` com `id` (âncora, RF04) e `aria-labelledby` opcional; aceita `className` via `cn`;
  - `Container` aplica max-width/padding dos tokens;
  - offset do header para âncoras previsto (ex.: `scroll-margin-top` via token), conforme T1.1;
  - nenhum texto de clínica dentro dos componentes;
  - testes de render passam; `npm run typecheck && npm run lint` passam.
- **Depende de:** T1.5
- **Responsável:** desenvolvedor

### T1.10 — Componente `Heading`

- **Objetivo:** títulos com nível semântico (`h1`–`h4`) independente do tamanho visual, usando a fonte display.
- **Arquivos:** caminho definido em T1.1 (ex.: `src/components/base/Heading.tsx`) + `Heading.test.tsx`.
- **Pronto quando:** teste confirma que `level={2}` renderiza `<h2>` e que é possível `level={2}` com tamanho visual diferente; usa tokens de T1.2; `npm run typecheck && npm run lint && npm run test` passam.
- **Depende de:** T1.5
- **Responsável:** desenvolvedor

### T1.11 — Componente `CTAButton`

- **Objetivo:** botão/link de agendamento que sempre gera `wa.me` via `buildWhatsAppLink` (regra 7, RF01).
- **Arquivos:** caminho definido em T1.1 (ex.: `src/components/base/CTAButton.tsx`) + `CTAButton.test.tsx`; reutiliza `src/components/ui/button.tsx` (shadcn base-nova) sem reescrevê-lo.
- **Pronto quando:**
  - renderiza `<a>` com `href` de `buildWhatsAppLink`, `target="_blank"`, `rel="noopener noreferrer"`;
  - rótulo e mensagem recebidos por props (sem texto de clínica fixo no componente);
  - variantes visuais definidas em T1.1/T1.2 (ex.: primária e secundária); ícone lucide opcional com `aria-hidden`;
  - área de toque ≥ 44×44px; foco visível;
  - teste verifica `href`, `target`, `rel` e mensagem codificada;
  - `npm run typecheck && npm run lint && npm run test` passam.
- **Depende de:** T1.5, T1.6
- **Responsável:** desenvolvedor

### T1.12 — Página kitchen sink (somente dev)

- **Objetivo:** página de referência visual dos tokens e componentes base, fora do site final.
- **Arquivos:** caminho definido no ADR de T1.1 (ex.: `src/dev/KitchenSink.tsx`) e ponto de montagem (ex.: `src/main.tsx`). `src/App.tsx` não recebe conteúdo do kitchen sink.
- **Deve mostrar:** amostras de cor com nome do token e razão de contraste; escala tipográfica (ambas as fontes, com acentos "ção, á, ê, õ"); espaçamentos; raios; sombras; `Section`/`Container`; `Heading` h1–h4; `CTAButton` em todas as variantes, incluindo estado de foco; selo de horário usando `horario.ts` (aberto, fechado e caso sábado pendente, com `now` fixo).
- **Pronto quando:**
  - `npm run dev` e abrir a URL definida no ADR mostra todos os itens acima em 360px e 1440px sem rolagem horizontal;
  - `npm run build` e busca de um texto exclusivo do kitchen sink em `dist/` (ex.: `grep -r "Kitchen sink" dist/`) não retorna nada;
  - textos da clínica exibidos vêm de `clinica.ts`; textos de rótulo do kitchen sink (ex.: "Tokens") são permitidos por ser página de dev;
  - `npm run typecheck && npm run lint && npm run build` passam.
- **Depende de:** T1.7, T1.9, T1.10, T1.11
- **Responsável:** desenvolvedor

### T1.13 — Fechamento da fase

- **Objetivo:** garantir que o conjunto cumpre o aceite antes de ir ao testador.
- **Arquivos:** nenhum novo (ajustes pontuais nos arquivos desta fase, se necessário).
- **Pronto quando:** `npm run typecheck && npm run lint && npm run test && npm run build && npm run format:check` passam; `TZ=UTC npm run test` e `TZ=Asia/Tokyo npm run test` passam; JS inicial do build segue < 200 KB gzip (saída do `vite build`).
- **Depende de:** T1.4–T1.12
- **Responsável:** desenvolvedor

---

## Riscos / dúvidas

- **R1 — Paleta provisória.** Logo e cores oficiais pendentes (PLAN "Pendências"; SPEC §3 "extrair do logo (TODO)"). Tokens da Fase 1 usam o fallback; centralizar em CSS vars para trocar sem tocar componentes.
- **R2 — Sábado pendente.** `clinica.horarios[1]` (sábado 07:00–12:00) tem `// TODO: confirmar sábado`, mas o tipo `Horario` não tem campo `pendente`; o código não consegue ler um comentário. Arquiteto decide em T1.1 (sugestão: `pendente?: boolean` no tipo e `pendente: true` só no sábado). Dúvida para o usuário: com sábado pendente, o selo deve exibir "Aberto agora" no sábado de manhã ou algo neutro (ex.: "Confirme pelo WhatsApp")? Exibir como fato contraria a regra 2 e SPEC §9.
- **R3 — Domingo "confirmar".** SPEC §1 diz "Dom fechado (confirmar)", mas `clinica.ts` não marca domingo como TODO. Hoje a ausência de domingo em `horarios` = fechado. Confirmar com o usuário se domingo também é pendente.
- **Decisões do usuário (23/11/2026):** R2 → selo oculto no sábado (`pendente: true`, estado `indefinido`, ADR-004); R3 → domingo fechado, não pendente (ADR-005); R5 → textos neutros em `clinica.whatsapp.mensagens` autorizados (ADR-006).
- **R4 — Número de WhatsApp.** `whatsappE164` tem `// TODO: confirmar ... se é o número de agendamento`. O helper deve ler sempre de `clinica.ts` para a troca ser em um lugar só. Não bloqueia a fase.
- **R5 — Mensagens pré-preenchidas.** `clinica.ts` não tem textos de mensagem do WhatsApp. Se o helper/CTA precisar de mensagem padrão, o arquiteto define em T1.1 se entra campo novo em `clinica.ts` (texto genérico de agendamento, sem promessas — SPEC §8). Não inventar conteúdo fora de `clinica.ts`.
- **R6 — Fuso / horário de verão.** Brasil sem horário de verão desde 2019, mas não supor offset fixo `-03:00`; usar `Intl` com `timeZone`. Testes com `TZ` diferente cobrem isso.
- **R7 — Fonte base 18px vs. componentes shadcn.** shadcn usa `rem` e tamanhos `text-sm`; com base 18px, botões e inputs mudam de escala. Arquiteto confirma em T1.2 se ajusta `html { font-size }` ou só o `body`.
- **R8 — shadcn base-nova sobre `@base-ui/react`.** Componentes futuros (Sheet, Accordion, Card, Tabs) virão nesse estilo; confirmar em T1.3 que existem e que não trazem animações próprias conflitantes.
- **R9 — React Bits / Magic UI.** Muitos dependem de `motion` (framer-motion) e têm animação própria; risco de bundle (> 200 KB) e de conflito com a regra 5. Seleção em T1.3 deve filtrar isso; instalação real fica para a Fase 3.
- **R10 — SplitText.** Faz parte do pacote `gsap` 3.13+; registrar só se o arquiteto confirmar uso no Hero, para não pesar o bundle inicial antes da hora.
- **R11 — Kitchen sink vazando para produção.** Mitigado pela checagem de `dist/` em T1.12.

## Fora de escopo (Fase 1)

- Qualquer seção do site (Header, Hero, Especialidades… Footer) e o WhatsApp FAB — Fase 2.
- Animações reais (timeline do Hero, ScrollTrigger, SplitText aplicado) — Fase 3. Fase 1 só cria `src/lib/gsap.ts`.
- Instalação de componentes React Bits / Magic UI — Fase 3 (Fase 1 só seleciona).
- Instalação de Sheet/Accordion/Card/Tabs do shadcn — Fase 2.
- Meta tags, OG, JSON-LD, sitemap, robots, preload de fontes, otimização de imagens — Fase 4.
- Extração de paleta do logo oficial (pendente com a clínica).
- Deploy na Vercel — Fase 5.
- Preencher qualquer campo `TODO`/`pendente` de `clinica.ts` com valor inventado.
