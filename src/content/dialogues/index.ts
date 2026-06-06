import type { Dialogue } from "../../types";
import { hunterDialogue } from "./hunterDialogue";

export { hunterDialogue } from "./hunterDialogue";

/** Registro de diálogos por id. */
export const DIALOGUES: Readonly<Record<string, Dialogue>> = {
  hunter: hunterDialogue,
};

/** Busca um diálogo pelo id. Retorna undefined se não existir. */
export function findDialogueById(id: string): Dialogue | undefined {
  return DIALOGUES[id];
}
