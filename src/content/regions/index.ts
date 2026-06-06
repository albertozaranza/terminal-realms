import type { Region } from "../../types";
import { camposIniciais } from "./camposIniciais";

export { camposIniciais } from "./camposIniciais";

/** Registro de regiões por id. */
export const REGIONS: Readonly<Record<string, Region>> = {
  campos_iniciais: camposIniciais,
};

/**
 * Ordem oficial de progressão entre regiões. No MVP há apenas a região
 * inicial; novas regiões (Floresta Sombria, etc.) entram em T038.
 */
export const REGION_ORDER: readonly string[] = ["campos_iniciais"];

/** Busca uma região pelo id. Retorna undefined se não existir. */
export function findRegionById(id: string): Region | undefined {
  return REGIONS[id];
}
