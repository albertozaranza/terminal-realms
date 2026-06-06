import type { LootTable } from "../../types";

/** Tabelas de loot por id (referenciadas em Enemy.lootTableId). */
export const LOOT_TABLES: Readonly<Record<string, LootTable>> = {
  goblin: [
    { itemId: "small_potion", weight: 70 },
    { itemId: "rusty_sword", weight: 30 },
  ],
  wolf: [
    { itemId: "small_potion", weight: 80 },
    { itemId: "mana_potion", weight: 20 },
  ],
  skeleton: [
    { itemId: "medium_potion", weight: 60 },
    { itemId: "simple_bow", weight: 40 },
  ],
  orc: [
    { itemId: "medium_potion", weight: 70 },
    { itemId: "oak_staff", weight: 30 },
  ],
  goblin_king: [{ itemId: "large_potion", weight: 100 }],
};

/** Busca uma tabela de loot pelo id. Retorna undefined se não existir. */
export function findLootTable(id: string): LootTable | undefined {
  return LOOT_TABLES[id];
}
