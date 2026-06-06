import type { Enemy } from "../../types";
import { reiGoblin } from "./reiGoblin";

export { reiGoblin } from "./reiGoblin";

/** Registro de chefes por id. */
export const BOSSES: Readonly<Record<string, Enemy>> = {
  rei_goblin: reiGoblin,
};

/** Busca um chefe pelo id. Retorna undefined se não existir. */
export function findBossById(id: string): Enemy | undefined {
  return BOSSES[id];
}
