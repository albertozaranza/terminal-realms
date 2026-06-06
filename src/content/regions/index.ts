import type { Region } from "../../types";
import { camposIniciais } from "./camposIniciais";

export { camposIniciais } from "./camposIniciais";

/** Registro de regiões por id. */
export const REGIONS: Readonly<Record<string, Region>> = {
  campos_iniciais: camposIniciais,
};

/** Busca uma região pelo id. Retorna undefined se não existir. */
export function findRegionById(id: string): Region | undefined {
  return REGIONS[id];
}
