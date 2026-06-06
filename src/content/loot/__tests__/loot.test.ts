import { describe, expect, it } from "vitest";
import { rollLoot } from "../../../systems";
import { BOSSES } from "../../bosses";
import { ENEMIES } from "../../enemies";
import { findItemById } from "../../items";
import { findLootTable, LOOT_TABLES } from "../index";

const combatants = [...Object.values(ENEMIES), ...Object.values(BOSSES)];

describe("loot tables", () => {
  it("every referenced item exists", () => {
    for (const table of Object.values(LOOT_TABLES)) {
      for (const entry of table) {
        expect(findItemById(entry.itemId)).toBeDefined();
      }
    }
  });

  it("every enemy/boss has a loot table that drops a valid item", () => {
    for (const combatant of combatants) {
      const table = findLootTable(combatant.lootTableId);
      expect(table).toBeDefined();
      if (!table) {
        throw new Error(`missing loot table for ${combatant.id}`);
      }
      const droppedId = rollLoot(table, () => 0);
      expect(findItemById(droppedId)).toBeDefined();
    }
  });
});
