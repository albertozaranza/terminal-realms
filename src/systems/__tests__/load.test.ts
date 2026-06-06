import { describe, expect, it } from "vitest";
import { WarriorClass } from "../../classes";
import { rustySword, startingFields } from "../../content";
import { createCharacter, createInitialGameState, type GameState } from "../../core";
import { equip } from "../equipment";
import { deserializeGameState, loadGame, type SaveStorage, saveGame } from "../save";

function memoryStorage(): SaveStorage {
  const files = new Map<string, string>();
  return {
    read: async (path) => {
      const data = files.get(path);
      if (data === undefined) {
        throw new Error(`file not found: ${path}`);
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
  it("restores the saved state (round-trip)", async () => {
    const storage = memoryStorage();
    const original = makeState();
    await saveGame(original, { storage, path: "save.json" });

    const loaded = await loadGame({ storage, path: "save.json" });
    expect(loaded).toEqual(original);
    expect(loaded.statistics.enemiesDefeated).toBe(3);
    expect(loaded.inventory.gold).toBe(120);
  });

  it("throws when there is no save", async () => {
    await expect(loadGame({ storage: memoryStorage(), path: "save.json" })).rejects.toThrow();
  });

  it("persists the loadout across a round-trip", async () => {
    const storage = memoryStorage();
    const original = makeState();
    original.loadout = equip(original.loadout, rustySword).loadout;
    await saveGame(original, { storage, path: "save.json" });

    const loaded = await loadGame({ storage, path: "save.json" });
    expect(loaded.loadout.weapon?.id).toBe("rusty_sword");
  });
});

describe("deserializeGameState", () => {
  it("throws for invalid JSON", () => {
    expect(() => deserializeGameState("{ not json")).toThrow();
  });

  it("throws for an invalid structure", () => {
    expect(() => deserializeGameState(JSON.stringify({ foo: 1 }))).toThrow();
  });

  it("migrates a legacy inventory (bare Item[]) into stacks", () => {
    const legacy = makeState() as unknown as Record<string, unknown>;
    // Formato antigo: items era uma lista de itens crus, com duplicatas soltas.
    legacy.inventory = {
      gold: 50,
      items: [
        { id: "small_potion", name: "name.small_potion", rarity: "common", value: 10 },
        { id: "small_potion", name: "name.small_potion", rarity: "common", value: 10 },
        { id: "rusty_sword", name: "name.rusty_sword", rarity: "common", value: 15 },
      ],
    };

    const migrated = deserializeGameState(JSON.stringify(legacy));
    expect(migrated.inventory.gold).toBe(50);
    // Duas poções viram uma pilha de quantidade 2; a arma fica em pilha própria.
    expect(migrated.inventory.items).toHaveLength(2);
    const potion = migrated.inventory.items.find((slot) => slot.item.id === "small_potion");
    expect(potion?.quantity).toBe(2);
  });
});
