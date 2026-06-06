import type { Dialogue } from "../../types";

/**
 * Diálogo do Caçador. Fonte de conhecimento da região: revela os perigos,
 * inicia a investigação e aponta o caminho do bosque. A pista decisiva (a
 * entrada da cripta) não é dada aqui — é encontrada explorando as ruínas.
 */
export const hunterDialogue: Dialogue = {
  id: "hunter",
  start: "root",
  nodes: {
    root: {
      id: "root",
      text: "dialogue.hunter.root",
      options: [
        {
          text: "dialogue.hunter.opt.region",
          effects: { grantKnowledge: "goblins_raid", startQuest: "investigate_dark_woods" },
          goto: "region",
        },
        {
          text: "dialogue.hunter.opt.necromancer",
          effects: { grantKnowledge: "necromancer_seen" },
          goto: "necromancer",
        },
        {
          text: "dialogue.hunter.opt.ruins",
          effects: { grantKnowledge: "ancient_crypt", revealLocation: "woods" },
          goto: "ruins",
        },
        { text: "dialogue.hunter.opt.bye" },
      ],
    },
    region: {
      id: "region",
      text: "dialogue.hunter.region",
      options: [{ text: "dialogue.hunter.opt.back", goto: "root" }],
    },
    necromancer: {
      id: "necromancer",
      text: "dialogue.hunter.necromancer",
      options: [{ text: "dialogue.hunter.opt.back", goto: "root" }],
    },
    ruins: {
      id: "ruins",
      text: "dialogue.hunter.ruins",
      options: [{ text: "dialogue.hunter.opt.back", goto: "root" }],
    },
  },
};
