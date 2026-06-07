import { afterEach, describe, expect, it } from "vitest";
import { WarriorClass } from "../classes";
import { startingFields } from "../content";
import { createCharacter, createInitialGameState } from "../core";
import type { CombatContext, GameIO, RunGameOptions, TravelChoice } from "../game";
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

/** Travels through a fixed sequence of locations, then stays put. */
function travelSequence(ids: readonly string[]): () => Promise<TravelChoice> {
  let index = 0;
  return async () =>
    index < ids.length ? { type: "go", locationId: ids[index++] } : { type: "back" };
}

/** Replays a fixed sequence of menu actions, repeating the last one. */
function sequence<T>(values: readonly T[]): () => Promise<T> {
  let index = 0;
  return async () => values[Math.min(index++, values.length - 1)];
}

/** Replays dialogue option indices, falling back to the last option. */
function talkSequence(
  indices: readonly number[],
): (ctx: { options: readonly unknown[] }) => Promise<number> {
  let index = 0;
  return async (ctx) =>
    index < indices.length ? indices[index++] : Math.max(0, ctx.options.length - 1);
}

/** Attacks; heals from a potion when low and one is available (warrior win path). */
async function smartCombat(context: CombatContext) {
  if (context.player.hp <= 40 && context.items.length > 0) {
    return { type: "item" as const, item: context.items[0].item };
  }
  return "attack" as const;
}

/** Creates a scripted IO for a deterministic playthrough. */
function scriptIO(overrides: Partial<GameIO> = {}): { io: GameIO; outputs: string[] } {
  const outputs: string[] = [];
  const io: GameIO = {
    render: (text) => {
      outputs.push(text);
    },
    mainMenu: sequence(["new", "exit"] as const),
    askName: async () => "Hero",
    chooseClass: async (classes) => classes[0], // Warrior
    chooseLanguage: async (current) => current,
    exploreAction: async () => "travel",
    combatAction: async () => "attack",
    inventory: async () => ({ type: "close" }),
    shop: async () => ({ type: "close" }),
    travel: travelSequence(["road"]),
    talk: async () => 0,
    regionMap: () => {},
    journal: () => {},
    worldMap: () => {},
    ...overrides,
  };
  return { io, outputs };
}

const options = (): RunGameOptions => ({
  storage: memoryStorage(),
  path: "save.json",
  rng: () => 0,
});

describe("runGame — graph playthrough (Dark Woods)", () => {
  it("is playable from start to defeating the Forest Necromancer", async () => {
    const { io, outputs } = scriptIO({
      travel: travelSequence(["road", "woods", "ruins", "crypt", "necromancer"]),
      combatAction: smartCombat,
    });
    await runGame(io, options());
    expect(outputs).toContain(t("game.bossDefeated", { boss: t("name.forest_necromancer") }));
  });

  it("talking to the hunter starts the investigation quest", async () => {
    const { io, outputs } = scriptIO({
      exploreAction: sequence(["travel", "menu"] as const),
      travel: async () => ({ type: "go", locationId: "hunter" }),
      talk: talkSequence([0, 0, 3]),
    });
    await runGame(io, options());
    expect(outputs).toContain(
      t("world.questStarted", { quest: t("quest.investigate_dark_woods.name") }),
    );
  });

  it("reveals the crypt entrance by exploring the ruins (lore)", async () => {
    const { io, outputs } = scriptIO({
      exploreAction: sequence(["travel", "travel", "travel", "menu"] as const),
      travel: travelSequence(["road", "woods", "ruins"]),
      combatAction: smartCombat,
    });
    await runGame(io, options());
    expect(outputs).toContain(t("world.knowledgeGained", { fact: t("knowledge.crypt_entrance") }));
  });

  it("a level 1 Mage is defeated pushing toward the boss", async () => {
    const { io, outputs } = scriptIO({
      chooseClass: async (classes) => classes[2], // Mage
      travel: travelSequence(["road", "woods", "ruins", "crypt", "necromancer"]),
      combatAction: async () => "attack",
    });
    await runGame(io, options());
    expect(outputs).toContain(t("game.defeated"));
  });

  it("allows fleeing from a combat location", async () => {
    const { io } = scriptIO({
      exploreAction: sequence(["travel", "menu"] as const),
      travel: async () => ({ type: "go", locationId: "road" }),
      combatAction: async () => "flee",
    });
    await expect(runGame(io, options())).resolves.toBeUndefined();
  });

  it("hunts a wandering enemy without traveling", async () => {
    const { io, outputs } = scriptIO({
      exploreAction: sequence(["hunt", "menu"] as const),
      combatAction: smartCombat,
    });
    await runGame(io, options());
    expect(outputs).toContain(t("world.hunting"));
    expect(outputs).not.toContain(t("game.defeated"));
  });
});

describe("runGame — menu", () => {
  it("reports when there is no save to continue", async () => {
    const { io, outputs } = scriptIO({
      mainMenu: sequence(["continue", "exit"] as const),
    });
    await runGame(io, options());
    expect(outputs).toContain(t("game.noSave"));
  });

  it("ends when choosing exit", async () => {
    const { io, outputs } = scriptIO({ mainMenu: async () => "exit" });
    await runGame(io, options());
    expect(outputs).toContain(t("game.farewell"));
  });
});

describe("runGame — language", () => {
  it("switches language from the menu and reflects it in the UI", async () => {
    const { io, outputs } = scriptIO({
      mainMenu: sequence(["language", "exit"] as const),
      chooseLanguage: async () => "en",
    });
    await runGame(io, options());
    expect(getLanguage()).toBe("en");
    expect(outputs.some((line) => line.includes("Until the next adventure"))).toBe(true);
  });

  it("restores the persisted language when continuing the save", async () => {
    const opts = options();

    // Saves a (legacy, linear) state created with the language set to English.
    setLanguage("en");
    const state = createInitialGameState(
      createCharacter({ name: "Hero", characterClass: new WarriorClass() }),
      startingFields,
    );
    expect(state.language).toBe("en");
    await saveGame(state, opts);

    setLanguage("pt-BR");
    const { io } = scriptIO({
      mainMenu: sequence(["continue", "exit"] as const),
      exploreAction: async () => "menu",
    });
    await runGame(io, opts);
    expect(getLanguage()).toBe("en");
  });
});
