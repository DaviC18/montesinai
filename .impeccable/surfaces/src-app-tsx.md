---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

## Scope

Single page (Fase 2, layout estático, sem animação). Mode: Persuade. Audience, positioning and constraints: PRODUCT.md. Tokens: docs/ARCHITECTURE.md § Design Tokens.

## Direction contract

THESIS: the page is a front-desk answer sheet. It asks "O que você precisa?" and answers it before anyone has to call. Refuses the clinic default of a hero photo over three icon cards.

OWN-WORLD: off-white paper ground, petróleo ink, verde-água only as rule and dot. Source Serif 4 headlines in plain roman, Libre Franklin body at 18px+. Answer tiles are full-width tap rows with a lucide icon, a serif label and an arrow; lists are ruled rows, not card grids. One dark petróleo band closes the page.

STORY: visitor sees that consultas, exames and laboratório share one address, finds their specialty, plan, hours or route in one tap, and leaves on WhatsApp with a message that already says what they want.

FIRST VIEWPORT: at 390px, open/closed badge, slogan in h1 serif, one line of support, the question, four answer tiles in a 2×2 grid (Consulta, Exame, Convênio, Como chegar), primary WhatsApp CTA below. At 1440px the slogan sits left over two columns, the tiles stack right as a ruled answer list.

FORM: structure 4 of 7, "Guia O que você precisa?" (dealt lead). seed:59d21b029ff437f0

SIGNATURE: every answer tile jumps to the section that answers it, and every section ends in a contextual WhatsApp action.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
