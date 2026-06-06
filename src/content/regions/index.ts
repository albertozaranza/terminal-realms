import type { Region } from "../../types";
import { darkWoods } from "./darkWoods";
import { startingFields } from "./startingFields";

export { darkWoods } from "./darkWoods";
export { startingFields } from "./startingFields";

/** Registro de regiões por id. */
export const REGIONS: Readonly<Record<string, Region>> = {
  dark_woods: darkWoods,
  starting_fields: startingFields,
};

/**
 * Ordem oficial de progressão entre regiões. O Bosque Sombrio (grafo de
 * descoberta, FASE 16) é a primeira região; os Campos Iniciais (modelo linear
 * legado) seguem registrados para compatibilidade de saves e testes.
 */
export const REGION_ORDER: readonly string[] = ["dark_woods", "starting_fields"];

/** Busca uma região pelo id. Retorna undefined se não existir. */
export function findRegionById(id: string): Region | undefined {
  return REGIONS[id];
}
