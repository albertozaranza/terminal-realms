import { describe, expect, it } from "vitest";
import { WarriorClass } from "../../classes";
import { CombatEngine, createCharacter } from "../../core";
import { ENEMIES, findEnemyById } from "./index";

const all = Object.values(ENEMIES);

describe("inimigos básicos", () => {
  it("contém Goblin, Lobo, Esqueleto e Orc", () => {
    expect(Object.keys(ENEMIES)).toEqual(["goblin", "wolf", "skeleton", "orc"]);
  });

  it.each(all)("$name aparece em combate", (enemy) => {
    const player = createCharacter({ name: "Hero", characterClass: new WarriorClass() });
    const combat = new CombatEngine(player, enemy);
    combat.start();
    expect(combat.getStatus()).toBe("ongoing");
    expect(combat.getEnemy().id).toBe(enemy.id);
  });

  it.each(all)("$name tem stats válidos", (enemy) => {
    expect(enemy.hp).toBeGreaterThan(0);
    expect(enemy.attack).toBeGreaterThan(0);
    expect(enemy.defense).toBeGreaterThanOrEqual(0);
    expect(enemy.experienceReward).toBeGreaterThan(0);
    expect(enemy.lootTableId.length).toBeGreaterThan(0);
  });
});

describe("findEnemyById", () => {
  it("encontra um inimigo existente", () => {
    expect(findEnemyById("goblin")?.name).toBe("Goblin");
  });

  it("retorna undefined para id inexistente", () => {
    expect(findEnemyById("dragon")).toBeUndefined();
  });
});
