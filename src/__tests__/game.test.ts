import { afterEach, describe, expect, it } from "vitest";
import { WarriorClass } from "../classes";
import { startingFields } from "../content";
import { createCharacter, createInitialGameState } from "../core";
import type { GameIO, RunGameOptions } from "../game";
import { runGame } from "../game";
import { type SaveStorage, saveGame } from "../systems";
import { DEFAULT_LANGUAGE, getLanguage, setLanguage, t } from "../utils";

afterEach(() => {
  setLanguage(DEFAULT_LANGUAGE);
});

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

/** Creates a scripted IO for a deterministic playthrough. */
function scriptIO(overrides: Partial<GameIO> = {}): { io: GameIO; outputs: string[] } {
  const outputs: string[] = [];
  let menuCalls = 0;
  const io: GameIO = {
    render: (text) => {
      outputs.push(text);
    },
    mainMenu: async () => (menuCalls++ === 0 ? "new" : "exit"),
    askName: async () => "Hero",
    chooseClass: async (classes) => classes[0], // Warrior
    chooseLanguage: async (current) => current,
    exploreAction: async () => "boss",
    combatAction: async () => "attack",
    inventory: async () => ({ type: "close" }),
    shop: async () => ({ type: "close" }),
    ...overrides,
  };
  return { io, outputs };
}

const options = (): RunGameOptions => ({
  storage: memoryStorage(),
  path: "save.json",
  rng: () => 0,
});

describe("runGame — playthrough", () => {
  it("is playable from start to defeating the Goblin King", async () => {
    const { io, outputs } = scriptIO();
    await runGame(io, options());
    const expected = t("game.bossDefeated", { boss: t("name.goblin_king") });
    expect(outputs).toContain(expected);
  });

  it("a level 1 Mage can be defeated by the boss", async () => {
    const { io, outputs } = scriptIO({
      chooseClass: async (classes) => classes[2], // Mage
    });
    await runGame(io, options());
    expect(outputs).toContain(t("game.defeated"));
  });

  it("reports when there is no save to continue", async () => {
    let menuCalls = 0;
    const { io, outputs } = scriptIO({
      mainMenu: async () => (menuCalls++ === 0 ? "continue" : "exit"),
    });
    await runGame(io, options());
    expect(outputs).toContain(t("game.noSave"));
  });

  it("allows fleeing from combat", async () => {
    let menuCalls = 0;
    let exploreCalls = 0;
    const { io } = scriptIO({
      mainMenu: async () => (menuCalls++ === 0 ? "new" : "exit"),
      exploreAction: async () => (exploreCalls++ === 0 ? "explore" : "menu"),
      combatAction: async () => "flee",
    });
    await expect(runGame(io, options())).resolves.toBeUndefined();
  });

  it("ends when choosing exit", async () => {
    const { io, outputs } = scriptIO({ mainMenu: async () => "exit" });
    await runGame(io, options());
    expect(outputs).toContain(t("game.farewell"));
  });
});

describe("runGame — language", () => {
  it("switches language from the menu and reflects it in the UI", async () => {
    let menuCalls = 0;
    const { io, outputs } = scriptIO({
      mainMenu: async () => (menuCalls++ === 0 ? "language" : "exit"),
      chooseLanguage: async () => "en",
    });
    await runGame(io, options());
    expect(getLanguage()).toBe("en");
    // Farewell message is now in English.
    expect(outputs.some((line) => line.includes("Until the next adventure"))).toBe(true);
  });

  it("restores the persisted language when continuing the save", async () => {
    const opts = options();

    // Saves a state created with the language set to English.
    setLanguage("en");
    const state = createInitialGameState(
      createCharacter({ name: "Hero", characterClass: new WarriorClass() }),
      startingFields,
    );
    expect(state.language).toBe("en");
    await saveGame(state, opts);

    // Switches back to pt-BR and continues: the save's language must be restored.
    setLanguage("pt-BR");
    let menuCalls = 0;
    const { io } = scriptIO({
      mainMenu: async () => (menuCalls++ === 0 ? "continue" : "exit"),
      exploreAction: async () => "menu",
    });
    await runGame(io, opts);
    expect(getLanguage()).toBe("en");
  });
});
