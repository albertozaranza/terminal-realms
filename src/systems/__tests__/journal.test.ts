import { describe, expect, it } from "vitest";
import type { Region } from "../../types";
import {
  addKnowledge,
  findKnowledge,
  getKnownFacts,
  hasAllKnowledge,
  hasKnowledge,
  knowledgeProgress,
} from "../journal";

const region: Region = {
  id: "dark_woods",
  name: "name.dark_woods",
  minLevel: 1,
  maxLevel: 5,
  enemyPool: ["goblin"],
  bossId: "necromancer",
  knowledge: [
    { id: "goblins_raid", text: "knowledge.goblins_raid", regionId: "dark_woods" },
    { id: "necromancer_seen", text: "knowledge.necromancer_seen", regionId: "dark_woods" },
    { id: "crypt_entrance", text: "knowledge.crypt_entrance", regionId: "dark_woods" },
  ],
};

describe("addKnowledge", () => {
  it("adds a new fact without mutating the input", () => {
    const known: string[] = [];
    const next = addKnowledge(known, "goblins_raid");
    expect(next).toEqual(["goblins_raid"]);
    expect(known).toEqual([]);
  });

  it("does not duplicate a known fact", () => {
    expect(addKnowledge(["a"], "a")).toEqual(["a"]);
  });
});

describe("hasKnowledge / hasAllKnowledge", () => {
  it("checks single and multiple facts", () => {
    expect(hasKnowledge(["a"], "a")).toBe(true);
    expect(hasKnowledge(["a"], "b")).toBe(false);
    expect(hasAllKnowledge(["a", "b"], ["a", "b"])).toBe(true);
    expect(hasAllKnowledge(["a"], ["a", "b"])).toBe(false);
  });
});

describe("region journal helpers", () => {
  it("finds a region fact by id", () => {
    expect(findKnowledge(region, "crypt_entrance")?.text).toBe("knowledge.crypt_entrance");
    expect(findKnowledge(region, "nope")).toBeUndefined();
  });

  it("lists only known facts", () => {
    const facts = getKnownFacts(region, ["goblins_raid", "crypt_entrance"]);
    expect(facts.map((f) => f.id)).toEqual(["goblins_raid", "crypt_entrance"]);
  });

  it("reports knowledge progress", () => {
    expect(knowledgeProgress(region, ["goblins_raid"])).toEqual({ known: 1, total: 3 });
  });
});
