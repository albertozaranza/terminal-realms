import { describe, expect, it } from "vitest";
import { WarriorClass } from "../../classes";
import { CombatEngine, createCharacter } from "../../core";
import { goblin } from "../enemies";
import { camposIniciais } from "../regions";
import { BOSSES, findBossById, reiGoblin } from "./index";

describe("Rei Goblin", () => {
  it("é o chefe da região inicial", () => {
    expect(camposIniciais.bossId).toBe(reiGoblin.id);
    expect(findBossById(camposIniciais.bossId)).toBe(reiGoblin);
  });

  it("é mais forte que um inimigo básico", () => {
    expect(reiGoblin.hp).toBeGreaterThan(goblin.hp);
    expect(reiGoblin.attack).toBeGreaterThan(goblin.attack);
    expect(reiGoblin.experienceReward).toBeGreaterThan(goblin.experienceReward);
  });

  it("permite um combate funcional até a vitória", () => {
    const player = createCharacter({ name: "Hero", characterClass: new WarriorClass() });
    const combat = new CombatEngine(player, reiGoblin);
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
    expect(result.experienceReward).toBe(reiGoblin.experienceReward);
  });
});

describe("BOSSES", () => {
  it("retorna undefined para chefe inexistente", () => {
    expect(findBossById("dragao_vermelho")).toBeUndefined();
  });

  it("contém o Rei Goblin", () => {
    expect(BOSSES.rei_goblin).toBe(reiGoblin);
  });
});
