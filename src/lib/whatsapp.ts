import { clinica, type MensagensWhatsApp } from "@/data/clinica";

export type ContextoWhatsApp =
  | { tipo: "padrao" }
  | { tipo: "especialidade"; especialidade: string } // Especialidade.nome
  | { tipo: "exames" }
  | { tipo: "duvidas" };

/** Resolve o texto a partir de clinica.whatsapp.mensagens; substitui {especialidade}. */
export function getMensagemWhatsApp(
  contexto: ContextoWhatsApp,
  mensagens: MensagensWhatsApp = clinica.whatsapp.mensagens,
): string {
  switch (contexto.tipo) {
    case "especialidade":
      return mensagens.especialidade.replaceAll("{especialidade}", contexto.especialidade);
    case "exames":
      return mensagens.exames;
    case "duvidas":
      return mensagens.duvidas;
    case "padrao":
      return mensagens.padrao;
  }
}

/**
 * Monta `https://wa.me/<numero>?text=<encodeURIComponent(mensagem)>`.
 * - `numero`: só dígitos, default clinica.contato.whatsappE164 (remove tudo que não for dígito).
 * - `mensagem` vazia/ausente ⇒ URL sem `?text=`.
 * Pura; sem efeitos; sem texto literal de clínica.
 */
export function buildWhatsAppLink(options: { mensagem?: string; numero?: string } = {}): string {
  const { mensagem, numero = clinica.contato.whatsappE164 } = options;
  const base = `https://wa.me/${numero.replace(/\D/g, "")}`;
  if (!mensagem) return base;
  return `${base}?text=${encodeURIComponent(mensagem)}`;
}
