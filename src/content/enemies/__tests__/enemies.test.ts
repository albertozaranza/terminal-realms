import { describe, expect, it } from "vitest";
import { WarriorClass } from "../../../classes";
import { CombatEngine, createCharacter } from "../../../core";
import { ENEMIES, findEnemyById } from "../index";

const all = Object.values(ENEMIES);

describe("basic enemies", () => {
  it("contains Goblin, Wolf, Skeleton and Orc", () => {
    expect(Object.keys(ENEMIES)).toEqual(["goblin", "wolf", "skeleton", "orc"]);
  });

  it.each(all)("$id appears in combat", (enemy) => {
    const player = createCharacter({ name: "Hero", characterClass: new WarriorClass() });
    const combat = new CombatEngine(player, enemy);
    combat.start();
    expect(combat.getStatus()).toBe("ongoing");
    expect(combat.getEnemy().id).toBe(enemy.id);
  });

  it.each(all)("$id has valid stats", (enemy) => {
    expect(enemy.hp).toBeGreaterThan(0);
    expect(enemy.attack).toBeGreaterThan(0);
    expect(enemy.defense).toBeGreaterThanOrEqual(0);
    expect(enemy.experienceReward).toBeGreaterThan(0);
    expect(enemy.lootTableId.length).toBeGreaterThan(0);
  });
});

describe("findEnemyById", () => {
  it("finds an existing enemy", () => {
    expect(findEnemyById("goblin")?.id).toBe("goblin");
  });

  it("returns undefined for a missing id", () => {
    expect(findEnemyById("dragon")).toBeUndefined();
  });
});
