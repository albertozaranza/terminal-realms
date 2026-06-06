import type { Region } from "../../types";
import { startingFields } from "./startingFields";

export { startingFields } from "./startingFields";

/** Registro de regiões por id. */
export const REGIONS: Readonly<Record<string, Region>> = {
  starting_fields: startingFields,
};

/**
 * Ordem oficial de progressão entre regiões. No MVP há apenas a região
 * inicial; novas regiões (Floresta Sombria, etc.) entram em T038.
 */
export const REGION_ORDER: readonly string[] = ["starting_fields"];

/** Busca uma região pelo id. Retorna undefined se não existir. */
export function findRegionById(id: string): Region | undefined {
  return REGIONS[id];
}
