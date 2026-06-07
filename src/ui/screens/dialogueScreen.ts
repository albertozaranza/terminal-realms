import chalk from "chalk";
import type { DialogueNode, DialogueOption, NPC } from "../../types";
import { t } from "../../utils";
import { panel } from "../components";

/** Dados para desenhar a tela de diálogo de um NPC. */
export interface DialogueScreenView {
  npc: NPC;
  /** Nó atual da conversa (fala do NPC). */
  node: DialogueNode;
  /** Opções disponíveis (já filtradas pelos gates). */
  options: readonly DialogueOption[];
}

/**
 * Tela de conversa com um NPC: a fala atual + as opções numeradas. Apenas
 * renderização; a escolha em si é feita pela camada de IO. A revelação de
 * locais/conhecimento é exibida pelo loop após a escolha (via `render`).
 */
export function renderDialogueScreen(view: DialogueScreenView, width: number): string {
  const { npc, node, options } = view;
  const speaker = `${npc.icon ?? "🧑"} ${t(npc.name)}`;
  const line = chalk.italic(`"${t(node.text)}"`);
  const choices = options
    .map((option, index) => `${chalk.cyan(`${index + 1}.`)} ${t(option.text)}`)
    .join("\n");

  return panel(`${line}\n\n${choices}`, {
    title: speaker,
    width,
    borderColor: "green",
  });
}
