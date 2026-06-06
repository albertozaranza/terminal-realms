import { describe, expect, it } from "vitest";
import { ArcherClass, MageClass, WarriorClass } from "../../classes";
import { goblin, goblinKing } from "../../content";
import type { CharacterClass, Enemy, Player } from "../../types";
import { CombatEngine } from "../CombatEngine";
import { createCharacter } from "../createCharacter";
import { grantExperience, xpToNextLevel } from "../experience";

const goblinLike = (): Enemy => goblin;
const goblinKingLike = (): Enemy => goblinKing;

const classes: CharacterClass[] = [new WarriorClass(), new ArcherClass(), new MageClass()];

/** Automatic combat: player and enemy trade basic attacks until it ends. */
function autoBattle(player: Player, enemy: Enemy): { winner: "player" | "enemy"; rounds: number } {
  const combat = new CombatEngine(player, enemy);
  combat.start();
  let guard = 0;
  while (!combat.isOver() && guard < 500) {
    combat.playerAttack();
    if (combat.isOver()) {
      break;
    }
    combat.endTurn();
    combat.enemyAttack();
    if (combat.isOver()) {
      break;
    }
    combat.endTurn();
    guard += 1;
  }
  return { winner: combat.getResult().status === "victory" ? "player" : "enemy", rounds: guard };
}

describe("balance — early combat", () => {
  it.each(classes)("$id at level 1 beats a basic enemy", (characterClass) => {
    const player = createCharacter({ name: "Hero", characterClass });
    expect(autoBattle(player, goblinLike()).winner).toBe("player");
  });

  it("the boss is harder than a basic enemy (more rounds)", () => {
    const player = createCharacter({ name: "Hero", characterClass: new WarriorClass() });
    const vsGoblin = autoBattle(player, goblinLike());
    const vsBoss = autoBattle(
      createCharacter({ name: "Hero", characterClass: new WarriorClass() }),
      goblinKingLike(),
    );
    expect(vsBoss.rounds).toBeGreaterThan(vsGoblin.rounds);
  });
});

describe("balance — XP progression", () => {
  it("defeating ~5 basic enemies reaches level 2", () => {
    const player = createCharacter({ name: "Hero", characterClass: new WarriorClass() });
    const killsToLevel = Math.ceil(xpToNextLevel(1) / goblinLike().experienceReward);
    const result = grantExperience(player, killsToLevel * goblinLike().experienceReward);
    expect(result.player.level).toBeGreaterThanOrEqual(2);
  });

  it("progression makes the boss beatable even for a fragile class", () => {
    const leveled = grantExperience(
      createCharacter({ name: "Mage", characterClass: new MageClass() }),
      50_000,
    ).player;
    expect(autoBattle(leveled, goblinKingLike()).winner).toBe("player");
  });
});
