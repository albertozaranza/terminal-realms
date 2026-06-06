import type { Knowledge, Region } from "../types";

/**
 * Sistema de conhecimento / diário (puro). O conhecimento é a moeda de
 * progressão da exploração: destrava locais, opções de diálogo e chefes.
 *
 * O estado vive em `GameState.knowledge` (ids). Aqui ficam as operações
 * imutáveis sobre essa lista e a montagem do diário da região.
 */

/** Indica se o jogador conhece um fato. */
export function hasKnowledge(known: readonly string[], id: string): boolean {
  return known.includes(id);
}

/** Indica se o jogador conhece todos os fatos informados. */
export function hasAllKnowledge(known: readonly string[], ids: readonly string[]): boolean {
  return ids.every((id) => known.includes(id));
}

/** Adiciona um conhecimento (sem duplicar). Retorna uma nova lista. */
export function addKnowledge(known: readonly string[], id: string): string[] {
  return known.includes(id) ? [...known] : [...known, id];
}

/** Encontra um fato da região pelo id. */
export function findKnowledge(region: Region, id: string): Knowledge | undefined {
  return region.knowledge?.find((fact) => fact.id === id);
}

/** Fatos conhecidos da região (☑ no diário). */
export function getKnownFacts(region: Region, known: readonly string[]): Knowledge[] {
  return (region.knowledge ?? []).filter((fact) => known.includes(fact.id));
}

/** Total de fatos da região e quantos já são conhecidos (para progresso). */
export function knowledgeProgress(
  region: Region,
  known: readonly string[],
): { known: number; total: number } {
  const facts = region.knowledge ?? [];
  return {
    known: facts.filter((fact) => known.includes(fact.id)).length,
    total: facts.length,
  };
}
