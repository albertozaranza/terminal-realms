import { describe, expect, it } from "vitest";
import { hunter, hunterDialogue } from "../../content";
import { renderDialogueScreen } from "../screens";

describe("renderDialogueScreen", () => {
  it("renders the NPC speaker, line and numbered options", () => {
    const node = hunterDialogue.nodes[hunterDialogue.start];
    const screen = renderDialogueScreen({ npc: hunter, node, options: node.options }, 70);

    // Nome/ícone do NPC (chave i18n até a T071) e fala atual.
    expect(screen).toContain("🧙");
    expect(screen).toContain(node.text);
    // Opções numeradas.
    expect(screen).toContain("1.");
    expect(screen).toContain(node.options[0].text);
    expect(screen).toContain(`${node.options.length}.`);
  });
});
