import { describe, expect, it } from "vitest";
import { WarriorClass } from "../../classes";
import type { Location, Region } from "../../types";
import { createCharacter } from "../createCharacter";
import { createInitialGameState, type GameState } from "../GameState";
import { applyDialogueEffect, isCompletable, travelTo } from "../WorldMapEngine";

function loc(id: string, connections: string[], extra: Partial<Location> = {}): Location {
  return {
    id,
    name: `name.${id}`,
    icon: "🌲",
    type: "woods",
    coord: { col: 0, row: 0 },
    connections,
    content: { kind: "empty" },
    ...extra,
  };
}

const region: Region = {
  id: "dark_woods",
  name: "name.dark_woods",
  minLevel: 1,
  maxLevel: 5,
  enemyPool: ["goblin"],
  bossId: "necromancer",
  entryLocationId: "village",
  locations: [
    loc("village", ["road"]),
    loc("road", ["village", "ruins"], { content: { kind: "combat", enemyId: "goblin" } }),
    loc("ruins", ["road", "crypt"]),
    loc("crypt", ["ruins"], { requirements: { knowledge: ["crypt_entrance"] } }),
  ],
};

function makeState(): GameState {
  const player = createCharacter({ name: "Hero", characterClass: new WarriorClass() });
  return createInitialGameState(player, region);
}

describe("travelTo", () => {
  it("moves to a reachable neighbor and reveals its connections", () => {
    const state = makeState();
    const result = travelTo(region, state, "road");
    expect(result.state.currentLocationId).toBe("road");
    // Chegar em road revela seus vizinhos (ruins).
    expect(result.state.locationStates.ruins).toBe("discovered");
    expect(result.content).toEqual({ kind: "combat", enemyId: "goblin" });
    expect(result.alreadyCompleted).toBe(false);
  });

  it("throws when the destination is locked (requirement unmet)", () => {
    const state: GameState = {
      ...makeState(),
      locationStates: {
        village: "discovered",
        road: "discovered",
        ruins: "discovered",
        crypt: "discovered",
      },
    };
    expect(() => travelTo(region, state, "crypt")).toThrow();
  });

  it("allows travel to the locked location once knowledge is acquired", () => {
    const state: GameState = {
      ...makeState(),
      knowledge: ["crypt_entrance"],
      locationStates: { ruins: "discovered", crypt: "discovered" },
    };
    expect(travelTo(region, state, "crypt").state.currentLocationId).toBe("crypt");
  });
});

describe("isCompletable", () => {
  it("is true for combat/boss/lore and false for npc/shop/empty", () => {
    expect(isCompletable({ kind: "combat", enemyId: "g" })).toBe(true);
    expect(isCompletable({ kind: "boss", bossId: "b" })).toBe(true);
    expect(isCompletable({ kind: "lore", knowledgeId: "k" })).toBe(true);
    expect(isCompletable({ kind: "npc", npcId: "n" })).toBe(false);
    expect(isCompletable({ kind: "shop", shopId: "s" })).toBe(false);
    expect(isCompletable({ kind: "empty" })).toBe(false);
  });
});

describe("applyDialogueEffect", () => {
  it("grants knowledge and reveals a location (pure state changes)", () => {
    const state = makeState();
    const outcome = applyDialogueEffect(state, {
      grantKnowledge: "crypt_entrance",
      revealLocation: "crypt",
    });
    expect(outcome.state.knowledge).toContain("crypt_entrance");
    expect(outcome.state.locationStates.crypt).toBe("discovered");
  });

  it("returns IO actions (shop/combat/quest) for the orchestrator", () => {
    const outcome = applyDialogueEffect(makeState(), {
      openShop: "merchant",
      startCombat: "goblin",
      startQuest: "find_hunter",
    });
    expect(outcome.openShop).toBe("merchant");
    expect(outcome.startCombat).toBe("goblin");
    expect(outcome.startedQuest).toBe("find_hunter");
  });

  it("is a no-op without an effect", () => {
    const state = makeState();
    expect(applyDialogueEffect(state, undefined).state).toBe(state);
  });
});
