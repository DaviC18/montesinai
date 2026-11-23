import { createCn } from "cn/config";

// Tokens próprios do tema (src/index.css › @theme inline). Sem isto o merge trata
// `text-h2` como cor e o descarta ao lado de `text-primary`, por exemplo.
export const cn = createCn({
  extend: {
    theme: {
      text: ["h1", "h2", "h3", "h4"],
      tracking: ["display"],
      container: ["content", "texto"],
      shadow: ["soft", "raised"],
      spacing: ["gutter", "section", "header"],
    },
  },
});
