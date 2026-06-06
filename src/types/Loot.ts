/** Entrada de uma tabela de loot: um item e seu peso relativo. */
export interface LootEntry {
  itemId: string;
  weight: number;
}

/** Tabela de loot baseada em pesos. */
export type LootTable = readonly LootEntry[];
