import { describe, expect, it } from "vitest";
import { WarriorClass } from "../../classes";
import { createCharacter, createInitialGameState, type GameState } from "../../core";
import { findItemById } from "../items";
import { camposIniciais } from "../regions";
import { EVENT_IDS, findEventById } from "./index";

function makeState(): GameState {
  const player = createCharacter({ name: "Hero", characterClass: new WarriorClass() });
  return createInitialGameState(player, camposIniciais);
}

describe("eventos aleatórios", () => {
  it("expõe Baú, Emboscada e Mercador", () => {
    expect(EVENT_IDS).toEqual(["chest", "ambush", "merchant"]);
  });

  it("o baú concede ouro e um item existente", () => {
    const result = findEventById("chest")?.execute(makeState());
    expect(result?.goldChange).toBeGreaterThan(0);
    expect(result?.itemId).toBeDefined();
    if (result?.itemId) {
      expect(findItemById(result.itemId)).toBeDefined();
    }
  });

  it("a emboscada inicia combate com um inimigo da região", () => {
    const state = makeState();
    const result = findEventById("ambush")?.execute(state);
    expect(result?.startCombatWith).toBe(state.currentRegion.enemyPool[0]);
  });

  it("o mercador abre uma loja", () => {
    const result = findEventById("merchant")?.execute(makeState());
    expect(result?.openShop).toBe(true);
  });

  it("retorna undefined para evento inexistente", () => {
    expect(findEventById("dragao")).toBeUndefined();
  });
});
