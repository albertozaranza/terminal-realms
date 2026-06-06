import { describe, expect, it } from "vitest";
import { WarriorClass } from "../../classes";
import { rustySword, startingFields } from "../../content";
import { createCharacter } from "../createCharacter";
import { createInitialGameState } from "../GameState";
import { applyVictoryRewards } from "../rewards";

function makeState() {
  const player = createCharacter({ name: "Hero", characterClass: new WarriorClass() });
  return createInitialGameState(player, startingFields);
}

describe("applyVictoryRewards", () => {
  it("adds gold and loot to the inventory and counts the enemy", () => {
    const state = makeState();
    const { state: next } = applyVictoryRewards(state, {
      experience: 10,
      loot: [rustySword],
      gold: 30,
    });

    expect(next.inventory.gold).toBe(30);
    expect(next.inventory.items).toContain(rustySword);
    expect(next.statistics.enemiesDefeated).toBe(1);
    expect(next.statistics.totalGoldEarned).toBe(30);
    expect(next.statistics.totalExperienceEarned).toBe(10);
  });

  it("levels up when the XP is enough", () => {
    const state = makeState();
    const outcome = applyVictoryRewards(state, { experience: 100, loot: [], gold: 0 });
    expect(outcome.leveledUp).toBe(true);
    expect(outcome.state.player.level).toBeGreaterThanOrEqual(2);
  });

  it("does not mutate the original state", () => {
    const state = makeState();
    applyVictoryRewards(state, { experience: 100, loot: [rustySword], gold: 50 });
    expect(state.inventory.items).toHaveLength(0);
    expect(state.inventory.gold).toBe(0);
    expect(state.statistics.enemiesDefeated).toBe(0);
    expect(state.player.level).toBe(1);
  });
});
