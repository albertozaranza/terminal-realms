import type { Enemy } from "../../types";
import { forestNecromancer } from "./forestNecromancer";
import { goblinKing } from "./goblinKing";

export { forestNecromancer } from "./forestNecromancer";
export { goblinKing } from "./goblinKing";

/** Registro de chefes por id. */
export const BOSSES: Readonly<Record<string, Enemy>> = {
  goblin_king: goblinKing,
  forest_necromancer: forestNecromancer,
};

/** Busca um chefe pelo id. Retorna undefined se não existir. */
export function findBossById(id: string): Enemy | undefined {
  return BOSSES[id];
}
