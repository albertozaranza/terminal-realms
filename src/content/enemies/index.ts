import type { Enemy } from "../../types";
import { goblin } from "./goblin";
import { orc } from "./orc";
import { skeleton } from "./skeleton";
import { wolf } from "./wolf";

export { goblin } from "./goblin";
export { orc } from "./orc";
export { skeleton } from "./skeleton";
export { wolf } from "./wolf";

/** Registro de todos os inimigos básicos por id. */
export const ENEMIES: Readonly<Record<string, Enemy>> = {
  goblin,
  wolf,
  skeleton,
  orc,
};

/** Busca um inimigo pelo id. Retorna undefined se não existir. */
export function findEnemyById(id: string): Enemy | undefined {
  return ENEMIES[id];
}
