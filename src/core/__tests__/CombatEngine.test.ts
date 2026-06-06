import { describe, expect, it } from "vitest";
import { ArcherClass, MageClass, WarriorClass } from "../../classes";
import type { Enemy, Player } from "../../types";
import { CombatEngine } from "../CombatEngine";
import { createCharacter } from "../createCharacter";

function makePlayer(overrides: Partial<Player> = {}): Player {
  return { ...createCharacter({ name: "Hero", characterClass: new WarriorClass() }), ...overrides };
}

function makeEnemy(overrides: Partial<Enemy> = {}): Enemy {
  return {
    id: "goblin",
    name: "name.goblin",
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
  it("starts ongoing with both alive", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy());
    combat.start();
    expect(combat.getStatus()).toBe("ongoing");
    expect(combat.isOver()).toBe(false);
  });

  it("does not mutate the source combatants", () => {
    const player = makePlayer();
    const enemy = makeEnemy();
    const combat = new CombatEngine(player, enemy);
    combat.start();
    combat.getPlayer().hp = 1;
    expect(player.hp).not.toBe(1);
    expect(enemy.hp).toBe(25);
  });

  it("detects victory when the enemy starts with no hp", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy({ hp: 0 }));
    combat.start();
    expect(combat.getStatus()).toBe("victory");
    expect(combat.isOver()).toBe(true);
  });

  it("detects defeat when the player starts with no hp", () => {
    const combat = new CombatEngine(makePlayer({ hp: 0 }), makeEnemy());
    combat.start();
    expect(combat.getStatus()).toBe("defeat");
    expect(combat.isOver()).toBe(true);
  });

  it("throws when started twice", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy());
    combat.start();
    expect(() => combat.start()).toThrow();
  });

  it("player attack reduces the enemy hp", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy({ hp: 25, defense: 0 }));
    combat.start();
    const before = combat.getEnemy().hp;
    const outcome = combat.playerAttack();
    expect(outcome.damage).toBeGreaterThan(0);
    expect(combat.getEnemy().hp).toBe(before - outcome.damage);
    expect(outcome.targetHpRemaining).toBe(combat.getEnemy().hp);
  });

  it("enemy attack reduces the player hp", () => {
    const combat = new CombatEngine(makePlayer({ defense: 0 }), makeEnemy({ attack: 10 }));
    combat.start();
    const before = combat.getPlayer().hp;
    const outcome = combat.enemyAttack();
    expect(outcome.damage).toBe(10);
    expect(combat.getPlayer().hp).toBe(before - 10);
  });

  it("does not reduce hp below zero", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy({ hp: 1, defense: 0 }));
    combat.start();
    combat.playerAttack();
    expect(combat.getEnemy().hp).toBe(0);
    expect(combat.getStatus()).toBe("victory");
  });

  it("does not allow attacking after combat ends", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy({ hp: 1, defense: 0 }));
    combat.start();
    combat.playerAttack();
    expect(() => combat.playerAttack()).toThrow();
  });

  it("does not allow attacking before starting", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy());
    expect(() => combat.playerAttack()).toThrow();
  });
});

describe("CombatEngine — turns", () => {
  it("starts on the player's turn in round 1", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy());
    combat.start();
    expect(combat.getCurrentTurn()).toBe("player");
    expect(combat.getRound()).toBe(1);
  });

  it("alternates between player and enemy", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy());
    combat.start();
    combat.endTurn();
    expect(combat.getCurrentTurn()).toBe("enemy");
    combat.endTurn();
    expect(combat.getCurrentTurn()).toBe("player");
  });

  it("increments the round when returning to the player", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy());
    combat.start();
    combat.endTurn(); // enemy, round 1
    combat.endTurn(); // player, round 2
    expect(combat.getRound()).toBe(2);
  });

  it("does not allow ending a turn once combat is over", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy({ hp: 1, defense: 0 }));
    combat.start();
    combat.playerAttack();
    expect(() => combat.endTurn()).toThrow();
  });
});

describe("CombatEngine — skills and cooldowns", () => {
  // Powerful Strike: manaCost 0, cooldown 3.
  const powerfulStrike = new WarriorClass().getStartingSkills()[0];

  it("puts the skill on cooldown after use", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy());
    combat.start();
    expect(combat.isOnCooldown(powerfulStrike.id)).toBe(false);
    combat.useSkill(powerfulStrike);
    expect(combat.isOnCooldown(powerfulStrike.id)).toBe(true);
    expect(combat.getSkillCooldown(powerfulStrike.id)).toBe(powerfulStrike.cooldown);
  });

  it("blocks usage while on cooldown", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy());
    combat.start();
    combat.useSkill(powerfulStrike);
    expect(() => combat.useSkill(powerfulStrike)).toThrow();
  });

  it("reduces the cooldown each round and frees it at zero", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy());
    combat.start();
    combat.useSkill(powerfulStrike); // cooldown = 3
    for (let i = 0; i < powerfulStrike.cooldown; i++) {
      combat.endTurn(); // enemy
      combat.endTurn(); // player (+1 round => tick)
    }
    expect(combat.isOnCooldown(powerfulStrike.id)).toBe(false);
    expect(() => combat.useSkill(powerfulStrike)).not.toThrow();
  });

  it("consumes mana and throws when insufficient", () => {
    // Precise Shot: manaCost 10.
    const preciseShot = new ArcherClass().getStartingSkills()[0];
    const combat = new CombatEngine(makePlayer({ mana: 5, maxMana: 50 }), makeEnemy());
    combat.start();
    expect(() => combat.useSkill(preciseShot)).toThrow();
  });

  it("deducts the spent mana from the player", () => {
    const preciseShot = new ArcherClass().getStartingSkills()[0];
    const combat = new CombatEngine(makePlayer({ mana: 50, maxMana: 50 }), makeEnemy());
    combat.start();
    const outcome = combat.useSkill(preciseShot);
    expect(outcome.manaSpent).toBe(preciseShot.manaCost);
    expect(combat.getPlayer().mana).toBe(50 - preciseShot.manaCost);
  });
});

describe("CombatEngine — skill effects", () => {
  function makeMage(overrides: Partial<Player> = {}): Player {
    return { ...createCharacter({ name: "Mage", characterClass: new MageClass() }), ...overrides };
  }

  it("offensive skills reduce the enemy hp", () => {
    const fireball = new MageClass().getStartingSkills()[0];
    const combat = new CombatEngine(makeMage(), makeEnemy({ hp: 100, defense: 0 }));
    combat.start();
    const before = combat.getEnemy().hp;
    const outcome = combat.useSkill(fireball);
    expect(outcome.result.damage).toBeGreaterThan(0);
    expect(combat.getEnemy().hp).toBe(before - outcome.result.damage);
  });

  it("scales offensive skill damage above a basic attack", () => {
    // Fireball (int * 1.8) deve superar o ataque básico (int) do mago.
    const fireball = new MageClass().getStartingSkills()[0];
    const skillCombat = new CombatEngine(makeMage(), makeEnemy({ hp: 100, defense: 0 }));
    skillCombat.start();
    const skillDamage = skillCombat.useSkill(fireball).result.damage;

    const attackCombat = new CombatEngine(makeMage(), makeEnemy({ hp: 100, defense: 0 }));
    attackCombat.start();
    const basicDamage = attackCombat.playerAttack().damage;

    expect(skillDamage).toBeGreaterThan(basicDamage);
  });

  it("a defensive skill reduces incoming damage while active", () => {
    const arcaneShield = new MageClass().getStartingSkills()[2];
    const combat = new CombatEngine(makeMage({ defense: 10 }), makeEnemy({ attack: 30 }));
    combat.start();

    const outcome = combat.useSkill(arcaneShield);
    expect(outcome.result.damage).toBe(0);
    const buffed = combat.enemyAttack();

    const baseline = new CombatEngine(makeMage({ defense: 10 }), makeEnemy({ attack: 30 }));
    baseline.start();
    const unbuffed = baseline.enemyAttack();

    expect(buffed.damage).toBeLessThan(unbuffed.damage);
  });

  it("the defense buff expires after its duration", () => {
    const arcaneShield = new MageClass().getStartingSkills()[2]; // 3 rodadas
    const combat = new CombatEngine(makeMage({ defense: 10 }), makeEnemy({ attack: 30 }));
    combat.start();
    combat.useSkill(arcaneShield);

    for (let i = 0; i < 3; i++) {
      combat.endTurn(); // enemy
      combat.endTurn(); // player (+1 rodada => tick)
    }

    const expired = combat.enemyAttack();
    const baseline = new CombatEngine(makeMage({ defense: 10 }), makeEnemy({ attack: 30 }));
    baseline.start();
    expect(expired.damage).toBe(baseline.enemyAttack().damage);
  });
});

describe("CombatEngine — victory and defeat", () => {
  it("returns victory with an XP reward", () => {
    const combat = new CombatEngine(
      makePlayer(),
      makeEnemy({ hp: 1, defense: 0, experienceReward: 20 }),
    );
    combat.start();
    combat.playerAttack();
    const result = combat.getResult();
    expect(result.status).toBe("victory");
    expect(result.experienceReward).toBe(20);
  });

  it("returns defeat with no reward", () => {
    const combat = new CombatEngine(makePlayer({ hp: 1, defense: 0 }), makeEnemy({ attack: 999 }));
    combat.start();
    combat.enemyAttack();
    const result = combat.getResult();
    expect(result.status).toBe("defeat");
    expect(result.experienceReward).toBe(0);
  });

  it("throws when getting the result while combat is ongoing", () => {
    const combat = new CombatEngine(makePlayer(), makeEnemy());
    combat.start();
    expect(() => combat.getResult()).toThrow();
  });
});
