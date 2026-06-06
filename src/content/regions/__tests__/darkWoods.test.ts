import { describe, expect, it } from "vitest";
import {
  darkWoods,
  findBossById,
  findDialogueById,
  findEnemyById,
  findKnowledgeById,
  findNpcById,
  findQuestById,
} from "../../index";
import { GENERAL_SHOP } from "../../shops";

const locations = darkWoods.locations ?? [];
const byId = new Map(locations.map((location) => [location.id, location]));

describe("dark woods region graph", () => {
  it("has an entry location that exists in the graph", () => {
    expect(darkWoods.entryLocationId).toBeDefined();
    expect(byId.has(darkWoods.entryLocationId ?? "")).toBe(true);
  });

  it("every connection references an existing location", () => {
    for (const location of locations) {
      for (const connectionId of location.connections) {
        expect(byId.has(connectionId)).toBe(true);
      }
    }
  });

  it("resolves all location content references", () => {
    for (const location of locations) {
      const { content } = location;
      if (content.kind === "combat") {
        expect(findEnemyById(content.enemyId)).toBeDefined();
      } else if (content.kind === "boss") {
        expect(findBossById(content.bossId)).toBeDefined();
      } else if (content.kind === "npc") {
        expect(findNpcById(content.npcId)).toBeDefined();
      } else if (content.kind === "lore") {
        expect(findKnowledgeById(content.knowledgeId)).toBeDefined();
      } else if (content.kind === "shop") {
        // No MVP a loja do mapa usa o estoque fixo (general).
        expect(content.shopId === "general" || content.shopId === "merchant").toBe(true);
      }
    }
  });

  it("requirements reference existing region knowledge", () => {
    const known = new Set((darkWoods.knowledge ?? []).map((fact) => fact.id));
    for (const location of locations) {
      for (const id of location.requirements?.knowledge ?? []) {
        expect(known.has(id)).toBe(true);
      }
    }
  });

  it("the boss is reachable from the entry through the graph", () => {
    const visited = new Set<string>();
    const queue = [darkWoods.entryLocationId ?? ""];
    while (queue.length > 0) {
      const id = queue.shift() as string;
      if (visited.has(id)) {
        continue;
      }
      visited.add(id);
      for (const next of byId.get(id)?.connections ?? []) {
        queue.push(next);
      }
    }
    const boss = locations.find((l) => l.content.kind === "boss");
    expect(boss).toBeDefined();
    expect(visited.has(boss?.id ?? "")).toBe(true);
  });
});

describe("dark woods npc + dialogue + quest integrity", () => {
  it("hunter dialogue effects reference existing knowledge and locations", () => {
    const dialogue = findDialogueById("hunter");
    expect(dialogue).toBeDefined();
    const knownIds = new Set((darkWoods.knowledge ?? []).map((f) => f.id));
    for (const node of Object.values(dialogue?.nodes ?? {})) {
      for (const option of node.options) {
        if (option.effects?.grantKnowledge) {
          expect(knownIds.has(option.effects.grantKnowledge)).toBe(true);
        }
        if (option.effects?.revealLocation) {
          expect(byId.has(option.effects.revealLocation)).toBe(true);
        }
        if (option.effects?.startQuest) {
          expect(findQuestById(option.effects.startQuest)).toBeDefined();
        }
        if (option.goto) {
          expect(dialogue?.nodes[option.goto]).toBeDefined();
        }
      }
    }
  });

  it("quest objectives reference existing knowledge/locations", () => {
    const quest = findQuestById("investigate_dark_woods");
    expect(quest).toBeDefined();
    const knownIds = new Set((darkWoods.knowledge ?? []).map((f) => f.id));
    for (const objective of quest?.objectives ?? []) {
      if (objective.knowledgeId) {
        expect(knownIds.has(objective.knowledgeId)).toBe(true);
      }
      if (objective.locationId) {
        expect(byId.has(objective.locationId)).toBe(true);
      }
    }
  });

  it("the general shop the map points to is non-empty", () => {
    expect(GENERAL_SHOP.length).toBeGreaterThan(0);
  });
});
