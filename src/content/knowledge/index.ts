import type { Knowledge } from "../../types";
import { darkWoodsKnowledge } from "./darkWoods";

export { darkWoodsKnowledge } from "./darkWoods";

/** Registro de conhecimentos por id (todas as regiões). */
export const KNOWLEDGE: Readonly<Record<string, Knowledge>> = Object.fromEntries(
  darkWoodsKnowledge.map((fact) => [fact.id, fact]),
);

/** Busca um conhecimento pelo id. Retorna undefined se não existir. */
export function findKnowledgeById(id: string): Knowledge | undefined {
  return KNOWLEDGE[id];
}
