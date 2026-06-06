import { describe, expect, it } from "vitest";
import { WarriorClass } from "../classes";
import { camposIniciais } from "../content";
import { createCharacter, createInitialGameState, type GameState } from "../core";
import { hasSave, type SaveStorage, saveGame, serializeGameState } from "./save";

function memoryStorage(): { storage: SaveStorage; files: Map<string, string> } {
  const files = new Map<string, string>();
  return {
    files,
    storage: {
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
    },
  };
}

function makeState(): GameState {
  const player = createCharacter({ name: "Hero", characterClass: new WarriorClass() });
  return createInitialGameState(player, camposIniciais);
}

describe("saveGame", () => {
  it("cria o save com o estado serializado", async () => {
    const { storage, files } = memoryStorage();
    const state = makeState();
    await saveGame(state, { storage, path: "save.json" });

    expect(files.has("save.json")).toBe(true);
    expect(JSON.parse(files.get("save.json") ?? "")).toEqual(state);
  });

  it("serializa em JSON válido", () => {
    expect(() => JSON.parse(serializeGameState(makeState()))).not.toThrow();
  });
});

describe("hasSave", () => {
  it("é falso antes de salvar e verdadeiro depois", async () => {
    const { storage } = memoryStorage();
    expect(await hasSave({ storage, path: "save.json" })).toBe(false);
    await saveGame(makeState(), { storage, path: "save.json" });
    expect(await hasSave({ storage, path: "save.json" })).toBe(true);
  });
});
