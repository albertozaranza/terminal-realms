import { describe, expect, it } from "vitest";
import { rollLoot } from "../../systems";
import { BOSSES } from "../bosses";
import { ENEMIES } from "../enemies";
import { findItemById } from "../items";
import { findLootTable, LOOT_TABLES } from "./index";

const combatants = [...Object.values(ENEMIES), ...Object.values(BOSSES)];

describe("tabelas de loot", () => {
  it("todo item referenciado existe", () => {
    for (const table of Object.values(LOOT_TABLES)) {
      for (const entry of table) {
        expect(findItemById(entry.itemId)).toBeDefined();
      }
    }
  });

  it("todo inimigo/chefe tem uma tabela de loot que dropa item válido", () => {
    for (const combatant of combatants) {
      const table = findLootTable(combatant.lootTableId);
      expect(table).toBeDefined();
      if (!table) {
        throw new Error(`tabela de loot ausente para ${combatant.id}`);
      }
      const droppedId = rollLoot(table, () => 0);
      expect(findItemById(droppedId)).toBeDefined();
    }
  });
});
