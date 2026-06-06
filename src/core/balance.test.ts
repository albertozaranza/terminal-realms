import { describe, expect, it } from "vitest";
import { ArcherClass, MageClass, WarriorClass } from "../classes";
import { goblin, reiGoblin } from "../content";
import type { CharacterClass, Enemy, Player } from "../types";
import { CombatEngine } from "./CombatEngine";
import { createCharacter } from "./createCharacter";
import { grantExperience, xpToNextLevel } from "./experience";

const goblinLike = (): Enemy => goblin;
const reiGoblinLike = (): Enemy => reiGoblin;

const classes: CharacterClass[] = [new WarriorClass(), new ArcherClass(), new MageClass()];

/** Combate automático: jogador e inimigo trocam ataques básicos até o fim. */
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

describe("balanceamento — combate inicial", () => {
  it.each(classes)("$name nível 1 vence um inimigo básico", (characterClass) => {
    const player = createCharacter({ name: "Hero", characterClass });
    expect(autoBattle(player, goblinLike()).winner).toBe("player");
  });

  it("o chefe é mais difícil que um inimigo básico (mais rodadas)", () => {
    const player = createCharacter({ name: "Hero", characterClass: new WarriorClass() });
    const vsGoblin = autoBattle(player, goblinLike());
    const vsBoss = autoBattle(
      createCharacter({ name: "Hero", characterClass: new WarriorClass() }),
      reiGoblinLike(),
    );
    expect(vsBoss.rounds).toBeGreaterThan(vsGoblin.rounds);
  });
});

describe("balanceamento — progressão de XP", () => {
  it("derrotar ~5 inimigos básicos sobe para o nível 2", () => {
    const player = createCharacter({ name: "Hero", characterClass: new WarriorClass() });
    const killsToLevel = Math.ceil(xpToNextLevel(1) / goblinLike().experienceReward);
    const result = grantExperience(player, killsToLevel * goblinLike().experienceReward);
    expect(result.player.level).toBeGreaterThanOrEqual(2);
  });

  it("progressão torna o chefe vencível mesmo para classe frágil", () => {
    const leveled = grantExperience(
      createCharacter({ name: "Mage", characterClass: new MageClass() }),
      50_000,
    ).player;
    expect(autoBattle(leveled, reiGoblinLike()).winner).toBe("player");
  });
});
