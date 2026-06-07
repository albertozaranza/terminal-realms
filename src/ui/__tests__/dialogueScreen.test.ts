import { describe, expect, it } from "vitest";
import { hunter, hunterDialogue } from "../../content";
import { t } from "../../utils";
import { renderDialogueScreen } from "../screens";

describe("renderDialogueScreen", () => {
  it("renders the NPC speaker, line and numbered options", () => {
    const node = hunterDialogue.nodes[hunterDialogue.start];
    const screen = renderDialogueScreen({ npc: hunter, node, options: node.options }, 70);

    // Ícone do NPC e fala atual (localizada).
    expect(screen).toContain("🧙");
    expect(screen).toContain(t(node.text));
    // Opções numeradas.
    expect(screen).toContain("1.");
    expect(screen).toContain(t(node.options[0].text));
    expect(screen).toContain(`${node.options.length}.`);
  });
});
