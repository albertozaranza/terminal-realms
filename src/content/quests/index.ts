import type { Quest } from "../../types";
import { investigateDarkWoods } from "./investigateDarkWoods";

export { investigateDarkWoods } from "./investigateDarkWoods";

/** Registro de missões por id. */
export const QUESTS: Readonly<Record<string, Quest>> = {
  investigate_dark_woods: investigateDarkWoods,
};

/** Busca uma missão pelo id. Retorna undefined se não existir. */
export function findQuestById(id: string): Quest | undefined {
  return QUESTS[id];
}
