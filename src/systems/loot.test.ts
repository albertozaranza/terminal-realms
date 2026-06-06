import { describe, expect, it } from "vitest";
import type { LootTable } from "../types";
import { rollLoot, rollLootMany } from "./loot";

const table: LootTable = [
  { itemId: "comum", weight: 70 },
  { itemId: "raro", weight: 30 },
];

describe("rollLoot", () => {
  it("dropa o primeiro item para rolagem baixa", () => {
    expect(rollLoot(table, () => 0)).toBe("comum");
  });

  it("dropa o segundo item para rolagem alta", () => {
    expect(rollLoot(table, () => 0.99)).toBe("raro");
  });

  it("lança erro para tabela vazia", () => {
    expect(() => rollLoot([])).toThrow();
  });

  it("respeita a distribuição aproximada dos pesos", () => {
    let comuns = 0;
    let seed = 0;
    const rng = () => {
      seed = (seed + 0.071) % 1; // varredura determinística do intervalo [0,1)
      return seed;
    };
    for (let i = 0; i < 1000; i++) {
      if (rollLoot(table, rng) === "comum") {
        comuns += 1;
      }
    }
    expect(comuns).toBeGreaterThan(600);
    expect(comuns).toBeLessThan(800);
  });
});

describe("rollLootMany", () => {
  it("dropa a quantidade pedida", () => {
    expect(rollLootMany(table, 5, () => 0)).toEqual(["comum", "comum", "comum", "comum", "comum"]);
  });

  it("lança erro para count negativo", () => {
    expect(() => rollLootMany(table, -1)).toThrow();
  });
});
