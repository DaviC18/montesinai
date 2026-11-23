# Kit Claude Code — Site Clínica Monte Sinai

## Como usar
1. Descompacte este kit na pasta onde o projeto vai ficar.
2. Abra o Claude Code nessa pasta.
3. Rode a Fase 0 (ela cria o projeto Vite e instala as skills):
   ```
   /orquestrar 0
   ```
   Se preferir instalar as skills antes, à mão: `bash scripts/setup-skills.sh`
4. Revise o resumo, depois siga: `/orquestrar 1`, `/orquestrar 2`… até a 5.

## O que tem aqui
```
CLAUDE.md                     regras do projeto (o Claude Code lê sozinho)
docs/SPEC.md                  o que construir
docs/PLAN.md                  fases, fluxo e pendências com o cliente
docs/ARCHITECTURE.md          contrato técnico (preenchido pelo arquiteto)
.claude/agents/               planejador, arquiteto, validador, desenvolvedor, testador
.claude/commands/orquestrar.md  comando /orquestrar <fase>
src/data/clinica.ts           conteúdo da clínica (com TODOs a confirmar)
scripts/setup-skills.sh       instala Taste Skill, GSAP Skills, find-skills e skills Vercel
```

## Reaproveitar para outro cliente
Troque `src/data/clinica.ts`, a seção 1 e 3 da SPEC e os tokens de cor — o resto do fluxo continua igual.
