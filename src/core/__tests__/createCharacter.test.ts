import { describe, expect, it } from "vitest";
import { WarriorClass } from "../../classes";
import { createCharacter } from "../createCharacter";

const warrior = new WarriorClass();

describe("createCharacter", () => {
  it("creates a level 1 character with the class attributes", () => {
    const player = createCharacter({ name: "Aragorn", characterClass: warrior });
    const stats = warrior.getStartingStats();

    expect(player.name).toBe("Aragorn");
    expect(player.level).toBe(1);
    expect(player.experience).toBe(0);
    expect(player.classId).toBe("warrior");
    expect(player.maxHp).toBe(stats.maxHp);
    expect(player.hp).toBe(stats.maxHp);
    expect(player.mana).toBe(stats.maxMana);
    expect(player.maxMana).toBe(stats.maxMana);
  });

  it("starts with full hp and mana", () => {
    const player = createCharacter({ name: "Gandalf", characterClass: warrior });
    expect(player.hp).toBe(player.maxHp);
    expect(player.mana).toBe(player.maxMana);
  });

  it("trims surrounding whitespace from the name", () => {
    const player = createCharacter({ name: "  Legolas  ", characterClass: warrior });
    expect(player.name).toBe("Legolas");
  });

  it("throws for an empty name", () => {
    expect(() => createCharacter({ name: "   ", characterClass: warrior })).toThrow();
  });
});
