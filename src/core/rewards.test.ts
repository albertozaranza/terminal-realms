import { describe, expect, it } from "vitest";
import { WarriorClass } from "../classes";
import { camposIniciais, espadaEnferrujada } from "../content";
import { createCharacter } from "./createCharacter";
import { createInitialGameState } from "./GameState";
import { applyVictoryRewards } from "./rewards";

function makeState() {
  const player = createCharacter({ name: "Hero", characterClass: new WarriorClass() });
  return createInitialGameState(player, camposIniciais);
}

describe("applyVictoryRewards", () => {
  it("adiciona ouro e loot ao inventário e conta o inimigo", () => {
    const state = makeState();
    const { state: next } = applyVictoryRewards(state, {
      experience: 10,
      loot: [espadaEnferrujada],
      gold: 30,
    });

    expect(next.inventory.gold).toBe(30);
    expect(next.inventory.items).toContain(espadaEnferrujada);
    expect(next.statistics.enemiesDefeated).toBe(1);
    expect(next.statistics.totalGoldEarned).toBe(30);
    expect(next.statistics.totalExperienceEarned).toBe(10);
  });

  it("sobe de nível quando o XP é suficiente", () => {
    const state = makeState();
    const outcome = applyVictoryRewards(state, { experience: 100, loot: [], gold: 0 });
    expect(outcome.leveledUp).toBe(true);
    expect(outcome.state.player.level).toBeGreaterThanOrEqual(2);
  });

  it("não muta o estado original", () => {
    const state = makeState();
    applyVictoryRewards(state, { experience: 100, loot: [espadaEnferrujada], gold: 50 });
    expect(state.inventory.items).toHaveLength(0);
    expect(state.inventory.gold).toBe(0);
    expect(state.statistics.enemiesDefeated).toBe(0);
    expect(state.player.level).toBe(1);
  });
});
