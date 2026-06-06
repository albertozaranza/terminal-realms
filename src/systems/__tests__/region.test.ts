import { describe, expect, it } from "vitest";
import type { Player, Region } from "../../types";
import { canEnterRegion, getNextRegionId, isLastRegion } from "../region";

const order = ["a", "b", "c"];

function region(overrides: Partial<Region> = {}): Region {
  return {
    id: "r",
    name: "Region",
    minLevel: 5,
    maxLevel: 10,
    enemyPool: ["goblin"],
    bossId: "boss",
    ...overrides,
  };
}

function player(level: number): Player {
  return {
    id: "p",
    name: "P",
    level,
    experience: 0,
    hp: 1,
    maxHp: 1,
    mana: 0,
    maxMana: 0,
    strength: 1,
    dexterity: 1,
    intelligence: 1,
    defense: 1,
    speed: 1,
    classId: "warrior",
    inventory: [],
  };
}

describe("getNextRegionId", () => {
  it("returns the next region in the order", () => {
    expect(getNextRegionId(order, "a")).toBe("b");
    expect(getNextRegionId(order, "b")).toBe("c");
  });

  it("returns undefined on the last region", () => {
    expect(getNextRegionId(order, "c")).toBeUndefined();
  });

  it("throws for a region outside the order", () => {
    expect(() => getNextRegionId(order, "z")).toThrow();
  });
});

describe("isLastRegion", () => {
  it("identifies the last region", () => {
    expect(isLastRegion(order, "c")).toBe(true);
    expect(isLastRegion(order, "a")).toBe(false);
  });
});

describe("canEnterRegion", () => {
  it("allows entry when the level meets the minimum", () => {
    expect(canEnterRegion(player(5), region({ minLevel: 5 }))).toBe(true);
    expect(canEnterRegion(player(10), region({ minLevel: 5 }))).toBe(true);
  });

  it("blocks entry when the level is too low", () => {
    expect(canEnterRegion(player(3), region({ minLevel: 5 }))).toBe(false);
  });
});
