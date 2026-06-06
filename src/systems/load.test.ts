import { describe, expect, it } from "vitest";
import { WarriorClass } from "../classes";
import { startingFields } from "../content";
import { createCharacter, createInitialGameState, type GameState } from "../core";
import { deserializeGameState, loadGame, type SaveStorage, saveGame } from "./save";

function memoryStorage(): SaveStorage {
  const files = new Map<string, string>();
  return {
    read: async (path) => {
      const data = files.get(path);
      if (data === undefined) {
        throw new Error(`arquivo não encontrado: ${path}`);
      }
      return data;
    },
    write: async (path, data) => {
      files.set(path, data);
    },
    exists: async (path) => files.has(path),
  };
}

function makeState(): GameState {
  const player = createCharacter({ name: "Hero", characterClass: new WarriorClass() });
  const state = createInitialGameState(player, startingFields);
  state.statistics.enemiesDefeated = 3;
  state.inventory.gold = 120;
  return state;
}

describe("loadGame", () => {
  it("restaura o estado salvo (round-trip)", async () => {
    const storage = memoryStorage();
    const original = makeState();
    await saveGame(original, { storage, path: "save.json" });

    const loaded = await loadGame({ storage, path: "save.json" });
    expect(loaded).toEqual(original);
    expect(loaded.statistics.enemiesDefeated).toBe(3);
    expect(loaded.inventory.gold).toBe(120);
  });

  it("lança erro quando não há save", async () => {
    await expect(loadGame({ storage: memoryStorage(), path: "save.json" })).rejects.toThrow();
  });
});

describe("deserializeGameState", () => {
  it("lança erro para JSON inválido", () => {
    expect(() => deserializeGameState("{ não json")).toThrow();
  });

  it("lança erro para estrutura inválida", () => {
    expect(() => deserializeGameState(JSON.stringify({ foo: 1 }))).toThrow();
  });
});
