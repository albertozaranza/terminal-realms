import { describe, expect, it } from "vitest";
import type { Dialogue } from "../../types";
import { availableOptions, chooseOption, getNode, getStartNode } from "../dialogue";
import type { DiscoveryContext } from "../discovery";

const dialogue: Dialogue = {
  id: "hunter",
  start: "root",
  nodes: {
    root: {
      id: "root",
      text: "dialogue.hunter.root",
      options: [
        { text: "dialogue.hunter.ask_woods", effects: { grantKnowledge: "necromancer_seen" } },
        { text: "dialogue.hunter.ask_crypt", goto: "crypt", requires: { knowledge: ["ruins"] } },
        { text: "dialogue.hunter.bye" },
      ],
    },
    crypt: {
      id: "crypt",
      text: "dialogue.hunter.crypt",
      options: [{ text: "dialogue.hunter.bye", effects: { revealLocation: "crypt" } }],
    },
  },
};

const ctx: DiscoveryContext = { knowledge: [], level: 1, hasItem: () => false };

describe("getStartNode / getNode", () => {
  it("returns the start node", () => {
    expect(getStartNode(dialogue).id).toBe("root");
  });

  it("returns a node by id and undefined for unknown", () => {
    expect(getNode(dialogue, "crypt")?.id).toBe("crypt");
    expect(getNode(dialogue, "nope")).toBeUndefined();
  });

  it("throws when the start node is missing", () => {
    expect(() => getStartNode({ id: "x", start: "missing", nodes: {} })).toThrow();
  });
});

describe("availableOptions", () => {
  it("hides options whose requirement is not met", () => {
    const visible = availableOptions(dialogue.nodes.root, ctx).map((o) => o.text);
    expect(visible).toEqual(["dialogue.hunter.ask_woods", "dialogue.hunter.bye"]);
  });

  it("shows gated options once the requirement is met", () => {
    const visible = availableOptions(dialogue.nodes.root, { ...ctx, knowledge: ["ruins"] });
    expect(visible).toHaveLength(3);
  });
});

describe("chooseOption", () => {
  it("returns effects and ends when there is no goto", () => {
    const option = dialogue.nodes.root.options[0];
    const step = chooseOption(dialogue, option);
    expect(step.effects).toEqual({ grantKnowledge: "necromancer_seen" });
    expect(step.ends).toBe(true);
    expect(step.nextNode).toBeUndefined();
  });

  it("advances to the next node when goto is set", () => {
    const option = dialogue.nodes.root.options[1];
    const step = chooseOption(dialogue, option);
    expect(step.nextNode?.id).toBe("crypt");
    expect(step.ends).toBe(false);
  });
});
