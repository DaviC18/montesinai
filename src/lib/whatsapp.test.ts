import { clinica, type MensagensWhatsApp } from "@/data/clinica";
import { buildWhatsAppLink, getMensagemWhatsApp } from "@/lib/whatsapp";

const textoDe = (url: string) => new URL(url).searchParams.get("text");

describe("buildWhatsAppLink", () => {
  it("usa o número de clinica.contato.whatsappE164 por padrão", () => {
    expect(buildWhatsAppLink()).toBe(`https://wa.me/${clinica.contato.whatsappE164}`);
  });

  it("sem mensagem (ou vazia) não adiciona ?text=", () => {
    expect(buildWhatsAppLink({ mensagem: "" })).not.toContain("?text=");
    expect(buildWhatsAppLink({ numero: "5511999999999" })).toBe("https://wa.me/5511999999999");
  });

  it("remove tudo que não for dígito do número", () => {
    expect(buildWhatsAppLink({ numero: "+55 (24) 3181-1019" })).toBe("https://wa.me/552431811019");
  });

  it("codifica acentos, espaços, &, ? e quebra de linha", () => {
    const mensagem = "Olá, ação & exame?\nSegunda linha";
    const url = buildWhatsAppLink({ mensagem, numero: "5511999999999" });
    expect(url).toBe(`https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`);
    expect(url).toContain("%0A");
    expect(url).toContain("%26");
    expect(url).toContain("%3F");
    expect(url).not.toMatch(/[ \n&]/u);
    expect(url.split("?")).toHaveLength(2);
    expect(textoDe(url)).toBe(mensagem);
  });
});

describe("getMensagemWhatsApp", () => {
  const mensagens: MensagensWhatsApp = {
    padrao: "P",
    especialidade: "E {especialidade} / {especialidade}",
    exames: "X",
    duvidas: "D",
  };

  it("resolve cada contexto a partir das mensagens injetadas", () => {
    expect(getMensagemWhatsApp({ tipo: "padrao" }, mensagens)).toBe("P");
    expect(getMensagemWhatsApp({ tipo: "exames" }, mensagens)).toBe("X");
    expect(getMensagemWhatsApp({ tipo: "duvidas" }, mensagens)).toBe("D");
    expect(getMensagemWhatsApp({ tipo: "especialidade", especialidade: "Cardio" }, mensagens)).toBe(
      "E Cardio / Cardio",
    );
  });

  it("usa clinica.whatsapp.mensagens por padrão", () => {
    expect(getMensagemWhatsApp({ tipo: "padrao" })).toBe(clinica.whatsapp.mensagens.padrao);
  });

  it("mensagem contextual por especialidade aparece decodificada no text", () => {
    const nome = clinica.especialidades[0]!.nome;
    const url = buildWhatsAppLink({
      mensagem: getMensagemWhatsApp({ tipo: "especialidade", especialidade: nome }),
    });
    const texto = textoDe(url);
    expect(texto).toContain(nome);
    expect(texto).not.toContain("{especialidade}");
  });
});
