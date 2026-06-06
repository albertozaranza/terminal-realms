import { describe, expect, it } from "vitest";
import { ArcherClass, WarriorClass } from "../classes";
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

describe("CombatEngine — turnos", () => {
  it("começa no turno do jogador na rodada 1", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy());
    combat.start();
    expect(combat.getCurrentTurn()).toBe("player");
    expect(combat.getRound()).toBe(1);
  });

  it("alterna entre jogador e inimigo", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy());
    combat.start();
    combat.endTurn();
    expect(combat.getCurrentTurn()).toBe("enemy");
    combat.endTurn();
    expect(combat.getCurrentTurn()).toBe("player");
  });

  it("incrementa a rodada ao voltar para o jogador", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy());
    combat.start();
    combat.endTurn(); // enemy, rodada 1
    combat.endTurn(); // player, rodada 2
    expect(combat.getRound()).toBe(2);
  });

  it("não permite encerrar turno com o combate finalizado", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy({ hp: 1, defense: 0 }));
    combat.start();
    combat.playerAttack();
    expect(() => combat.endTurn()).toThrow();
  });
});

describe("CombatEngine — habilidades e cooldowns", () => {
  // Golpe Poderoso: manaCost 0, cooldown 3.
  const golpePoderoso = new WarriorClass().getStartingSkills()[0];

  it("coloca a habilidade em cooldown após o uso", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy());
    combat.start();
    expect(combat.isOnCooldown(golpePoderoso.id)).toBe(false);
    combat.useSkill(golpePoderoso);
    expect(combat.isOnCooldown(golpePoderoso.id)).toBe(true);
    expect(combat.getSkillCooldown(golpePoderoso.id)).toBe(golpePoderoso.cooldown);
  });

  it("bloqueia o uso enquanto em cooldown", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy());
    combat.start();
    combat.useSkill(golpePoderoso);
    expect(() => combat.useSkill(golpePoderoso)).toThrow();
  });

  it("reduz o cooldown a cada rodada e libera ao zerar", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy());
    combat.start();
    combat.useSkill(golpePoderoso); // cooldown = 3
    for (let i = 0; i < golpePoderoso.cooldown; i++) {
      combat.endTurn(); // enemy
      combat.endTurn(); // player (+1 rodada => tick)
    }
    expect(combat.isOnCooldown(golpePoderoso.id)).toBe(false);
    expect(() => combat.useSkill(golpePoderoso)).not.toThrow();
  });

  it("consome mana e lança erro quando insuficiente", () => {
    // Disparo Preciso: manaCost 10.
    const disparoPreciso = new ArcherClass().getStartingSkills()[0];
    const combat = new CombatEngine(makePlayer({ mana: 5, maxMana: 50 }), makeEnemy());
    combat.start();
    expect(() => combat.useSkill(disparoPreciso)).toThrow();
  });

  it("desconta a mana gasta do jogador", () => {
    const disparoPreciso = new ArcherClass().getStartingSkills()[0];
    const combat = new CombatEngine(makePlayer({ mana: 50, maxMana: 50 }), makeEnemy());
    combat.start();
    const outcome = combat.useSkill(disparoPreciso);
    expect(outcome.manaSpent).toBe(disparoPreciso.manaCost);
    expect(combat.getPlayer().mana).toBe(50 - disparoPreciso.manaCost);
  });
});
