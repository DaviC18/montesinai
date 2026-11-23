import { clinica } from "@/data/clinica";
import { confirmados, preencher } from "@/lib/conteudo";
import { SECTION_IDS } from "@/lib/sections";

describe("confirmados", () => {
  it("remove só itens com pendente: true", () => {
    const itens = [{ n: 1, pendente: true }, { n: 2, pendente: false }, { n: 3 }];
    expect(confirmados(itens).map((i) => i.n)).toEqual([2, 3]);
  });

  it("devolve lista vazia quando tudo é pendente", () => {
    expect(confirmados(clinica.convenios.itens)).toEqual([]);
  });
});

describe("preencher", () => {
  it("substitui as chaves conhecidas e mantém as desconhecidas", () => {
    expect(preencher("{inicio} a {fim} {x}", { inicio: "Segunda", fim: "Sexta" })).toBe(
      "Segunda a Sexta {x}",
    );
  });
});

describe("âncoras de clinica.ui", () => {
  const ids: string[] = Object.values(SECTION_IDS);

  it("todo item do menu aponta para uma seção existente", () => {
    for (const item of clinica.ui.header.itens) expect(ids).toContain(item.alvo);
  });

  it("toda resposta do hero aponta para uma seção existente", () => {
    for (const resposta of clinica.ui.hero.respostas) expect(ids).toContain(resposta.alvo);
  });
});
