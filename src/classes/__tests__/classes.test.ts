import { describe, expect, it } from "vitest";
import type { CharacterClass } from "../../types";
import { ArcherClass, AVAILABLE_CLASSES, findClassById, MageClass, WarriorClass } from "../index";

const implementations: CharacterClass[] = [new WarriorClass(), new ArcherClass(), new MageClass()];

describe("playable classes", () => {
  it.each(implementations)("$id implements the CharacterClass contract", (characterClass) => {
    expect(typeof characterClass.id).toBe("string");
    expect(characterClass.id.length).toBeGreaterThan(0);
    expect(typeof characterClass.name).toBe("string");
    expect(characterClass.name.length).toBeGreaterThan(0);

    const stats = characterClass.getStartingStats();
    expect(stats.maxHp).toBeGreaterThan(0);
    expect(stats.maxMana).toBeGreaterThanOrEqual(0);
    for (const value of Object.values(stats)) {
      expect(value).toBeGreaterThanOrEqual(0);
    }

    const skills = characterClass.getStartingSkills();
    expect(skills.length).toBeGreaterThan(0);
    for (const skill of skills) {
      expect(skill.id.length).toBeGreaterThan(0);
      expect(skill.cooldown).toBeGreaterThanOrEqual(0);
      expect(typeof skill.execute).toBe("function");
      const result = skill.execute(characterClass as never, characterClass as never);
      expect(result).toHaveProperty("damage");
      expect(result).toHaveProperty("healing");
      expect(result).toHaveProperty("message");
    }
  });
});

describe("AVAILABLE_CLASSES", () => {
  it("contains Warrior, Archer and Mage", () => {
    const ids = AVAILABLE_CLASSES.map((c) => c.id);
    expect(ids).toEqual(["warrior", "archer", "mage"]);
  });

  it("has no duplicate ids", () => {
    const ids = AVAILABLE_CLASSES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("findClassById", () => {
  it("finds an existing class", () => {
    expect(findClassById("mage")?.id).toBe("mage");
  });

  it("returns undefined for a missing id", () => {
    expect(findClassById("paladin")).toBeUndefined();
  });
});
