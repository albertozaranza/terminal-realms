import { describe, expect, it } from "vitest";
import type { Enemy } from "../../types";
import { effectiveEnemyLevel, scaleEnemy } from "../scaling";

const goblin: Enemy = {
  id: "goblin",
  name: "name.goblin",
  level: 1,
  hp: 25,
  attack: 5,
  defense: 2,
  experienceReward: 20,
  lootTableId: "goblin",
};

describe("scaleEnemy", () => {
  it("returns the base enemy untouched at or below its level", () => {
    expect(scaleEnemy(goblin, 1)).toBe(goblin);
    expect(scaleEnemy(goblin, 0)).toBe(goblin);
  });

  it("scales stats and rewards up for higher target levels", () => {
    const scaled = scaleEnemy(goblin, 5); // delta = 4
    expect(scaled.level).toBe(5);
    expect(scaled.hp).toBe(Math.round(25 * (1 + 0.15 * 4))); // 40
    expect(scaled.attack).toBe(Math.round(5 * (1 + 0.1 * 4))); // 7
    expect(scaled.defense).toBe(Math.round(2 * (1 + 0.1 * 4))); // 3
    expect(scaled.experienceReward).toBe(Math.round(20 * (1 + 0.5 * 4))); // 60
  });

  it("does not mutate the base template", () => {
    scaleEnemy(goblin, 5);
    expect(goblin.hp).toBe(25);
    expect(goblin.experienceReward).toBe(20);
  });
});

describe("effectiveEnemyLevel", () => {
  it("tracks the player level within the region range", () => {
    expect(effectiveEnemyLevel(1, 4, 6)).toBe(4);
  });

  it("never drops below the enemy base level", () => {
    expect(effectiveEnemyLevel(3, 1, 6)).toBe(3);
  });

  it("never exceeds the region max level", () => {
    expect(effectiveEnemyLevel(1, 20, 6)).toBe(6);
  });
});
