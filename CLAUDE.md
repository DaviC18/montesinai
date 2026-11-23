# CLAUDE.md — Site Clínica Monte Sinai

Single page institucional para a **Clínica Monte Sinai** (policlínica em Resende/RJ).
Objetivo de negócio: converter visitas (Google Maps / Instagram) em **agendamentos pelo WhatsApp**
e corrigir a percepção de "atendimento difícil" que derruba a nota da clínica no Google (3,0).

Leia SEMPRE antes de trabalhar:
- `docs/SPEC.md` — o que construir (fonte da verdade de requisitos)
- `docs/PLAN.md` — em que ordem construir e quem faz o quê
- `docs/ARCHITECTURE.md` — criado pelo arquiteto na Fase 1; contrato técnico
- `src/data/clinica.ts` — todo o conteúdo do site

## Stack (não trocar sem aprovação do usuário)
- Vite + React + TypeScript (strict). JS apenas em arquivos de config.
- Tailwind CSS
- shadcn/ui (componentes base) · React Bits · Magic UI (componentes visuais)
- GSAP + @gsap/react (`useGSAP`) — ÚNICO motor de animação de scroll/timeline
- lucide-react (ícones)
- Deploy: Vercel

## Skills (instaladas em `.claude/skills`)
Rodar `scripts/setup-skills.sh` uma vez. Usar:
- `design-taste-frontend` (Taste Skill) → direção visual. Dials: VARIANCE médio, MOTION médio, DENSITY baixo.
- `gsap-*` (oficiais GreenSock) → qualquer código GSAP. Para React, seguir `gsap-react`.
- `vercel-react-best-practices` → padrões React/performance.
- `web-design-guidelines` → revisão de UI/acessibilidade.
- `find-skills` → se surgir necessidade não coberta, buscar com `npx skills find <termo>` e PERGUNTAR antes de instalar.

## Subagentes (`.claude/agents/`)
| Agente | Papel | Escreve código? |
|---|---|---|
| `planejador` | Quebra a fase em tarefas pequenas e verificáveis | Não |
| `arquiteto` | Define estrutura, contratos, tokens, padrões de animação | Só docs/config |
| `validador` | Gate de qualidade: confere spec × entrega, aprova/reprova | Não |
| `desenvolvedor` | Implementa as tarefas aprovadas | Sim |
| `testador` | Build, lint, typecheck, testes, Lighthouse, responsivo | Só testes |

Fluxo por fase: **planejador → arquiteto → validador (gate de design) → desenvolvedor → testador → validador (gate final)**.
Use `/orquestrar <fase>` para rodar o ciclo.

## Regras invioláveis
1. Conteúdo vem SÓ de `src/data/clinica.ts`. Nada de texto de clínica hard-coded em componentes.
2. Campos marcados `// TODO: confirmar com a clínica` NÃO podem ser inventados nem "completados".
3. Proibido: "atendimento 24h", "emergência", convênios não confirmados, depoimentos inventados, fotos de médicos falsas.
4. GSAP só anima `transform` e `opacity`. Sempre `gsap.matchMedia()` com `prefers-reduced-motion`.
5. Componentes React Bits / Magic UI não podem ter animação de scroll própria concorrendo com GSAP.
6. Mobile-first. Fonte base ≥ 18px. Contraste WCAG AA.
7. Todo CTA de agendamento → `wa.me` com mensagem pré-preenchida (helper `buildWhatsAppLink`).
8. Ao terminar uma tarefa: `npm run typecheck && npm run lint && npm run build` precisam passar.
9. Commits pequenos, em português, formato `tipo(escopo): descrição`.

## Comandos
```bash
npm run dev        # dev server
npm run build      # build de produção
npm run preview    # serve o build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run test       # vitest
```
