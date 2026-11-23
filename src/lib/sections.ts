/** IDs de âncora das seções (RF04). Header, Hero e seções usam só estes. */
export const SECTION_IDS = {
  inicio: "inicio",
  especialidades: "especialidades",
  exames: "exames",
  convenios: "convenios",
  diferenciais: "diferenciais",
  comoAgendar: "como-agendar",
  localizacao: "localizacao",
  faq: "faq",
  contato: "contato",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

/** "#especialidades" a partir do id. */
export function hrefSecao(id: string): string {
  return `#${id}`;
}
