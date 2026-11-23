# FASE 1 — Validação

## Gate de design

Data: 23/11/2026 · Modo: gate de design · Escopo: `docs/tasks/FASE-1.md` (T1.1–T1.13), `docs/ARCHITECTURE.md`, tokens em `src/index.css`, contra `docs/SPEC.md`, `docs/PLAN.md` (Fase 1) e `CLAUDE.md`.

Decisões do usuário consideradas requisito (não falha): sábado `pendente` com selo oculto (estado `indefinido`); domingo fechado; textos novos `clinica.whatsapp.mensagens` e `clinica.ui.selo`; agentes não fazem commit.

**Veredito: APROVADO**

### Cobertura da meta da fase (PLAN Fase 1)

| Item                                                            | Status | Evidência                                                                                                               |
| --------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------- |
| ARCHITECTURE: estrutura de pastas, tipos, padrões GSAP, tokens  | ok     | `docs/ARCHITECTURE.md:6-75` (Estrutura), `:76-255` (Tipos), `:257-380` (Tokens), `:382-459` (GSAP); nenhuma seção vazia |
| Paleta, tipografia, espaço, raio, sombra em CSS vars            | ok     | `src/index.css:10-142`; tabela `docs/ARCHITECTURE.md:265-294` bate 1:1 com `:root` (`src/index.css:98-142`)             |
| `src/lib/gsap.ts` (plugins + matchMedia padrão)                 | ok     | API exata em `docs/ARCHITECTURE.md:386-408`; T1.8                                                                       |
| `whatsapp.ts` / `horario.ts` com testes                         | ok     | Assinaturas `docs/ARCHITECTURE.md:136-198`; casos de teste em T1.6, T1.7 e `docs/ARCHITECTURE.md:565`                   |
| Componentes base `Section`, `Container`, `Heading`, `CTAButton` | ok     | Props e classes em `docs/ARCHITECTURE.md:202-255`; T1.9–T1.11                                                           |
| Kitchen sink + aceite verificável                               | ok     | T1.12; ADR-003 `docs/ARCHITECTURE.md:508-522`                                                                           |

### Checklist fixo

| #   | Item                                                         | Status | Evidência                                                                                                                                                                                                                                                                  |
| --- | ------------------------------------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Texto da clínica só em `clinica.ts`                          | ok     | Primitivos nunca importam `clinica` e recebem texto por props (`ARCHITECTURE.md:57-59`); libs leem `clinica` só como default de parâmetro; T1.6/T1.9/T1.11 exigem "sem texto de clínica"                                                                                   |
| 2   | `pendente` / TODO não exibido como fato                      | ok     | Contrato de exibição `ARCHITECTURE.md:61-74`; ADR-004 (sábado ⇒ `indefinido`, selo retorna `null`) `:524-526`; TODOs de `clinica.ts` mantidos (`:93`)                                                                                                                      |
| 3   | Sem "24h", "emergência", "melhor clínica", preço, depoimento | ok     | grep em `docs/ARCHITECTURE.md`, `docs/tasks/FASE-1.md`, `src`: só ocorrências de formato de hora (`:85-86`) e de proibição (`:122`, `:534`). Mensagens WhatsApp neutras (`:114-117`); sem contador de números inventados (`:484`)                                          |
| 4   | GSAP só transform/opacity, `useGSAP`, matchMedia + reduced   | ok     | Regras 1–3 `ARCHITECTURE.md:448-450` (lista explícita permitida/proibida); `MOTION_CONDITIONS.reduce` `:394-399`; padrão com `useGSAP({ scope })` + `gsap.matchMedia()` `:416-444`; header sólido via opacidade de camada (`:452`); import único via `@/lib/gsap` (`:410`) |
| 4b  | Terceiros sem animação de scroll própria                     | ok     | Tabela `ARCHITECTURE.md:478-482` (dependências, scroll próprio = Não, custo gzip); rejeitados com `motion`/IntersectionObserver/WebGL `:484`; ADR-010; shadcn Sheet/Accordion com `motion-reduce:*` `:465-470`                                                             |
| 5   | CTAs usam `buildWhatsAppLink`                                | ok     | `CTAButton` `href = buildWhatsAppLink({ mensagem: getMensagemWhatsApp(contexto) })` `ARCHITECTURE.md:237`; número de `contato.whatsappE164` (`:155`)                                                                                                                       |
| 6a  | Fonte base ≥ 18px                                            | ok     | ADR-009 `html { font-size: 112.5% }` ⇒ 1rem = 18px (`ARCHITECTURE.md:343`, `:544-546`); `--text-base: 1rem` (`src/index.css:17`); `text-sm` proibido em botão/nav/FAQ/corpo                                                                                                |
| 6b  | Contraste AA                                                 | ok     | 29 pares em `ARCHITECTURE.md:300-330` recalculados pelo validador (fórmula WCAG 2.1): todos os valores conferem a 0,01; texto ≥ 4,5:1, UI/foco ≥ 3:1; pares proibidos documentados (`:332`)                                                                                |
| 6c  | Foco visível                                                 | ok     | `:focus-visible { outline: 3px solid var(--ring); outline-offset: 2px }` (`ARCHITECTURE.md:562`); CTA com `ring-offset-2` e variante inverse (`:242-243`)                                                                                                                  |
| 6d  | Mobile-first / sem rolagem horizontal                        | ok     | Escalas `clamp()` 360→1440 (`ARCHITECTURE.md:345-352`); T1.12 exige 360px e 1440px sem rolagem horizontal; área de toque `min-h-11` (≥ 44px)                                                                                                                               |
| 7   | `typecheck`, `lint`, `test`, `build`, `format:check`         | ok     | Rodados pelo validador em 23/11/2026: todos exit 0; 1 teste (smoke) passou; build JS `222.99 kB │ gzip: 70.27 kB`                                                                                                                                                          |

### Pontos específicos pedidos

| Ponto                                        | Status | Evidência                                                                                                                                                                                                                                       |
| -------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T1.4–T1.13 implementáveis sem ambiguidade    | ok     | "Instruções para o desenvolvedor" `ARCHITECTURE.md:552-571` dão comando, arquivo e conteúdo por tarefa; cada tarefa em `FASE-1.md` tem "Pronto quando" verificável                                                                              |
| `whatsapp.ts` testável                       | ok     | Funções puras, `numero`/`mensagens` injetáveis, regra de vazio ⇒ sem `?text=` (`ARCHITECTURE.md:147-159`)                                                                                                                                       |
| `horario.ts` testável e independente de fuso | ok     | `now` injetável, `Intl.DateTimeFormat` com `timeZone` e `hourCycle: "h23"` (`:182`, `:565`); regra em 3 passos (`:185-190`); `fecha` exclusivo (`:86`); casos limite e `TZ=UTC`/`TZ=Asia/Tokyo` no aceite (`FASE-1.md` critério 3)              |
| `gsap.ts` testável                           | ok     | Teste de import em jsdom + constantes + plugin registrado (`ARCHITECTURE.md:566`)                                                                                                                                                               |
| Kitchen sink fora do build                   | ok     | `import.meta.env.DEV` + `lazy(import())` no ramo morto; verificação `grep -ri "kitchen" dist/` (`ARCHITECTURE.md:510-522`). Validador conferiu por probe `tsc` que `let Root: ComponentType = App; Root = lazy(...)` tipa sem erro em TS strict |
| Nada de conteúdo inventado                   | ok     | Só textos aprovados pelo usuário (`whatsapp.mensagens`) e rótulos vindos da SPEC (`ui.selo`: "Aberto agora", "Aberto hoje até {hora}", "Fechado")                                                                                               |
| Estado atual de `src/index.css`              | ok     | Tokens aplicados pelo arquiteto; Geist ainda importado e `html` ainda sem 112.5%: esperado, são T1.4 e T1.5                                                                                                                                     |

### Observações (não bloqueiam; desenvolvedor deve seguir)

1. **ADR-007 × lint (Fase 2).** `eslint-plugin-react-hooks` 7.1.1 ativa `react-hooks/set-state-in-effect`. Probe do validador: `useEffect(() => { setS(...) }, [])` falha o lint; o padrão `const tick = () => setS(...); tick(); const id = setInterval(tick, 60000); return () => clearInterval(id);` passa. Usar este padrão (ou `useSyncExternalStore`) ao consumir `getStatusHorario` no Hero/Localização. Responsável: desenvolvedor (Fase 2).
2. **Exemplo GSAP** (`ARCHITECTURE.md:418`): o import não inclui `type MotionConditions`, usado na linha 427. Ao copiar, importar o tipo. Responsável: desenvolvedor.
3. **Grep de T1.8** (`FASE-1.md`) não pega `@gsap/react`. O ARCHITECTURE (`:410`) é mais estrito e vale: no gate final o validador vai checar `grep -rnE "from \"(gsap|@gsap/)" src` ⇒ só `src/lib/gsap.ts`.
4. **`HorarioBadge`** (criado em T1.12) não tem teste exigido. Recomendado `HorarioBadge.test.tsx` cobrindo `indefinido` ⇒ nada no DOM, `null` ⇒ nada, `ate` ⇒ "20h". Responsável: desenvolvedor.
5. **Peso 600 no h4** (`ARCHITECTURE.md:224`): aplicar pelo `size` visual (`size="h4"`), não pelo `level`.
6. **Textos da Fase 2 ainda inexistentes em `clinica.ts`**: rótulos de CTA, marcação "a confirmar" do sábado, CTA de exames e de convênios (`ARCHITECTURE.md:68-70`, `:235`). Antes da Fase 2, o planejador/arquiteto deve listar esses textos e obter aprovação do usuário. Não inventar. No kitchen sink, rótulos de dev são permitidos (T1.12).

## Gate final

Data: 23/11/2026 · Modo: gate final · Escopo: código entregue × `docs/tasks/FASE-1.md` (T1.1–T1.13), `docs/ARCHITECTURE.md`, `docs/SPEC.md`, `CLAUDE.md`, `docs/reports/FASE-1-teste.md`.

Decisões do usuário consideradas requisito: sábado `pendente` ⇒ selo oculto (`indefinido`); domingo fechado; textos `clinica.whatsapp.mensagens` e `clinica.ui.selo`; agentes não rodam git.

**Veredito: REPROVADO** (1 falha de aceite: `format:check`; 1 desvio de contrato sem registro no ARCHITECTURE). O código das tarefas T1.4–T1.12 está conforme.

### Comandos rodados pelo validador

| Comando                                                              | Status    | Evidência                                                                                                                                                                                                                                       |
| -------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`                                                  | ok        | exit 0                                                                                                                                                                                                                                          |
| `npm run lint`                                                       | ok        | exit 0, sem avisos                                                                                                                                                                                                                              |
| `npm run test`                                                       | ok        | `Test Files 13 passed (13)` · `Tests 71 passed (71)`                                                                                                                                                                                            |
| `TZ=UTC npx vitest run` / `TZ=Asia/Tokyo npx vitest run`             | ok        | `Tests 71 passed (71)` nos dois                                                                                                                                                                                                                 |
| `npm run build`                                                      | ok        | `dist/assets/index-DnLVp-Fz.js 223.54 kB │ gzip: 70.44 kB` (< 200 KB gzip); 1 único chunk JS                                                                                                                                                    |
| `npm run format:check`                                               | **falha** | `[warn] docs/reports/FASE-1-teste.md` · `Code style issues found in the above file.` (tabela sem alinhamento do Prettier). O relatório do testador (item 7) afirma "All matched files use Prettier code style!": não confere com o estado atual |
| `grep -rnE "from ['\"](gsap\|@gsap/)" src` fora de `src/lib/gsap.ts` | ok        | vazio                                                                                                                                                                                                                                           |
| `grep -ri kitchen dist/`                                             | ok        | vazio                                                                                                                                                                                                                                           |
| `grep -rl "googleapis\|gstatic" dist src index.html`                 | ok        | vazio                                                                                                                                                                                                                                           |
| `ls tailwind.config.*`                                               | ok        | inexistente (Tailwind v4 CSS-first)                                                                                                                                                                                                             |

### Tarefas

| Tarefa                                    | Status    | Evidência                                                                                                                                                                                                              |
| ----------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T1.4 Fontes self-hosted                   | ok        | `package.json`: `@fontsource-variable/libre-franklin`, `@fontsource-variable/source-serif-4`; Geist ausente; woff2 das duas em `dist/assets`                                                                           |
| T1.5 Tokens CSS                           | ok        | `src/index.css:150-152` `html { font-size: 112.5% }`; `:focus-visible` 3px `--ring` `src/index.css:169-172`; smooth scroll só em `no-preference` `:155-159`                                                            |
| T1.6 `whatsapp.ts`                        | ok        | `src/lib/whatsapp.ts`: número default de `clinica.contato.whatsappE164`, `encodeURIComponent`, mensagens de `clinica.whatsapp.mensagens`; sem texto literal                                                            |
| T1.7 `horario.ts`                         | ok        | `Intl.DateTimeFormat` + `timeZone` + `hourCycle: "h23"`; regra pendente ⇒ `indefinido` (`src/lib/horario.ts:76-85`); `isOpenNow` ⇒ `null` (`:89`); sábado `pendente: true` com TODO mantido (`src/data/clinica.ts:86`) |
| T1.8 `gsap.ts`                            | ok        | `src/lib/gsap.ts`: `registerPlugin(ScrollTrigger, useGSAP)`, `MOTION_CONDITIONS.reduce`; único importador                                                                                                              |
| T1.9 `Container`/`Section`                | ok        | `scroll-mt-header`, `py-section`, `px-gutter`, `max-w-content`; sem texto de clínica                                                                                                                                   |
| T1.10 `Heading`                           | ok        | `level` × `size` independentes; peso 600 só via `size="h4"`; testes cobrem                                                                                                                                             |
| T1.11 `CTAButton`                         | ok        | `href = buildWhatsAppLink(...)` `src/components/base/CTAButton.tsx:54`; `target`/`rel` fixos e não sobrescrevíveis (props espalhadas antes); `min-h-11`; ícone `aria-hidden`                                           |
| T1.12 Kitchen sink                        | ok        | `src/main.tsx:8-12` ramo `import.meta.env.DEV`; `dist/` sem rastro; textos da clínica vêm de `clinica` (`nome`, `descricao`, `ui.selo`); rótulos "(demo)" de dev permitidos                                            |
| T1.13 Fechamento                          | **falha** | `format:check` falha (ver acima)                                                                                                                                                                                       |
| Critério 6 (`App.tsx` sem seções)         | ok        | `src/App.tsx` só renderiza `clinica.nome`                                                                                                                                                                              |
| `HorarioBadge` (obs. 4 do gate de design) | ok        | `src/components/base/HorarioBadge.test.tsx` cobre `indefinido`, `null`, `ate` ⇒ "20h"                                                                                                                                  |

### Checklist fixo

| #   | Item                                                                                  | Status | Evidência                                                                                                                                                                                                                      |
| --- | ------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Texto da clínica só em `clinica.ts`                                                   | ok     | Leitura de `src/components/base/*.tsx`: nenhum texto de clínica; rótulos/mensagens por props ou `clinica.*`                                                                                                                    |
| 2   | `pendente`/TODO não exibido como fato                                                 | ok     | Sábado ⇒ `HorarioBadge` retorna `null` (`HorarioBadge.tsx:21`); convênios/médicos/FAQ pendentes não renderizados em nenhum componente                                                                                          |
| 3   | Sem "24h", "emergência", "melhor clínica", preço, depoimento, convênio não confirmado | ok     | grep em `src` e `dist`: "24h" só em comentário de formato (`clinica.ts:9-10`); convênios só como dado `pendente: true` (`clinica.ts:146-150`), não exibidos                                                                    |
| 4   | GSAP só transform/opacity, `useGSAP`, matchMedia + reduce                             | ok     | Nenhuma animação GSAP nesta fase; `src/lib/gsap.ts` expõe `useGSAP` e `MOTION_CONDITIONS.reduce`                                                                                                                               |
| 5   | CTAs usam `buildWhatsAppLink`                                                         | ok     | `CTAButton.tsx:54`; teste `CTAButton.edge.test.tsx` garante `href` não sobrescrevível                                                                                                                                          |
| 6   | Mobile-first, base ≥ 18px, foco visível, AA                                           | ok     | 1rem = 18px; foco global + `focus-visible:ring-3` no CTA; contraste: testador mediu 14 pares AA (menor 4,98:1) e o gate de design recalculou 29 pares; sem rolagem horizontal 360–1440 (relatório do testador, itens 13/17/21) |
| 7   | typecheck · lint · test · build                                                       | ok     | todos exit 0 (tabela de comandos). `format:check` falha — critério 2 da fase                                                                                                                                                   |

### Revisão `web-design-guidelines` (arquivos da fase)

- `src/components/ui/button.tsx:6` — `transition-all` herdado pelo `CTAButton` (regra "Never `transition: all`") e `active:translate-y-px` sem variante `motion-reduce`. Não bloqueia (1px, sem GSAP, cor/anel), mas corrigir na Fase 2 em `CTAButton` (`base`, `CTAButton.tsx:22`) com `transition-[background-color,box-shadow,color] motion-reduce:transition-none motion-reduce:active:translate-y-0`, sem editar `ui/button.tsx`.
- Skip link e `<header>` sticky ainda inexistentes: escopo da Fase 2 (Header).
- CTA abre nova aba sem aviso para leitor de tela: recomendado na Fase 2 incluir texto acessível (vindo de `clinica.ts`) indicando "abre o WhatsApp".

### Desvios declarados pelo desenvolvedor

| #   | Desvio                                                                                              | Parecer                                                                                                                                                                                                    | Evidência                                                                                                    |
| --- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | `cn` via `createCn` (pacote `cn`, shadcn-ui) com tokens do tema                                     | Aceito. Corrige bug real (`text-h2` descartado junto de `text-primary`); dependência `cn` já fazia parte do scaffold shadcn; testado                                                                       | `src/lib/utils.ts:1-16`; `src/lib/utils.test.ts`; `Heading.test.tsx` "className de cor não remove o tamanho" |
| 2   | `main.tsx` com `const Root = DEV && ... ? lazy(...) : App` + `eslint-disable-next-line` justificado | Aceito no código (mesmo efeito: ramo morto eliminado; `grep -ri kitchen dist/` vazio). **Exige** atualizar ADR-003, que ainda mostra o `let` (`docs/ARCHITECTURE.md:512-518`) — contrato e código divergem | `src/main.tsx:6-12`                                                                                          |
| 3   | Stub de `window.matchMedia` em `src/test/setup.ts`                                                  | Aceito. Só em teste, guardado por `typeof ... !== "function"`, `matches: false` documentado                                                                                                                | `src/test/setup.ts:3-20`                                                                                     |
| 4a  | Transição CSS 150 ms sob reduced motion                                                             | Não bloqueia (ver revisão acima); corrigir na Fase 2                                                                                                                                                       | `src/components/ui/button.tsx:6`                                                                             |
| 4b  | ~133 KB de woff2 não latinos em `dist/`                                                             | Não bloqueia (não baixados; `unicode-range`). Tratar na Fase 4 (subset/preload)                                                                                                                            | saída do `vite build`                                                                                        |

### Correções obrigatórias

1. Formatar `docs/reports/FASE-1-teste.md` com Prettier (`npx prettier --write docs/reports/FASE-1-teste.md`), corrigir o item 7 do relatório para refletir a execução real e rodar `npm run format:check` até "All matched files use Prettier code style!". **Responsável: testador.**
2. Atualizar ADR-003 em `docs/ARCHITECTURE.md:512-518` para a forma implementada (`const Root = ... ? lazy(...) : App` com o `eslint-disable-next-line react-refresh/only-export-components` e a justificativa) e registrar em `docs/ARCHITECTURE.md` (Estrutura › `utils.ts`) que `cn` usa `createCn` com os tokens do tema, a estender sempre que surgir token novo de texto/espaço/sombra. Depois, `npm run format:check`. **Responsável: arquiteto.**

Após 1 e 2, o validador re-roda `npm run format:check` e confere o ADR-003; nenhum código precisa mudar.

### Recomendações (não bloqueiam; Fase 2)

- `CTAButton`: transições explícitas + `motion-reduce:*` (ver revisão). Responsável: desenvolvedor.
- Texto acessível de "abre o WhatsApp em nova aba" vindo de `clinica.ts` (precisa aprovação do usuário, obs. 6 do gate de design). Responsável: planejador/arquiteto.

## Gate final — revalidação

Data: 23/11/2026 · Modo: gate final (volta 1) · Escopo: as 2 correções obrigatórias do gate final. Código não mudou desde o gate final.

**Veredito: APROVADO**

| Item                                                                                         | Status          | Evidência                                                                                                                                                                                            |
| -------------------------------------------------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck && npm run lint && npm run test && npm run build && npm run format:check` | ok              | exit 0; `Tests 71 passed (71)`; `index-DnLVp-Fz.js 223.54 kB │ gzip: 70.44 kB`; "All matched files use Prettier code style!"                                                                         |
| Correção 1: relatório do testador formatado e item 7 corrigido                               | ok              | `docs/reports/FASE-1-teste.md:17` registra a falha inicial, o `prettier --write` e a re-execução; `format:check` passa                                                                               |
| Correção 2a: ADR-003 igual a `src/main.tsx`                                                  | ok              | `docs/ARCHITECTURE.md:508-528` usa `const Root: ComponentType = ... ? lazy(...) : App` com `eslint-disable-next-line react-refresh/only-export-components` e a justificativa (vale só em `main.tsx`) |
| Correção 2b: `cn` via `createCn` documentado                                                 | ok              | ADR-011 `docs/ARCHITECTURE.md:530+` (tabela de grupos/tokens); árvore `:18`                                                                                                                          |
| Recomendação de reduced motion do `CTAButton`                                                | ok (registrada) | "Instruções para o desenvolvedor" `docs/ARCHITECTURE.md:593`: `motion-reduce:transition-none` + `motion-reduce:active:translate-y-0`, com teste, sem editar `ui/button.tsx` (Fase 2)                 |
| Kitchen sink fora do build                                                                   | ok              | `grep -ri kitchen dist/` vazio                                                                                                                                                                       |

Checklist fixo inalterado desde o gate final (itens 1–7 ok). Fase 1 liberada.
