import type { LootTable } from "../types";
import { type Rng, t, weightedPick } from "../utils";

/**
 * Sistema de loot — sorteio baseado em pesos (nunca em cadeias de if).
 */

/** Sorteia o id de um item a partir de uma tabela de loot. */
export function rollLoot(table: LootTable, rng?: Rng): string {
  if (table.length === 0) {
    throw new Error(t("error.loot.emptyTable"));
  }
  return weightedPick(
    table.map((entry) => ({ item: entry.itemId, weight: entry.weight })),
    rng,
  );
}

/** Sorteia `count` itens (com reposição) de uma tabela de loot. */
export function rollLootMany(table: LootTable, count: number, rng?: Rng): string[] {
  if (count < 0) {
    throw new Error(t("error.loot.negativeCount", { count }));
  }
  return Array.from({ length: count }, () => rollLoot(table, rng));
}
