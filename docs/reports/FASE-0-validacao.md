# FASE 0 — Validação

Data: 23/11/2026 · Modo: gate final · Executado manualmente (agentes ainda não existiam no início da fase)

**Veredito: APROVADO**

| Item (PLAN Fase 0)                                   | Status | Evidência                                                                   |
| ---------------------------------------------------- | ------ | --------------------------------------------------------------------------- |
| Vite `react-ts`, TS strict, alias `@/`               | ok     | `tsconfig.app.json` (`strict`, `paths`), `vite.config.ts` (`resolve.alias`) |
| Tailwind + shadcn init                               | ok     | `src/index.css`, `components.json`                                          |
| GSAP + `@gsap/react`, lucide-react                   | ok     | `package.json`                                                              |
| ESLint + Prettier, Vitest + Testing Library          | ok     | `eslint.config.js`, `.prettierrc.json`, `src/test/setup.ts`                 |
| Scripts `typecheck`, `lint`, `test`                  | ok     | `package.json`                                                              |
| `scripts/setup-skills.sh`                            | ok     | skills em `.claude/skills`                                                  |
| `src/data/clinica.ts`                                | ok     | presente                                                                    |
| Subagentes + `/orquestrar`                           | ok     | `.claude/agents/*.md`, `.claude/commands/orquestrar.md`                     |
| `typecheck`, `lint`, `test`, `build`, `format:check` | ok     | todos sem erro; JS inicial 70 KB gzip                                       |

Observação: tokens de cor ainda são os neutros do shadcn; definição fica para a Fase 1.
