import { describe, expect, it } from "vitest";
import { WarriorClass } from "../../classes";
import { CombatEngine, createCharacter } from "../../core";
import { goblin } from "../enemies";
import { startingFields } from "../regions";
import { BOSSES, findBossById, goblinKing } from "./index";

describe("Rei Goblin", () => {
  it("é o chefe da região inicial", () => {
    expect(startingFields.bossId).toBe(goblinKing.id);
    expect(findBossById(startingFields.bossId)).toBe(goblinKing);
  });

  it("é mais forte que um inimigo básico", () => {
    expect(goblinKing.hp).toBeGreaterThan(goblin.hp);
    expect(goblinKing.attack).toBeGreaterThan(goblin.attack);
    expect(goblinKing.experienceReward).toBeGreaterThan(goblin.experienceReward);
  });

  it("permite um combate funcional até a vitória", () => {
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
  it("retorna undefined para chefe inexistente", () => {
    expect(findBossById("dragao_vermelho")).toBeUndefined();
  });

  it("contém o Rei Goblin", () => {
    expect(BOSSES.goblin_king).toBe(goblinKing);
  });
});
