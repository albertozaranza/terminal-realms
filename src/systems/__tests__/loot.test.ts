import { describe, expect, it } from "vitest";
import type { LootTable } from "../../types";
import { rollLoot, rollLootMany } from "../loot";

const table: LootTable = [
  { itemId: "common", weight: 70 },
  { itemId: "rare", weight: 30 },
];

describe("rollLoot", () => {
  it("drops the first item for a low roll", () => {
    expect(rollLoot(table, () => 0)).toBe("common");
  });

  it("drops the second item for a high roll", () => {
    expect(rollLoot(table, () => 0.99)).toBe("rare");
  });

  it("throws for an empty table", () => {
    expect(() => rollLoot([])).toThrow();
  });

  it("respects the approximate weight distribution", () => {
    let commons = 0;
    let seed = 0;
    const rng = () => {
      seed = (seed + 0.071) % 1; // deterministic sweep of [0,1)
      return seed;
    };
    for (let i = 0; i < 1000; i++) {
      if (rollLoot(table, rng) === "common") {
        commons += 1;
      }
    }
    expect(commons).toBeGreaterThan(600);
    expect(commons).toBeLessThan(800);
  });
});

describe("rollLootMany", () => {
  it("drops the requested amount", () => {
    expect(rollLootMany(table, 5, () => 0)).toEqual([
      "common",
      "common",
      "common",
      "common",
      "common",
    ]);
  });

  it("throws for a negative count", () => {
    expect(() => rollLootMany(table, -1)).toThrow();
  });
});
