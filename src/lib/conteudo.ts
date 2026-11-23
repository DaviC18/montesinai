/** Remove itens `pendente: true` (contrato de pendências do ARCHITECTURE.md). */
export function confirmados<T extends { pendente?: boolean }>(itens: readonly T[]): T[] {
  return itens.filter((item) => item.pendente !== true);
}

/** Troca `{chave}` pelos valores dados. Chave ausente fica como está. */
export function preencher(modelo: string, valores: Record<string, string>): string {
  return modelo.replace(/\{(\w+)\}/g, (trecho, chave: string) => valores[chave] ?? trecho);
}
