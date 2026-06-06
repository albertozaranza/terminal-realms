import { describe, expect, it } from "vitest";
import { WarriorClass } from "../../classes";
import { MAX_LEVEL } from "../config";
import { createCharacter } from "../createCharacter";
import { grantExperience, LEVEL_UP_GAINS, xpToNextLevel } from "../experience";

function newPlayer() {
  return createCharacter({ name: "Hero", characterClass: new WarriorClass() });
}

describe("xpToNextLevel", () => {
  it("increases with level", () => {
    expect(xpToNextLevel(2)).toBeGreaterThan(xpToNextLevel(1));
    expect(xpToNextLevel(10)).toBeGreaterThan(xpToNextLevel(5));
  });

  it("returns Infinity at the max level", () => {
    expect(xpToNextLevel(MAX_LEVEL)).toBe(Number.POSITIVE_INFINITY);
  });

  it("throws for an invalid level", () => {
    expect(() => xpToNextLevel(0)).toThrow();
    expect(() => xpToNextLevel(1.5)).toThrow();
  });
});

describe("grantExperience", () => {
  it("accumulates XP without leveling up", () => {
    const player = newPlayer();
    const result = grantExperience(player, xpToNextLevel(1) - 1);
    expect(result.leveledUp).toBe(false);
    expect(result.player.level).toBe(1);
  });

  it("levels up once and applies attribute gains", () => {
    const player = newPlayer();
    const result = grantExperience(player, xpToNextLevel(1));
    expect(result.leveledUp).toBe(true);
    expect(result.levelsGained).toBe(1);
    expect(result.player.level).toBe(2);
    expect(result.player.maxHp).toBe(player.maxHp + LEVEL_UP_GAINS.maxHp);
    expect(result.player.strength).toBe(player.strength + LEVEL_UP_GAINS.strength);
  });

  it("restores hp and mana on level up", () => {
    const player = newPlayer();
    player.hp = 1;
    player.mana = 0;
    const result = grantExperience(player, xpToNextLevel(1));
    expect(result.player.hp).toBe(result.player.maxHp);
    expect(result.player.mana).toBe(result.player.maxMana);
  });

  it("processes multiple levels at once", () => {
    const player = newPlayer();
    const total = xpToNextLevel(1) + xpToNextLevel(2);
    const result = grantExperience(player, total);
    expect(result.player.level).toBe(3);
    expect(result.levelsGained).toBe(2);
  });

  it("does not exceed the max level", () => {
    const player = newPlayer();
    const result = grantExperience(player, 10_000_000);
    expect(result.player.level).toBe(MAX_LEVEL);
  });

  it("does not mutate the original player", () => {
    const player = newPlayer();
    grantExperience(player, xpToNextLevel(1));
    expect(player.level).toBe(1);
  });

  it("throws for negative XP", () => {
    expect(() => grantExperience(newPlayer(), -5)).toThrow();
  });
});
