import { describe, expect, it } from "vitest";
import type { Location, Region } from "../../types";
import {
  canTravelTo,
  type DiscoveryContext,
  getDestinations,
  getLocationState,
  isRevealed,
  markCompleted,
  meetsRequirement,
  reveal,
  revealConnections,
} from "../discovery";

function loc(id: string, connections: string[], requirements?: Location["requirements"]): Location {
  return {
    id,
    name: `name.${id}`,
    icon: "🌲",
    type: "woods",
    coord: { col: 0, row: 0 },
    connections,
    requirements,
    content: { kind: "empty" },
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
    loc("village", ["road", "hunter"]),
    loc("road", ["village", "ruins"]),
    loc("ruins", ["road", "crypt"]),
    loc("crypt", ["ruins"], { knowledge: ["crypt_entrance"] }),
    loc("hunter", ["village"], { level: 3 }),
  ],
};

const baseCtx: DiscoveryContext = { knowledge: [], level: 1, hasItem: () => false };

describe("meetsRequirement", () => {
  it("is true when there is no requirement", () => {
    expect(meetsRequirement(undefined, baseCtx)).toBe(true);
  });

  it("checks level, item and knowledge gates", () => {
    expect(meetsRequirement({ level: 3 }, baseCtx)).toBe(false);
    expect(meetsRequirement({ level: 3 }, { ...baseCtx, level: 3 })).toBe(true);
    expect(meetsRequirement({ itemId: "key" }, baseCtx)).toBe(false);
    expect(meetsRequirement({ itemId: "key" }, { ...baseCtx, hasItem: () => true })).toBe(true);
    expect(meetsRequirement({ knowledge: ["a", "b"] }, { ...baseCtx, knowledge: ["a"] })).toBe(
      false,
    );
    expect(meetsRequirement({ knowledge: ["a"] }, { ...baseCtx, knowledge: ["a"] })).toBe(true);
  });
});

describe("getLocationState", () => {
  it("returns undiscovered for hidden locations", () => {
    const ruins = region.locations?.find((l) => l.id === "ruins") as Location;
    expect(getLocationState(ruins, {}, baseCtx)).toBe("undiscovered");
  });

  it("derives available/locked from requirements once revealed", () => {
    const crypt = region.locations?.find((l) => l.id === "crypt") as Location;
    const states = { crypt: "discovered" as const };
    expect(getLocationState(crypt, states, baseCtx)).toBe("locked");
    expect(getLocationState(crypt, states, { ...baseCtx, knowledge: ["crypt_entrance"] })).toBe(
      "available",
    );
  });

  it("returns completed regardless of requirements", () => {
    const crypt = region.locations?.find((l) => l.id === "crypt") as Location;
    expect(getLocationState(crypt, { crypt: "completed" }, baseCtx)).toBe("completed");
  });
});

describe("reveal / revealConnections", () => {
  it("reveals a hidden location and is idempotent for revealed ones", () => {
    expect(isRevealed({}, "road")).toBe(false);
    const revealed = reveal({}, "road");
    expect(revealed.road).toBe("discovered");
    // Não rebaixa um local concluído.
    expect(reveal({ road: "completed" }, "road").road).toBe("completed");
  });

  it("reveals all direct neighbors (chain discovery)", () => {
    const states = revealConnections(region, {}, "village");
    expect(states.road).toBe("discovered");
    expect(states.hunter).toBe("discovered");
    // Não revela vizinhos de 2º grau.
    expect(states.ruins).toBeUndefined();
  });
});

describe("getDestinations", () => {
  it("lists only revealed neighbors with their display state", () => {
    const states = { village: "discovered" as const, road: "discovered" as const };
    const dests = getDestinations(region, "village", states, baseCtx);
    // hunter é vizinho mas continua oculto.
    expect(dests.map((d) => d.location.id)).toEqual(["road"]);
    expect(dests[0]?.state).toBe("available");
  });

  it("includes locked neighbors but marks them non-travelable", () => {
    const states = { ruins: "discovered" as const, crypt: "discovered" as const };
    const dests = getDestinations(region, "ruins", states, baseCtx);
    const crypt = dests.find((d) => d.location.id === "crypt");
    expect(crypt?.state).toBe("locked");
    expect(canTravelTo(crypt?.state ?? "undiscovered")).toBe(false);
  });
});

describe("markCompleted", () => {
  it("marks a location completed", () => {
    expect(markCompleted({}, "ruins").ruins).toBe("completed");
  });
});
