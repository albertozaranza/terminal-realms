import type { LootTable } from "../../types";

/** Tabelas de loot por id (referenciadas em Enemy.lootTableId). */
export const LOOT_TABLES: Readonly<Record<string, LootTable>> = {
  goblin: [
    { itemId: "pocao_pequena", weight: 70 },
    { itemId: "espada_enferrujada", weight: 30 },
  ],
  wolf: [
    { itemId: "pocao_pequena", weight: 80 },
    { itemId: "pocao_mana", weight: 20 },
  ],
  skeleton: [
    { itemId: "pocao_media", weight: 60 },
    { itemId: "arco_simples", weight: 40 },
  ],
  orc: [
    { itemId: "pocao_media", weight: 70 },
    { itemId: "cajado_carvalho", weight: 30 },
  ],
  rei_goblin: [{ itemId: "pocao_grande", weight: 100 }],
};

/** Busca uma tabela de loot pelo id. Retorna undefined se não existir. */
export function findLootTable(id: string): LootTable | undefined {
  return LOOT_TABLES[id];
}
