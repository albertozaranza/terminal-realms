import { describe, expect, it } from "vitest";
import { WarriorClass } from "../../../classes";
import { createCharacter, createInitialGameState, type GameState } from "../../../core";
import { findItemById } from "../../items";
import { startingFields } from "../../regions";
import { EVENT_IDS, findEventById } from "../index";

function makeState(): GameState {
  const player = createCharacter({ name: "Hero", characterClass: new WarriorClass() });
  return createInitialGameState(player, startingFields);
}

describe("random events", () => {
  it("exposes Chest, Ambush and Merchant", () => {
    expect(EVENT_IDS).toEqual(["chest", "ambush", "merchant"]);
  });

  it("the chest grants gold and an existing item", () => {
    const result = findEventById("chest")?.execute(makeState());
    expect(result?.goldChange).toBeGreaterThan(0);
    expect(result?.itemId).toBeDefined();
    if (result?.itemId) {
      expect(findItemById(result.itemId)).toBeDefined();
    }
  });

  it("the ambush starts combat with an enemy from the region", () => {
    const state = makeState();
    const result = findEventById("ambush")?.execute(state);
    expect(result?.startCombatWith).toBe(state.currentRegion.enemyPool[0]);
  });

  it("the merchant opens a shop", () => {
    const result = findEventById("merchant")?.execute(makeState());
    expect(result?.openShop).toBe(true);
  });

  it("returns undefined for a missing event", () => {
    expect(findEventById("dragon")).toBeUndefined();
  });
});
