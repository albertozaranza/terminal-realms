import { describe, expect, it } from "vitest";
import { WarriorClass } from "../classes";
import type { Enemy, Player } from "../types";
import { CombatEngine } from "./CombatEngine";
import { createCharacter } from "./createCharacter";

function makePlayer(overrides: Partial<Player> = {}): Player {
  return { ...createCharacter({ name: "Hero", characterClass: new WarriorClass() }), ...overrides };
}

function makeEnemy(overrides: Partial<Enemy> = {}): Enemy {
  return {
    id: "goblin",
    name: "Goblin",
    level: 1,
    hp: 25,
    attack: 5,
    defense: 2,
    experienceReward: 20,
    lootTableId: "goblin",
    ...overrides,
  };
}

describe("CombatEngine", () => {
  it("inicia em andamento com ambos vivos", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy());
    combat.start();
    expect(combat.getStatus()).toBe("ongoing");
    expect(combat.isOver()).toBe(false);
  });

  it("não muta os combatentes de origem", () => {
    const player = makePlayer();
    const enemy = makeEnemy();
    const combat = new CombatEngine(player, enemy);
    combat.start();
    combat.getPlayer().hp = 1;
    expect(player.hp).not.toBe(1);
    expect(enemy.hp).toBe(25);
  });

  it("detecta vitória quando o inimigo começa sem hp", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy({ hp: 0 }));
    combat.start();
    expect(combat.getStatus()).toBe("victory");
    expect(combat.isOver()).toBe(true);
  });

  it("detecta derrota quando o jogador começa sem hp", () => {
    const combat = new CombatEngine(makePlayer({ hp: 0 }), makeEnemy());
    combat.start();
    expect(combat.getStatus()).toBe("defeat");
    expect(combat.isOver()).toBe(true);
  });

  it("lança erro ao iniciar duas vezes", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy());
    combat.start();
    expect(() => combat.start()).toThrow();
  });
});
