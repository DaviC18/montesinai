import { buildWhatsAppLink, getMensagemWhatsApp } from "@/lib/whatsapp";

// Casos de borda adicionados pelo testador (Fase 1).
describe("whatsapp — bordas", () => {
  const textoDe = (url: string) => new URL(url).searchParams.get("text");

  it("emoji, #, + e % são codificados e voltam intactos", () => {
    const mensagem = "Oi 👋 #1 + 50% de dúvida";
    const url = buildWhatsAppLink({ mensagem, numero: "5511999999999" });
    expect(url).not.toMatch(/[ #+%](?![0-9A-F]{2})/u);
    expect(textoDe(url)).toBe(mensagem);
  });

  it("nome de especialidade com & não quebra a query", () => {
    const mensagem = getMensagemWhatsApp(
      { tipo: "especialidade", especialidade: "Ginecologia & Obstetrícia" },
      { padrao: "", especialidade: "Quero {especialidade}?", exames: "", duvidas: "" },
    );
    const url = buildWhatsAppLink({ mensagem, numero: "5511999999999" });
    expect([...new URL(url).searchParams.keys()]).toEqual(["text"]);
    expect(textoDe(url)).toBe("Quero Ginecologia & Obstetrícia?");
  });

  it("sempre começa com https://wa.me/ e só tem dígitos no caminho", () => {
    const url = buildWhatsAppLink({ mensagem: "x", numero: "+55 (24) 3181-1019" });
    expect(url).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  });
});
