#!/usr/bin/env bash
# Instala as skills do projeto em .claude/skills (Claude Code)
set -euo pipefail

# Descobridor de skills (Vercel)
npx -y skills add https://github.com/vercel-labs/skills --skill find-skills -a claude-code -y

# Taste Skill — direção visual
npx -y skills add leonxlnx/taste-skill --skill design-taste-frontend -a claude-code -y

# GSAP oficial (core, timeline, scrolltrigger, plugins, react, performance, utils...)
npx -y skills add greensock/gsap-skills -a claude-code -y

# Boas práticas React e diretrizes de UI (Vercel)
npx -y skills add vercel-labs/agent-skills --skill vercel-react-best-practices -a claude-code -y
npx -y skills add vercel-labs/agent-skills --skill web-design-guidelines -a claude-code -y

echo "Skills instaladas:"
npx -y skills ls -a claude-code
