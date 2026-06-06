import { describe, expect, it } from "vitest";
import type { Player, Region } from "../types";
import { canEnterRegion, getNextRegionId, isLastRegion } from "./region";

const order = ["a", "b", "c"];

function region(overrides: Partial<Region> = {}): Region {
  return {
    id: "r",
    name: "Região",
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
  it("retorna a próxima região na ordem", () => {
    expect(getNextRegionId(order, "a")).toBe("b");
    expect(getNextRegionId(order, "b")).toBe("c");
  });

  it("retorna undefined na última região", () => {
    expect(getNextRegionId(order, "c")).toBeUndefined();
  });

  it("lança erro para região fora da ordem", () => {
    expect(() => getNextRegionId(order, "z")).toThrow();
  });
});

describe("isLastRegion", () => {
  it("identifica a última região", () => {
    expect(isLastRegion(order, "c")).toBe(true);
    expect(isLastRegion(order, "a")).toBe(false);
  });
});

describe("canEnterRegion", () => {
  it("permite quando o nível atende ao mínimo", () => {
    expect(canEnterRegion(player(5), region({ minLevel: 5 }))).toBe(true);
    expect(canEnterRegion(player(10), region({ minLevel: 5 }))).toBe(true);
  });

  it("bloqueia quando o nível é insuficiente", () => {
    expect(canEnterRegion(player(3), region({ minLevel: 5 }))).toBe(false);
  });
});
