import type { NPC } from "../../types";
import { hunter } from "./hunter";

export { hunter } from "./hunter";

/** Registro de NPCs por id. */
export const NPCS: Readonly<Record<string, NPC>> = {
  hunter,
};

/** Busca um NPC pelo id. Retorna undefined se não existir. */
export function findNpcById(id: string): NPC | undefined {
  return NPCS[id];
}
