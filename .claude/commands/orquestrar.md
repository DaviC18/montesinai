---
description: Roda o ciclo completo de uma fase (planejador → arquiteto → validador → desenvolvedor → testador → validador)
argument-hint: <número da fase 0-5>
---

Orquestre a **Fase $ARGUMENTS** do `docs/PLAN.md` usando os subagentes de `.claude/agents/`.

## Pré-condições
1. Leia `CLAUDE.md` e `docs/PLAN.md`.
2. Se `$ARGUMENTS` > 0, confira que `docs/reports/FASE-<anterior>-validacao.md` termina em **APROVADO**. Se não, pare e avise.

## Ciclo
Rode em sequência, passando a cada agente o número da fase e o resultado do anterior:

1. **planejador** → gera `docs/tasks/FASE-$ARGUMENTS.md`.
2. **arquiteto** → atualiza `docs/ARCHITECTURE.md` e tokens/config da fase.
3. **validador** (modo *gate de design*). REPROVADO → volte ao passo 1 ou 2 com as correções (máx. 2 voltas; depois pare e pergunte ao usuário).
4. **desenvolvedor** → implementa as tarefas (sem commits; quem commita é o usuário).
5. **testador** → gera `docs/reports/FASE-$ARGUMENTS-teste.md`.
6. **validador** (modo *gate final*). REPROVADO → desenvolvedor corrige → testador → validador (máx. 3 voltas; depois pare e pergunte).

## Regras
- Não pule etapas nem rode agentes em paralelo.
- Dúvida de conteúdo da clínica ou de troca de stack → pergunte ao usuário, não decida.
- Entre etapas, mostre ao usuário 1 linha de status.

## Ao final
Resumo para o usuário: veredito, tarefas entregues, arquivos alterados, sugestão de mensagem de commit (`tipo(escopo): descrição`, em português), metas atingidas/falhas, pendências com o cliente que afetaram a fase.
