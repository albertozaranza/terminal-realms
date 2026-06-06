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

  it("ataque do jogador reduz o hp do inimigo", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy({ hp: 25, defense: 0 }));
    combat.start();
    const before = combat.getEnemy().hp;
    const outcome = combat.playerAttack();
    expect(outcome.damage).toBeGreaterThan(0);
    expect(combat.getEnemy().hp).toBe(before - outcome.damage);
    expect(outcome.targetHpRemaining).toBe(combat.getEnemy().hp);
  });

  it("ataque do inimigo reduz o hp do jogador", () => {
    const combat = new CombatEngine(makePlayer({ defense: 0 }), makeEnemy({ attack: 10 }));
    combat.start();
    const before = combat.getPlayer().hp;
    const outcome = combat.enemyAttack();
    expect(outcome.damage).toBe(10);
    expect(combat.getPlayer().hp).toBe(before - 10);
  });

  it("não reduz o hp abaixo de zero", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy({ hp: 1, defense: 0 }));
    combat.start();
    combat.playerAttack();
    expect(combat.getEnemy().hp).toBe(0);
    expect(combat.getStatus()).toBe("victory");
  });

  it("não permite atacar após o fim do combate", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy({ hp: 1, defense: 0 }));
    combat.start();
    combat.playerAttack();
    expect(() => combat.playerAttack()).toThrow();
  });

  it("não permite atacar antes de iniciar", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy());
    expect(() => combat.playerAttack()).toThrow();
  });
});
