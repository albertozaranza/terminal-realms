import { describe, expect, it } from "vitest";
import { WarriorClass } from "../../../classes";
import { CombatEngine, createCharacter } from "../../../core";
import { goblin } from "../../enemies";
import { startingFields } from "../../regions";
import { BOSSES, findBossById, goblinKing } from "../index";

describe("Goblin King", () => {
  it("is the boss of the starting region", () => {
    expect(startingFields.bossId).toBe(goblinKing.id);
    expect(findBossById(startingFields.bossId)).toBe(goblinKing);
  });

  it("is stronger than a basic enemy", () => {
    expect(goblinKing.hp).toBeGreaterThan(goblin.hp);
    expect(goblinKing.attack).toBeGreaterThan(goblin.attack);
    expect(goblinKing.experienceReward).toBeGreaterThan(goblin.experienceReward);
  });

  it("allows a functional combat up to victory", () => {
    const player = createCharacter({ name: "Hero", characterClass: new WarriorClass() });
    const combat = new CombatEngine(player, goblinKing);
    combat.start();

    let guard = 0;
    while (!combat.isOver() && guard < 200) {
      combat.playerAttack();
      if (combat.isOver()) {
        break;
      }
      combat.endTurn();
      combat.endTurn();
      guard += 1;
    }

    const result = combat.getResult();
    expect(result.status).toBe("victory");
    expect(result.experienceReward).toBe(goblinKing.experienceReward);
  });
});

describe("BOSSES", () => {
  it("returns undefined for a missing boss", () => {
    expect(findBossById("red_dragon")).toBeUndefined();
  });

  it("contains the Goblin King", () => {
    expect(BOSSES.goblin_king).toBe(goblinKing);
  });
});
