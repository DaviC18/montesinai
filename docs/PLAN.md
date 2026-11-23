# PLAN — Execução por fases

Cada fase roda o ciclo:

```
planejador ──► arquiteto ──► validador (gate de design)
                                   │ aprovado
                                   ▼
                            desenvolvedor ──► testador ──► validador (gate final)
                                   ▲                              │ reprovado
                                   └──────────── correções ◄──────┘
```

Artefatos de controle (criados pelos agentes):
- `docs/tasks/FASE-N.md` — tarefas da fase (planejador)
- `docs/ARCHITECTURE.md` — contratos técnicos (arquiteto)
- `docs/reports/FASE-N-teste.md` — resultados de testes (testador)
- `docs/reports/FASE-N-validacao.md` — parecer APROVADO/REPROVADO (validador)

Regra: nenhuma fase começa sem a anterior estar **APROVADA** pelo validador.

---

## Fase 0 — Setup
**Meta:** projeto rodando com a stack e as skills.
- Vite `react-ts`, TS strict, alias `@/`
- Tailwind + `npx shadcn@latest init`
- GSAP + `@gsap/react`, lucide-react
- ESLint + Prettier, Vitest + Testing Library
- Scripts `typecheck`, `lint`, `test`
- `scripts/setup-skills.sh`
- Copiar `src/data/clinica.ts` do kit
**Aceite:** `npm run dev` abre página em branco estilizada; todos os scripts passam.

## Fase 1 — Arquitetura e design system
**Meta:** contrato técnico e visual antes de qualquer seção.
- Arquiteto escreve `docs/ARCHITECTURE.md` (estrutura de pastas, tipos, padrões GSAP, tokens)
- Taste Skill define paleta, tipografia, espaçamento, raio, sombras → `tailwind` theme / CSS vars
- `src/lib/gsap.ts` (registro de plugins + matchMedia padrão)
- `src/lib/whatsapp.ts` (`buildWhatsAppLink`) e `src/lib/horario.ts` (`isOpenNow`) com testes
- Componentes base: `Section`, `Container`, `Heading`, `CTAButton`
**Aceite:** página "kitchen sink" mostrando tokens e componentes base; testes de libs passando.

## Fase 2 — Layout estático (sem animação)
**Meta:** todas as seções da SPEC §4 renderizando conteúdo real de `clinica.ts`.
- Header + menu mobile, Hero, Especialidades, Exames, Convênios, Diferenciais,
  Como agendar, Localização, FAQ, CTA final, Footer, WhatsApp FAB
**Aceite:** site completo e responsivo em 360–1440 px, sem animação; a11y básica ok.

## Fase 3 — Animações (GSAP)
**Meta:** camada de movimento seguindo as GSAP Skills.
- Timeline do hero (+ SplitText)
- ScrollTrigger: reveals/stagger por seção, linha de progresso do "Como agendar", header sólido
- Componentes React Bits/Magic UI selecionados na Fase 1
- `prefers-reduced-motion` desliga tudo
**Aceite:** 60fps no mobile médio; CLS < 0,1; reduced motion verificado.

## Fase 4 — SEO, performance e acessibilidade
- Meta tags, OG image, JSON-LD MedicalClinic, sitemap, robots
- Imagens WebP/AVIF, lazy load, mapa lazy, preload de fontes
- Code-split de componentes pesados
**Aceite:** metas Lighthouse da SPEC §6.

## Fase 5 — QA final e deploy
- Testes cross-browser e breakpoints
- Revisão de conteúdo: nenhum TODO exposto, compliance §8
- Deploy de preview na Vercel
**Aceite:** checklist DoD da SPEC §9 completo + validador APROVADO.

---

## Pendências com o cliente (bloqueiam publicação, não o desenvolvimento)
- [ ] Logo em alta e cores oficiais
- [ ] Lista final de especialidades e médicos (com autorização para nome/CRM)
- [ ] Lista de exames do laboratório
- [ ] Convênios aceitos hoje
- [ ] Número de WhatsApp oficial de agendamento
- [ ] Fotos reais (fachada, recepção, consultórios)
- [ ] CNPJ e responsável técnico (rodapé)
- [ ] Estacionamento / acessibilidade do prédio
