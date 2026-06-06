import type { Enemy } from "../../types";
import { goblinKing } from "./goblinKing";

export { goblinKing } from "./goblinKing";

/** Registro de chefes por id. */
export const BOSSES: Readonly<Record<string, Enemy>> = {
  goblin_king: goblinKing,
};

/** Busca um chefe pelo id. Retorna undefined se não existir. */
export function findBossById(id: string): Enemy | undefined {
  return BOSSES[id];
}
