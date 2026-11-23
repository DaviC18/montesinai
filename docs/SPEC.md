# SPEC — Site Clínica Monte Sinai

Versão 1.0 · 23/11/2026 · Autor: Davi Curty

## 1. Contexto
| Item | Valor |
|---|---|
| Cliente | Clínica Monte Sinai (policlínica + laboratório) |
| Endereço | R. Washington Luís, 120 – Vila Julieta, Resende – RJ, 27511-060 |
| Telefone / WhatsApp | (24) 3181-1019 |
| Horário | Seg–Sex 07:00–20:00 · Sáb 07:00–12:00 · Dom fechado (confirmar) |
| Redes | instagram.com/montesinairesende · facebook.com/montesinairesende |
| Site atual | Nenhum (só página automática do Google) |
| Google | Nota 3,0 (178 avaliações) |

### Problema
As avaliações elogiam médicos e exames, mas as reclamações se concentram em
**telefone (36 menções), WhatsApp (17), agendamento (9) e recepção (7)**.
Pacientes não conseguem informação nem marcar consulta com facilidade.

### Objetivo
1. Dar à clínica presença digital profissional que transmita confiança.
2. Responder sozinho às dúvidas mais comuns (especialidades, exames, convênios, horários, como chegar).
3. Levar o paciente ao WhatsApp já com a intenção clara (mensagem pronta) — preparando a entrada do ZapResponse.

### Público
Adultos e idosos de Resende e região (Itatiaia, Porto Real, Quatis), muitos acompanhando pais idosos.
Acesso majoritário via celular, vindo do Google Maps ou Instagram.

## 2. Escopo
### Dentro
- Single page responsiva com as seções da §4
- Botão flutuante de WhatsApp
- SEO local (meta, OG, JSON-LD MedicalClinic, sitemap, robots)
- Deploy na Vercel com domínio de preview

### Fora (v1)
- Agendamento online com agenda real, login, área do paciente, resultados de exames
- Blog, CMS, multilíngue
- Formulários que coletem dados pessoais

## 3. Identidade visual
- Tom: acolhedor, limpo, confiável. Nada "startup" ou exagerado.
- Paleta: extrair do logo do Instagram (TODO). Fallback: azul-petróleo (confiança) + verde-água (saúde) + off-white.
- Tipografia: 1 display humanista para títulos + 1 sans legível para texto (definida pelo arquiteto com a Taste Skill).
- Taste Skill dials: VARIANCE 5/10 · MOTION 4/10 · DENSITY 3/10.
- Slogan oficial: **"Especialidades médicas e cuidado em um só lugar."**
- Texto institucional (Facebook): "Com uma equipe completa de profissionais e atendimento humanizado, a Clínica Monte Sinai é referência em saúde na região."

## 4. Seções (ordem)
| # | Seção | Conteúdo | Animação (GSAP) | Componentes sugeridos |
|---|---|---|---|---|
| 0 | Header | Logo, âncoras, CTA "Agendar" | Fica sólido ao rolar | shadcn Sheet (menu mobile) |
| 1 | Hero | Slogan, subtítulo, 2 CTAs (Agendar WhatsApp / Ver especialidades), selo de horário "Aberto hoje até 20h" | Timeline de entrada + SplitText no título | React Bits (texto/fundo sutil) |
| 2 | Especialidades | Cards por especialidade, com médico(s) quando confirmado | Stagger no scroll | shadcn Card/Tabs, Magic UI (bento) |
| 3 | Exames & Laboratório | Lista de exames + "como se preparar" | Reveal no scroll | shadcn Accordion |
| 4 | Convênios | Grade de convênios + "Particular: PIX, dinheiro, transferência" | Fade/stagger | Magic UI Marquee (opcional) |
| 5 | Por que a Monte Sinai | 3–4 diferenciais (tudo num lugar, laboratório no local, equipe completa, localização central) | Contadores/reveal | React Bits |
| 6 | Como agendar | 3 passos: escolha a especialidade → chame no WhatsApp → confirme o horário | Linha de progresso com ScrollTrigger scrub | — |
| 7 | Localização & horário | Endereço, mapa (lazy), horários, botão "Como chegar" | Reveal | iframe Google Maps |
| 8 | FAQ | 6–8 perguntas (convênio, preparo de exame, documentos, acompanhante, estacionamento*) | — | shadcn Accordion |
| 9 | CTA final | Chamada forte para o WhatsApp | Reveal | — |
| 10 | Footer | Dados, redes, CNPJ*, responsável técnico*, aviso de privacidade | — | — |

`*` = confirmar com a clínica.

## 5. Requisitos funcionais
- RF01 Todo CTA de agendamento abre `https://wa.me/552431811019?text=<msg>` (número a confirmar), com mensagem contextual (ex.: especialidade clicada).
- RF02 Botão flutuante de WhatsApp visível após o hero, sem cobrir conteúdo no mobile.
- RF03 Selo "Aberto agora / Fechado" calculado pelo horário de America/Sao_Paulo a partir de `clinica.ts`.
- RF04 Navegação por âncoras com scroll suave e offset do header.
- RF05 "Como chegar" abre o Google Maps com o endereço.
- RF06 Telefone clicável (`tel:`).

## 6. Requisitos não funcionais
| Requisito | Meta |
|---|---|
| Lighthouse mobile | Performance ≥ 90 · A11y ≥ 95 · Best Practices ≥ 95 · SEO = 100 |
| LCP | < 2,5 s em 4G |
| CLS | < 0,1 |
| Bundle JS inicial | < 200 KB gzip |
| Acessibilidade | WCAG 2.1 AA, navegação por teclado, foco visível, `prefers-reduced-motion` |
| Fonte base | ≥ 18 px |
| Breakpoints testados | 360, 390, 768, 1024, 1440 px |
| Navegadores | Chrome, Safari iOS, Samsung Internet, Firefox (últimas 2 versões) |

## 7. SEO local
- `<title>`: "Clínica Monte Sinai em Resende/RJ | Especialidades, Exames e Laboratório"
- Meta description com especialidades + bairro + "agende pelo WhatsApp"
- JSON-LD `MedicalClinic` (nome, endereço, geo, telefone, openingHours, sameAs redes)
- Open Graph com imagem 1200×630
- `sitemap.xml`, `robots.txt`, `lang="pt-BR"`

## 8. Restrições de conteúdo (compliance)
- Não prometer resultados, não usar "melhor clínica", não citar preços sem autorização (CFM/publicidade médica).
- Não publicar nome/CRM de médico sem confirmação da clínica.
- Não usar depoimentos de pacientes sem autorização.
- Não afirmar "24h" ou "emergência".

## 9. Critérios de aceite (Definition of Done)
- [ ] Todas as seções da §4 implementadas a partir de `clinica.ts`
- [ ] RF01–RF06 funcionando
- [ ] Metas da §6 atingidas (relatório do testador anexado)
- [ ] `typecheck`, `lint`, `test`, `build` sem erros
- [ ] Nenhum `TODO: confirmar` exibido como fato no site (placeholders ocultos ou marcados)
- [ ] Animações desativadas com reduced motion
- [ ] Deploy de preview na Vercel funcionando
- [ ] Aprovação final do `validador`
